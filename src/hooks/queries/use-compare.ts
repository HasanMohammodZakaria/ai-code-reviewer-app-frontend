import { useQuery } from "@tanstack/react-query";
import { COMPARE_MAX, COMPARE_MIN, compareStudents } from "../../api/teacher";
import type { NormalizedError } from "../../types/api";
import type { CompareStudent } from "../../types/teacher";
import { queryKeys } from "./keys";

/** 2 to 10 students side by side (GET /teacher/compare). Idle until the id count is valid */
export function useCompare(ids: string[]) {
  const isValid = ids.length >= COMPARE_MIN && ids.length <= COMPARE_MAX;

  return useQuery<CompareStudent[], NormalizedError>({
    queryKey: queryKeys.teacher.compare(ids),
    queryFn: () => compareStudents(ids),
    enabled: isValid,
  });
}
