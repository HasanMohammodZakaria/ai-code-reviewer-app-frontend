import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CircleAlert, CircleCheck } from "lucide-react";
import { resetPassword } from "../../api/auth";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { ROUTES } from "../../lib/routes";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../../lib/schemas/auth";
import { FormError, PasswordField } from "../common/form-controls";
import { Button } from "../ui/button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function ResetForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  /* After a 429 the button stays disabled for a while; no auto-retry */
  useEffect(() => {
    if (!rateLimited) return;
    const timer = window.setTimeout(
      () => setRateLimited(false),
      RATE_LIMIT_COOLDOWN_MS,
    );
    return () => window.clearTimeout(timer);
  }, [rateLimited]);

  const onSubmit = handleSubmit(async (values) => {
    if (!token) return;
    setFormError(null);

    try {
      const message = await resetPassword({
        token,
        password: values.password,
      });
      setSuccessMessage(message);
    } catch (error) {
      const normalized = normalizeError(error);
      const passwordMessage = getFieldErrors(normalized).password;

      if (passwordMessage) {
        setError("password", { message: passwordMessage });
      } else {
        setFormError(normalized.message);
      }
      if (normalized.status === 429) {
        setRateLimited(true);
      }
    }
  });

  if (successMessage) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <CircleCheck
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>{successMessage}</p>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={() => navigate(ROUTES.login, { replace: true })}
        >
          Go to log in
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-4">
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            This reset link is missing its token. Open the link from your email
            again, or request a new one.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Link to={ROUTES.forgotPassword} className={linkClass}>
            Request a new link
          </Link>
          <Link to={ROUTES.login} className={linkClass}>
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={formError} />

      <PasswordField
        label="New password"
        autoComplete="new-password"
        hint="8 to 72 characters, with at least one letter and one number."
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || rateLimited}
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Link expired?{" "}
        <Link to={ROUTES.forgotPassword} className={linkClass}>
          Request a new one
        </Link>
      </p>
    </form>
  );
}
