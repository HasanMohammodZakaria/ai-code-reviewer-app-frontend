import { Loader2, Play } from "lucide-react";
import type { RunReviewFlow } from "../../hooks/use-run-review-flow";
import { Button } from "../ui/button";

type RunReviewButtonProps = {
  flow: RunReviewFlow;
  className?: string;
};

/**
 * The "Run review" button. Show it only to the project owner (the header does
 * that), because a teacher or any other user gets 403 from the server.
 */
export function RunReviewButton({ flow, className }: RunReviewButtonProps) {
  const { run, isRunning, canRun, elapsedSeconds } = flow;

  return (
    <Button
      type="button"
      onClick={() => void run()}
      disabled={!canRun}
      aria-busy={isRunning}
      className={className}
    >
      {isRunning ? <Loader2 className="animate-spin" /> : <Play />}
      {isRunning ? (
        <>
          Reviewing...
          <span className="tabular-nums" aria-hidden="true">
            {elapsedSeconds}s
          </span>
        </>
      ) : (
        "Run review"
      )}
    </Button>
  );
}
