import { Clock, Loader2, TriangleAlert, X } from "lucide-react";
import type { RunReviewFlow } from "../../hooks/use-run-review-flow";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

/** A review takes 5 to 40 seconds, so the bar fills over 40 seconds and then waits */
const EXPECTED_SECONDS = 40;
const MAX_BAR_PERCENT = 95;

type RunReviewStatusProps = {
  flow: RunReviewFlow;
  className?: string;
};

/**
 * Shown under the project header, full width: the progress while a review runs
 * and the error rules afterwards. Renders nothing when idle.
 */
export function RunReviewStatus({ flow, className }: RunReviewStatusProps) {
  const {
    isRunning,
    elapsedSeconds,
    progressMessage,
    error,
    isRateLimited,
    dismissError,
  } = flow;

  if (isRunning) {
    const percent = Math.min(
      MAX_BAR_PERCENT,
      Math.round((elapsedSeconds / EXPECTED_SECONDS) * 100),
    );

    return (
      <div
        role="status"
        className={cn(
          "space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <Loader2
            className="mt-0.5 size-5 shrink-0 animate-spin text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-card-foreground">
              Reviewing your project
            </p>
            <p className="text-sm text-muted-foreground">{progressMessage}</p>
            <p className="text-xs text-muted-foreground">
              This usually takes 5 to 40 seconds. Please keep this page open.
            </p>
          </div>
        </div>

        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }

  if (!error) return null;

  // No answer at all (timeout or lost connection): the review may exist anyway
  const noAnswer = error.status === 0;
  const waitTone = isRateLimited || noAnswer;
  const Icon = isRateLimited ? Clock : TriangleAlert;

  let title = "The review could not be completed";
  let message = error.message;

  if (error.status === 403) {
    title = "You do not have permission";
    message = "Only the owner of a project can run a review on it.";
  } else if (error.status === 404) {
    title = "Project not found";
    message = "This project no longer exists, or you cannot see it.";
  } else if (isRateLimited) {
    title = "Too many reviews";
  } else if (error.status === 503) {
    title = "Review is unavailable";
  } else if (noAnswer) {
    title = "No answer from the server";
    message = `${error.message} The review may have finished anyway: check the review history below before running it again.`;
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 sm:p-5",
        waitTone
          ? "border-warning/40 bg-warning/10"
          : "border-destructive/40 bg-destructive/10",
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          waitTone ? "text-warning" : "text-destructive",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="wrap-break-word text-sm text-muted-foreground">
          {message}
        </p>
        {isRateLimited ? (
          <p className="text-xs text-muted-foreground">
            Run review stays off until you dismiss this message. You can try
            again once the wait is over.
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={dismissError}
        aria-label="Dismiss message"
        className="-mr-2 -mt-1 shrink-0"
      >
        <X />
      </Button>
    </div>
  );
}
