import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type {
  CompareResponse,
  CompareStudent,
  StudentDetail,
  StudentListQuery,
  StudentListResponse,
  TeacherOverview,
} from "../types/teacher";

/** The backend accepts 2 to 10 student ids */
export const COMPARE_MIN = 2;
export const COMPARE_MAX = 10;

export async function getTeacherOverview(): Promise<TeacherOverview> {
  const response =
    await api.get<ApiSuccess<TeacherOverview>>("/teacher/overview");
  return response.data.data;
}

export async function getStudents(
  query: StudentListQuery = {},
): Promise<StudentListResponse> {
  const params: Record<string, string | number> = {};

  if (query.page !== undefined) params.page = query.page;
  if (query.limit !== undefined) params.limit = query.limit;
  if (query.sort !== undefined) params.sort = query.sort;
  if (query.order !== undefined) params.order = query.order;

  const search = query.search?.trim();
  if (search) params.search = search;

  const response = await api.get<ApiSuccess<StudentListResponse>>(
    "/teacher/students",
    { params },
  );
  return response.data.data;
}

export async function getStudentDetail(id: string): Promise<StudentDetail> {
  const response = await api.get<ApiSuccess<StudentDetail>>(
    `/teacher/students/${id}`,
  );
  return response.data.data;
}

/** ids: 2 to 10 student ids. One id gives a 400, a non-student id gives a 404 */
export async function compareStudents(
  ids: string[],
): Promise<CompareStudent[]> {
  const response = await api.get<ApiSuccess<CompareResponse>>(
    "/teacher/compare",
    {
      params: { ids: ids.join(",") },
    },
  );
  return response.data.data.students;
}
