import { useQuery } from "@tanstack/react-query";
import { getProjectStats } from "../../api/projects";
import type { NormalizedError } from "../../types/api";
import type { ProjectStats } from "../../types/review";
import { queryKeys } from "./keys";

/**
 * The logged-in user's own numbers: summary, all projects (with latest score)
 * and the last 20 reviews. The dashboard home and My projects both read this,
 * so one request feeds both and the second page opens instantly from cache.
 */
export function useProjectStats() {
  return useQuery<ProjectStats, NormalizedError>({
    queryKey: queryKeys.projectStats,
    queryFn: getProjectStats,
  });
}
