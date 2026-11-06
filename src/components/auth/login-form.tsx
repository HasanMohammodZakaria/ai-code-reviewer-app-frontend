import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { useAuth } from "../../hooks/use-auth";
import { isGoogleEnabled } from "../../lib/google";
import { readRegisteredEmail } from "../../lib/register-redirect";
import { ROUTES, getHomePath } from "../../lib/routes";
import { loginSchema, type LoginValues } from "../../lib/schemas/auth";
import type { NormalizedError } from "../../types/api";
import { FormError, PasswordField, TextField } from "../common/form-controls";
import { Button } from "../ui/button";
import { GoogleButton } from "./google-button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  // Set only when the user has just created an account (see register-form)
  const registeredEmail = readRegisteredEmail(state);

  const [formError, setFormError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: registeredEmail ?? "", password: "" },
  });

  /* After a 429 the buttons stay disabled for a while; no auto-retry */
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

  function handleGoogleError(error: NormalizedError) {
    setFormError(error.message);
    if (error.status === 429) {
      setRateLimited(true);
    }
  }

  const showCreatedNotice = registeredEmail !== null && formError === null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {showCreatedNotice ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <CircleCheck
            className="mt-0.5 size-4 shrink-0 text-success"
            aria-hidden="true"
          />
          <p>Account created. Log in to continue.</p>
        </div>
      ) : null}

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
        // After registering the email is already filled in, so start at the password
        autoFocus={registeredEmail !== null}
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

      {isGoogleEnabled ? (
        <>
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <GoogleButton
            onError={handleGoogleError}
            disabled={rateLimited || isSubmitting}
          />
        </>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to={ROUTES.register} className={linkClass}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
