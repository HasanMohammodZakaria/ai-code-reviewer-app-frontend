import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { normalizeError } from "../../api/errors";
import { useAuth } from "../../hooks/use-auth";
import { useTheme } from "../../hooks/use-theme";
import { isGoogleEnabled } from "../../lib/google";
import { getHomePath } from "../../lib/routes";
import { cn } from "../../lib/utils";
import type { NormalizedError } from "../../types/api";

/** Google draws the button itself and accepts a width of 200 to 400 pixels */
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

type GoogleButtonProps = {
  /** Called with the server or Google error, so the form can show it */
  onError: (error: NormalizedError) => void;
  /** Disable while the form is rate limited */
  disabled?: boolean;
  className?: string;
};

/** "Continue with Google". Renders nothing when no Google Client ID is set */
export function GoogleButton({
  onError,
  disabled = false,
  className,
}: GoogleButtonProps) {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  // Google's button has a fixed pixel width, so measure the space and follow it
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      const next = Math.floor(element.getBoundingClientRect().width);
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!isGoogleEnabled) return null;

  async function handleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      onError({
        status: 0,
        message: "Google did not return a sign-in token. Please try again.",
      });
      return;
    }

    setPending(true);
    try {
      const user = await loginWithGoogle(response.credential);
      navigate(getHomePath(user.role), { replace: true });
    } catch (error) {
      onError(normalizeError(error));
      setPending(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={containerRef}
        aria-busy={pending}
        className={cn(
          "flex min-h-10 w-full justify-center",
          (pending || disabled) && "pointer-events-none opacity-50",
        )}
      >
        {width !== null ? (
          <GoogleLogin
            // A new key redraws Google's button when the theme or the width changes
            key={`${theme}-${width}`}
            onSuccess={handleSuccess}
            onError={() =>
              onError({
                status: 0,
                message:
                  "Google sign-in was cancelled or failed. Please try again.",
              })
            }
            theme={theme === "dark" ? "filled_black" : "outline"}
            size="large"
            shape="rectangular"
            text="continue_with"
            width={String(width)}
          />
        ) : null}
      </div>

      {pending ? (
        <p role="status" className="text-center text-sm text-muted-foreground">
          Signing in with Google...
        </p>
      ) : null}
    </div>
  );
}
