import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStudents } from "../../api/teacher";
import type { NormalizedError } from "../../types/api";
import type {
  StudentListQuery,
  StudentListResponse,
} from "../../types/teacher";
import { queryKeys } from "./keys";

/**
 * One page of students (GET /teacher/students). The previous page stays on
 * screen while the next one loads, so the table does not flash empty on
 * every sort, search or page change.
 */
export function useStudents(query: StudentListQuery) {
  return useQuery<StudentListResponse, NormalizedError>({
    queryKey: queryKeys.teacher.students(query),
    queryFn: () => getStudents(query),
    placeholderData: keepPreviousData,
  });
}
