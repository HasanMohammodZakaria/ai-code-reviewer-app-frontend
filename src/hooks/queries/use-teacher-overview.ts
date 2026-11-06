import { useQuery } from "@tanstack/react-query";
import { getTeacherOverview } from "../../api/teacher";
import type { NormalizedError } from "../../types/api";
import type { TeacherOverview } from "../../types/teacher";
import { queryKeys } from "./keys";

/** Class totals, average scores, issue totals and the score bands (GET /teacher/overview) */
export function useTeacherOverview() {
  return useQuery<TeacherOverview, NormalizedError>({
    queryKey: queryKeys.teacher.overview,
    queryFn: getTeacherOverview,
  });
}
