import type { ReactNode } from "react";
import {
  Clock,
  Loader2,
  SearchX,
  ShieldX,
  TriangleAlert,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { NormalizedError } from "../../types/api";
import { Button } from "../ui/button";

type ErrorStateProps = {
  /** The normalized error from the api layer. Decides the icon, title and retry */
  error?: NormalizedError | null;
  /** Override the title */
  title?: string;
  /** Override the message. Without it the server message is shown */
  message?: string;
  /** Shows a "Try again" button (hidden for 403, 404 and 429) */
  onRetry?: () => void;
  isRetrying?: boolean;
  /** Extra button or link, e.g. "Back to projects" */
  action?: ReactNode;
  className?: string;
};

type ErrorView = {
  icon: LucideIcon;
  title: string;
  /** Fixed text. When missing, the server message is used */
  message?: string;
  canRetry: boolean;
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

function getErrorView(error?: NormalizedError | null): ErrorView {
  switch (error?.status) {
    case 403:
      return {
        icon: ShieldX,
        title: "You do not have permission",
        message: "You are not allowed to view or do this.",
        canRetry: false,
      };
    case 404:
      return {
        icon: SearchX,
        title: "Not found",
        message: "This item does not exist, or you cannot see it.",
        canRetry: false,
      };
    case 429:
      // The server message says how long to wait. No retry: the action stays disabled
      return { icon: Clock, title: "Too many requests", canRetry: false };
    case 502:
    case 503:
      return {
        icon: TriangleAlert,
        title: "Service unavailable",
        canRetry: true,
      };
    case 0:
      return {
        icon: WifiOff,
        title: "Cannot reach the server",
        canRetry: true,
      };
    default:
      return {
        icon: TriangleAlert,
        title: "Something went wrong",
        canRetry: true,
      };
  }
}

/** Error message with an icon. Behaves by status: 403, 404 and 429 never show retry */
export function ErrorState({
  error,
  title,
  message,
  onRetry,
  isRetrying = false,
  action,
  className,
}: ErrorStateProps) {
  const view = getErrorView(error);
  const Icon = view.icon;
  const text = message ?? view.message ?? error?.message ?? DEFAULT_MESSAGE;
  const showRetry = Boolean(onRetry) && view.canRetry;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-10 text-center sm:px-8 sm:py-14",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <div className="max-w-md space-y-1">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {title ?? view.title}
        </h3>
        <p className="wrap-break-word text-sm text-muted-foreground">{text}</p>
      </div>

      {showRetry || action ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {showRetry ? (
            <Button
              type="button"
              variant="outline"
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying ? <Loader2 className="animate-spin" /> : null}
              Try again
            </Button>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
