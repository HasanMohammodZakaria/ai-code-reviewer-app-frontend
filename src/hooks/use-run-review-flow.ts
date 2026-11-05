import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { isNormalizedError } from "../api/errors";
import { reviewPath } from "../lib/routes";
import { queryKeys } from "./queries/keys";
import { useRunReview } from "./queries/use-run-review";

/** Message for the seconds the review has been running. A review takes 5 to 40 seconds */
function getProgressMessage(seconds: number): string {
  if (seconds < 5) return "Reading your code...";
  if (seconds < 15) return "Running the linter and the AI reviewer...";
  if (seconds < 30) return "Still working. Larger projects take longer.";
  return "Almost there. A review can take up to 40 seconds.";
}

/**
 * Everything about running a review on one project: the long request, the
 * seconds counter, the progress text and the error rules. Call it once in the
 * detail view and pass the result to the button and the status block.
 */
export function useRunReviewFlow(projectId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, reset } = useRunReview();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Count seconds only while the request runs
  useEffect(() => {
    if (!isPending) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPending]);

  const run = useCallback(async () => {
    if (isPending) return;

    setElapsedSeconds(0);

    try {
      const review = await mutateAsync(projectId);
      // The user may have left the page during the wait: do not pull them back.
      // The review is already in the cache, so it is waiting in the history.
      if (mountedRef.current) navigate(reviewPath(review._id));
    } catch (caught) {
      // No answer at all (timeout or lost connection): the server may have
      // finished the review anyway, so fetch the history again
      if (isNormalizedError(caught) && caught.status === 0) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.projectReviews(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.projectStats,
        });
      }
      // The error itself is shown by the status block, from `error`
    }
  }, [isPending, mutateAsync, navigate, projectId, queryClient]);

  /** Rate limited (429): the button stays disabled while this message is shown */
  const isRateLimited = error?.status === 429;

  return {
    run,
    isRunning: isPending,
    canRun: !isPending && !isRateLimited,
    elapsedSeconds,
    progressMessage: getProgressMessage(elapsedSeconds),
    error: error ?? null,
    isRateLimited,
    /** Hide the error. After a 429 this also enables the button again */
    dismissError: reset,
  };
}

export type RunReviewFlow = ReturnType<typeof useRunReviewFlow>;
