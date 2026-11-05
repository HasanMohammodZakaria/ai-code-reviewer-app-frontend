import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { registerSchema, type RegisterValues } from "../../lib/schemas/auth";
import { FormError, PasswordField, TextField } from "../common/form-controls";
import { Button } from "../ui/button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: null,
    },
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
    setFormError(null);

    try {
      const user = await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        image: values.image,
      });
      navigate(getHomePath(user.role), { replace: true });
    } catch (error) {
      const normalized = normalizeError(error);

      // 409: the email is already registered
      if (normalized.status === 409) {
        setError("email", { message: normalized.message });
        return;
      }

      const fieldErrors = getFieldErrors(normalized);
      let matchedField = false;

      (["fullName", "email", "password", "image"] as const).forEach((name) => {
        const message = fieldErrors[name];
        if (message) {
          setError(name, { message });
          matchedField = true;
        }
      });

      if (!matchedField) {
        setFormError(normalized.message);
      }
      if (normalized.status === 429) {
        setRateLimited(true);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormError message={formError} />

      <TextField
        label="Full name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        autoComplete="new-password"
        hint="8 to 72 characters, with at least one letter and one number."
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <TextField
        label="Profile image (optional)"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hint="JPEG, PNG or WebP, up to 2 MB."
        error={errors.image?.message}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          setValue("image", file, { shouldValidate: true, shouldDirty: true });
        }}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || rateLimited}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to={ROUTES.login} className={linkClass}>
          Log in
        </Link>
      </p>
    </form>
  );
}
