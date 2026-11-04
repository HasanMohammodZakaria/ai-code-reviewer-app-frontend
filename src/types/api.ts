import type { User } from "./user";

/** Success envelope: { success: true, message?, data } */
export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

/** One validation problem, e.g. { field: "body.email", message: "..." } */
export type ApiErrorDetail = {
  field: string;
  message: string;
};

/** Error envelope sent by the backend */
export type ApiErrorBody = {
  success: false;
  message: string;
  details?: ApiErrorDetail[];
};

/** The one error shape every page handles (built in api/errors.ts) */
export type NormalizedError = {
  status: number;
  message: string;
  details?: ApiErrorDetail[];
};

/** Paginated list: GET /projects, GET /teacher/students */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

/** Data of register, login, refresh, google login, change password */
export type AuthResponse = {
  user: User;
  accessToken: string;
};

/** Data of GET /auth/me and PATCH /auth/me */
export type UserResponse = {
  user: User;
};

/** Issue counts by severity, used in many responses */
export type IssueCounts = {
  high: number;
  medium: number;
  low: number;
};
