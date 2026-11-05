import { useQuery } from "@tanstack/react-query";
import { getReview } from "../../api/reviews";
import type { NormalizedError } from "../../types/api";
import type { Review } from "../../types/review";
import { queryKeys } from "./keys";

/**
 * One full review with all issues (GET /reviews/:id).
 * A teacher can read any review. Pass undefined while the id is not known yet.
 */
export function useReview(id: string | undefined) {
  return useQuery<Review, NormalizedError>({
    queryKey: queryKeys.review(id ?? ""),
    queryFn: () => getReview(id as string),
    enabled: Boolean(id),
  });
}
