import { useMutation, useQueryClient } from "@tanstack/react-query";
import { runReview } from "../../api/reviews";
import type { NormalizedError } from "../../types/api";
import type { Review } from "../../types/review";
import { queryKeys } from "./keys";

/**
 * Run a review on a project (POST /projects/:id/reviews). Owner only.
 * One long request (5 to 40 seconds), so the page shows a progress state while
 * isPending is true and keeps the button disabled.
 * Variables: the project id.
 */
export function useRunReview() {
  const queryClient = useQueryClient();

  return useMutation<Review, NormalizedError, string>({
    mutationFn: runReview,
    onSuccess: (review, projectId) => {
      // The response already holds the full review with issues, so its page opens instantly
      queryClient.setQueryData(queryKeys.review(review._id), review);

      // Score, review count and chart history changed
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projectStats }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectReviews(projectId),
        }),
      ]);
    },
  });
}
