import { useQuery } from "@tanstack/react-query";
import { getStudentDetail } from "../../api/teacher";
import type { NormalizedError } from "../../types/api";
import type { StudentDetail } from "../../types/teacher";
import { queryKeys } from "./keys";

/** One student with summary, projects and score history (GET /teacher/students/:id) */
export function useStudentDetail(id: string | undefined) {
  return useQuery<StudentDetail, NormalizedError>({
    queryKey: queryKeys.teacher.student(id ?? ""),
    queryFn: () => getStudentDetail(id as string),
    enabled: Boolean(id),
  });
}
