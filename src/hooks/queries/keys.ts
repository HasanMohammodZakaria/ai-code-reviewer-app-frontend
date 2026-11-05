import type { StudentListQuery } from "../../types/teacher";

/**
 * Every TanStack Query key in one place. Query hooks read from here and
 * mutation hooks invalidate with these, so a typo can never leave a list stale.
 */
export const queryKeys = {
  /** GET /projects/stats: summary, project list, last 20 reviews */
  projectStats: ["projects", "stats"] as const,

  /** GET /projects/:id */
  project: (id: string) => ["projects", "detail", id] as const,

  /** GET /projects/:id/reviews */
  projectReviews: (projectId: string) =>
    ["projects", "reviews", projectId] as const,

  /** GET /reviews/:id */
  review: (id: string) => ["reviews", "detail", id] as const,

  teacher: {
    /** Everything under the teacher dashboard */
    all: ["teacher"] as const,
    overview: ["teacher", "overview"] as const,
    students: (query: StudentListQuery) =>
      ["teacher", "students", query] as const,
    student: (id: string) => ["teacher", "student", id] as const,
    compare: (ids: string[]) => ["teacher", "compare", ids] as const,
  },
};
