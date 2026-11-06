import type { UserRole } from "../types/user";

export const ROUTES = {
  /** The public landing page */
  landing: "/",

  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  dashboard: "/dashboard",
  projects: "/projects",
  newProject: "/projects/new",
  settings: "/settings",

  teacher: "/teacher",
  teacherStudents: "/teacher/students",
  teacherCompare: "/teacher/compare",
} as const;

export function projectPath(id: string): string {
  return `/projects/${id}`;
}

export function reviewPath(id: string): string {
  return `/reviews/${id}`;
}

export function studentPath(id: string): string {
  return `/teacher/students/${id}`;
}

export function comparePath(ids: string[]): string {
  return `${ROUTES.teacherCompare}?ids=${ids.join(",")}`;
}

/** Where a user lands after login, and where a wrong-role visit is sent */
export function getHomePath(role: UserRole): string {
  return role === "teacher" ? ROUTES.teacher : ROUTES.dashboard;
}
