import { useQuery } from "@tanstack/react-query";
import { getProjectReviews } from "../../api/reviews";
import type { NormalizedError } from "../../types/api";
import type { ReviewListItem } from "../../types/review";
import { queryKeys } from "./keys";

/**
 * Review history of one project (GET /projects/:id/reviews):
 * newest first, without issues. Pass undefined while the id is not known yet.
 */
export function useProjectReviews(projectId: string | undefined) {
  return useQuery<ReviewListItem[], NormalizedError>({
    queryKey: queryKeys.projectReviews(projectId ?? ""),
    queryFn: () => getProjectReviews(projectId as string),
    enabled: Boolean(projectId),
  });
}
