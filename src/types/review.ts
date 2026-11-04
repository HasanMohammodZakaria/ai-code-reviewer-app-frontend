import type { IssueCounts } from "./api";
import type { ProjectWithScore } from "./project";

export type Severity = "high" | "medium" | "low";

export type Category = "bug" | "security" | "style" | "improvement";

export type IssueSource = "lint" | "llm" | "lint+llm";

export type ReviewMode = "ai+lint" | "ai-only" | "lint-only";

export type Issue = {
  file: string;
  line: number;
  severity: Severity;
  category: Category;
  message: string;
  rule?: string;
  explanation?: string;
  suggestedFix?: string;
  source: IssueSource;
};

export type Review = {
  _id: string;
  project: string;
  requestedBy: string;
  reviewMode: ReviewMode;
  provider?: string;
  model?: string;
  summary: string;
  qualityScore: number;
  issueCounts: IssueCounts;
  filesReviewed: number;
  filesSkipped: string[];
  unlintedLanguages: string[];
  /** Not present in the history list (GET /projects/:id/reviews) */
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
};

/** Items of GET /projects/:id/reviews: a Review without issues */
export type ReviewListItem = Omit<Review, "issues">;

/** Data of POST /projects/:id/reviews and GET /reviews/:id */
export type ReviewResponse = {
  review: Review;
};

/** Data of GET /projects/:id/reviews */
export type ReviewListResponse = {
  reviews: ReviewListItem[];
};

/** One point of a score history, ready for a line chart (oldest first) */
export type ReviewHistoryItem = {
  _id: string;
  project: string;
  qualityScore: number;
  issueCounts: IssueCounts;
  reviewMode: ReviewMode;
  createdAt: string;
};

/** Numbers shared by the student stats and the teacher's student summary */
export type ScoreSummary = {
  projectCount: number;
  reviewCount: number;
  latestScore: number | null;
  avgScore: number | null;
  lastReviewAt: string | null;
  issueTotals: IssueCounts;
};

/** Data of GET /projects/stats */
export type ProjectStats = {
  summary: ScoreSummary;
  projects: ProjectWithScore[];
  /** Last 20 reviews, oldest first */
  history: ReviewHistoryItem[];
};
