import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type {
  Review,
  ReviewListItem,
  ReviewListResponse,
  ReviewResponse,
} from "../types/review";

/** A review is one long synchronous request (5 to 40 seconds) */
const RUN_REVIEW_TIMEOUT_MS = 90_000;

/** Owner only. A teacher gets 403, so the UI hides the button up front */
export async function runReview(projectId: string): Promise<Review> {
  const response = await api.post<ApiSuccess<ReviewResponse>>(
    `/projects/${projectId}/reviews`,
    undefined,
    { timeout: RUN_REVIEW_TIMEOUT_MS },
  );
  return response.data.data.review;
}

/** Newest first, without issues */
export async function getProjectReviews(
  projectId: string,
): Promise<ReviewListItem[]> {
  const response = await api.get<ApiSuccess<ReviewListResponse>>(
    `/projects/${projectId}/reviews`,
  );
  return response.data.data.reviews;
}

/** Full review with all issues */
export async function getReview(id: string): Promise<Review> {
  const response = await api.get<ApiSuccess<ReviewResponse>>(`/reviews/${id}`);
  return response.data.data.review;
}
