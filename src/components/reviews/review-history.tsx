import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ClipboardList } from "lucide-react";
import { useProjectReviews } from "../../hooks/queries/use-project-reviews";
import { formatDateTime, pluralize } from "../../lib/format";
import { reviewPath } from "../../lib/routes";
import { SEVERITY_LIST, countIssues } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { ReviewListItem } from "../../types/review";
import { ScoreHistoryChart } from "../charts/score-history-chart";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ReviewModeBadge } from "./review-mode-badge";
import { ScoreBadge } from "./score-badge";

const INITIAL_VISIBLE = 10;

type ReviewHistoryProps = {
  projectId: string;
  /** Shown when the project has no reviews yet. A read-only viewer gets a different text */
  emptyDescription?: string;
  className?: string;
};

function ReviewRow({ review }: { review: ReviewListItem }) {
  const total = countIssues(review.issueCounts);

  return (
    <li>
      <Link
        to={reviewPath(review._id)}
        className={cn(
          "block rounded-lg border border-border p-3 transition-colors sm:p-4",
          "hover:border-primary/50 hover:bg-accent/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ScoreBadge score={review.qualityScore} size="sm" />
            <ReviewModeBadge mode={review.reviewMode} size="sm" />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <time dateTime={review.createdAt}>
              {formatDateTime(review.createdAt)}
            </time>
            <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {review.summary ? (
          <p className="mt-2 line-clamp-2 wrap-break-word text-sm text-muted-foreground">
            {review.summary}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {total === 0 ? (
            <span className="text-muted-foreground">No issues found</span>
          ) : (
            SEVERITY_LIST.map((info) => {
              const Icon = info.icon;
              return (
                <span
                  key={info.severity}
                  className={cn(
                    "inline-flex items-center gap-1 font-medium",
                    info.textClass,
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    {review.issueCounts[info.severity]}
                  </span>
                  <span className="font-normal">
                    {info.label.toLowerCase()}
                  </span>
                </span>
              );
            })
          )}
          <span className="text-muted-foreground">
            {pluralize(review.filesReviewed, "file")} reviewed
          </span>
        </div>
      </Link>
    </li>
  );
}

/** Score chart and the list of past reviews of one project (newest first) */
export function ReviewHistory({
  projectId,
  emptyDescription = "Run a review to see the score history of this project.",
  className,
}: ReviewHistoryProps) {
  const {
    data: reviews,
    isPending,
    error,
    refetch,
    isFetching,
  } = useProjectReviews(projectId);
  const [showAll, setShowAll] = useState(false);

  // The API sends newest first; the chart needs oldest first. Reverse a copy, never the cache
  const chartData = useMemo(
    () => (reviews ? [...reviews].reverse() : []),
    [reviews],
  );

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        className={className}
      />
    );
  }

  if (isPending) {
    return (
      <div
        className={cn("space-y-4", className)}
        role="status"
        aria-label="Loading review history"
      >
        <Skeleton className="h-56 w-full sm:h-72" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No reviews yet"
        description={emptyDescription}
        className={className}
      />
    );
  }

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);
  const hiddenCount = reviews.length - visible.length;

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Score history</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreHistoryChart data={chartData} />
        </CardContent>
      </Card>

      <section aria-labelledby="review-list-title" className="space-y-3">
        <h3
          id="review-list-title"
          className="text-base font-semibold text-foreground"
        >
          All reviews ({reviews.length})
        </h3>

        <ul className="space-y-2">
          {visible.map((review) => (
            <ReviewRow key={review._id} review={review} />
          ))}
        </ul>

        {reviews.length > INITIAL_VISIBLE ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAll((value) => !value)}
          >
            {showAll ? "Show fewer" : `Show ${hiddenCount} more`}
          </Button>
        ) : null}
      </section>
    </div>
  );
}
