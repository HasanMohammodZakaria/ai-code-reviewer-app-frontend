import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { forgotPassword } from "../../api/auth";
import { getFieldErrors, normalizeError } from "../../api/errors";
import { ROUTES } from "../../lib/routes";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../../lib/schemas/auth";
import { FormError, TextField } from "../common/form-controls";
import { Button } from "../ui/button";

const RATE_LIMIT_COOLDOWN_MS = 60_000;

const linkClass =
  "rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function ForgotForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
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
      const message = await forgotPassword(values.email);
      setSentMessage(message);
    } catch (error) {
      const normalized = normalizeError(error);
      const emailMessage = getFieldErrors(normalized).email;

      if (emailMessage) {
        setError("email", { message: emailMessage });
      } else {
        setFormError(normalized.message);
      }
      if (normalized.status === 429) {
        setRateLimited(true);
      }
    }
  });

  if (sentMessage) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <MailCheck
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>{sentMessage}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          Check your inbox and spam folder. The link opens a page where you can
          choose a new password.
        </p>

        <div className="flex items-center justify-between gap-4">
          <Link to={ROUTES.login} className={linkClass}>
            Back to log in
          </Link>
          <button
            type="button"
            className={linkClass}
            onClick={() => setSentMessage(null)}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

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

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || rateLimited}
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to={ROUTES.login} className={linkClass}>
          Back to log in
        </Link>
      </p>
    </form>
  );
}
