import type { IssueCounts, Paginated } from "./api";
import type { ProjectWithScore } from "./project";
import type { ReviewHistoryItem, ScoreSummary } from "./review";

/** One bar of the score bands chart, e.g. { label: "40-59", projects: 2 } */
export type ScoreBand = {
  label: string;
  projects: number;
};

/** Data of GET /teacher/overview */
export type TeacherOverview = {
  students: number;
  projects: number;
  reviews: number;
  /** null when no reviews exist */
  avgScore: number | null;
  /** null when no reviews exist */
  avgLatestProjectScore: number | null;
  issueTotals: IssueCounts;
  scoreBands: ScoreBand[];
};

/** The student fields shown in lists and detail pages */
export type StudentInfo = {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
  createdAt: string;
};

//** One item of GET /teacher/students */
export type StudentListItem = ScoreSummary & {
  student: StudentInfo;
};

/** Data of GET /teacher/students */
export type StudentListResponse = Paginated<StudentListItem>;

/** Allowed values of the `sort` query */
export type StudentSortField =
  | "latestScore"
  | "avgScore"
  | "reviewCount"
  | "projectCount"
  | "name";

export type SortOrder = "asc" | "desc";

/** Query of GET /teacher/students */
export type StudentListQuery = {
  page?: number;
  limit?: number;
  sort?: StudentSortField;
  order?: SortOrder;
  search?: string;
};

/** Data of GET /teacher/students/:id */
export type StudentDetail = {
  student: StudentInfo;
  summary: ScoreSummary;
  projects: ProjectWithScore[];
  /** Every review of the student, oldest first */
  history: ReviewHistoryItem[];
};

/** One point of a compare history */
export type CompareHistoryPoint = {
  createdAt: string;
  qualityScore: number;
};

/** One student of GET /teacher/compare */
export type CompareStudent = StudentListItem & {
  history: CompareHistoryPoint[];
};

/** Data of GET /teacher/compare */
export type CompareResponse = {
  students: CompareStudent[];
};
