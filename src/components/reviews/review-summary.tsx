import { Bot, Calendar, FileCode2 } from "lucide-react";
import { formatDateTime, pluralize } from "../../lib/format";
import { SEVERITY_LIST, countIssues } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Review } from "../../types/review";
import { Card } from "../ui/card";
import { ReviewModeBadge } from "./review-mode-badge";
import { ScoreBadge } from "./score-badge";

type ReviewSummaryProps = {
  review: Review;
  className?: string;
};

/** The top of the review page: big score, how it was made, the summary text and issue counts by severity */
export function ReviewSummary({ review, className }: ReviewSummaryProps) {
  const total = countIssues(review.issueCounts);

  return (
    <Card className={cn("space-y-5 p-4 sm:p-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Quality score
          </p>
          <ScoreBadge score={review.qualityScore} size="lg" />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <ReviewModeBadge mode={review.reviewMode} size="md" />
        </div>
      </div>

      {review.summary ? (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <p className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base">
            {review.summary}
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Issues by severity
          <span className="ml-2 font-normal text-muted-foreground">
            {total === 0 ? "None found" : `${total} in total`}
          </span>
        </h3>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {SEVERITY_LIST.map((info) => {
            const Icon = info.icon;
            return (
              <li
                key={info.severity}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
                  info.softBgClass,
                  info.borderClass,
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium",
                    info.textClass,
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {info.label}
                </span>
                <span className="text-2xl font-semibold tabular-nums text-foreground">
                  {review.issueCounts[info.severity]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <dl className="grid gap-x-6 gap-y-3 border-t border-border pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileCode2 className="size-3.5" aria-hidden="true" />
            Files reviewed
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            {pluralize(review.filesReviewed, "file")}
          </dd>
        </div>

        <div className="min-w-0">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" aria-hidden="true" />
            Reviewed on
          </dt>
          <dd className="mt-0.5 font-medium text-foreground">
            <time dateTime={review.createdAt}>
              {formatDateTime(review.createdAt)}
            </time>
          </dd>
        </div>

        {review.provider ? (
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Bot className="size-3.5" aria-hidden="true" />
              AI provider
            </dt>
            <dd className="mt-0.5 wrap-break-word font-medium capitalize text-foreground">
              {review.provider}
            </dd>
          </div>
        ) : null}

        {review.model ? (
          <div className="min-w-0">
            <dt className="text-xs text-muted-foreground">Model</dt>
            <dd className="mt-0.5 break-all font-mono text-xs font-medium text-foreground sm:text-sm">
              {review.model}
            </dd>
          </div>
        ) : null}
      </dl>
    </Card>
  );
}
