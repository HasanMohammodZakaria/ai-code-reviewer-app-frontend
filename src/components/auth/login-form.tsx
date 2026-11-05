import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useAuth } from "../../hooks/use-auth";
import { ROUTES, getHomePath } from "../../lib/routes";
import { loginSchema, type LoginValues } from "../../lib/schemas/auth";
import { FormError, PasswordField, TextField } from "../common/form-controls";
import { Button } from "../ui/button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
      const user = await login(values);
      navigate(getHomePath(user.role), { replace: true });
    } catch (error) {
      const normalized = normalizeError(error);
      const fieldErrors = getFieldErrors(normalized);
      let matchedField = false;

      (["email", "password"] as const).forEach((name) => {
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
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordField
        label="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex justify-end">
        <Link to={ROUTES.forgotPassword} className={linkClass}>
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || rateLimited}
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to={ROUTES.register} className={linkClass}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
