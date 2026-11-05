import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useReview } from "../../hooks/queries/use-review";
import { ROUTES, projectPath } from "../../lib/routes";
import { ErrorState } from "../common/error-state";
import { PageHeader } from "../common/page-header";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { IssueList } from "./issue-list";
import { ReviewSummary } from "./review-summary";
import { ReviewWarnings } from "./review-warnings";
import { formatDateTime } from "../../lib/format";

function BackToProjects() {
  return (
    <Button asChild variant="outline">
      <Link to={ROUTES.projects}>
        <ArrowLeft />
        Back to projects
      </Link>
    </Button>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading review">
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

/** The review page body: loading, error and not-found states, then the whole review */
export function ReviewDetailView() {
  const { id } = useParams();
  const { data: review, isPending, error, refetch, isFetching } = useReview(id);

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        action={<BackToProjects />}
      />
    );
  }

  if (isPending) {
    return <DetailSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={projectPath(review.project)}>
            <ArrowLeft />
            Back to project
          </Link>
        </Button>

        <PageHeader
          title="Review"
          description={`Run on ${formatDateTime(review.createdAt)}`}
        />
      </div>

      <ReviewSummary review={review} />

      <ReviewWarnings review={review} />

      <section aria-labelledby="review-issues-title" className="space-y-4">
        <h2
          id="review-issues-title"
          className="text-lg font-semibold text-foreground"
        >
          Issues
        </h2>
        <IssueList issues={review.issues} />
      </section>
    </div>
  );
}
