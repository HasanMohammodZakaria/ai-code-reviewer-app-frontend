import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useChangePassword } from "../../hooks/queries/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../../lib/schemas/auth";
import { FormError, PasswordField } from "../common/form-controls";
import { Button } from "../ui/button";

const EMPTY_VALUES: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

/** Change the password. A wrong current password comes back as a 400 and is shown on the form. */
export function PasswordForm() {
  const { mutateAsync } = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSaved(false);

    try {
      await mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset(EMPTY_VALUES);
      setSaved(true);
    } catch (caught) {
      const normalized = normalizeError(caught);
      let matchedField = false;

      Object.entries(getFieldErrors(normalized)).forEach(([name, message]) => {
        if (name === "currentPassword" || name === "newPassword") {
          setError(name, { message });
          matchedField = true;
        }
      });

      if (!matchedField) setFormError(normalized.message);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormError message={formError} />

      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
        <PasswordField
          label="Current password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword", { onChange: () => setSaved(false) })}
        />
        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint="8 to 72 characters, with at least one letter and one number."
          error={errors.newPassword?.message}
          {...register("newPassword", { onChange: () => setSaved(false) })}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          {...register("confirmNewPassword", {
            onChange: () => setSaved(false),
          })}
        />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? "Saving..." : "Change password"}
        </Button>
        {saved ? (
          <p role="status" className="text-sm text-muted-foreground">
            Password changed. You were logged out on your other devices.
          </p>
        ) : null}
      </div>
    </form>
  );
}
