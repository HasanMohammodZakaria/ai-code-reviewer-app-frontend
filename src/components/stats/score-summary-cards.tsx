import {
  ClipboardCheck,
  FolderGit2,
  Gauge,
  Target,
  TriangleAlert,
} from "lucide-react";
import { formatNumber, formatRelativeTime, pluralize } from "../../lib/format";
import { SEVERITY_LIST, countIssues } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { ScoreSummary } from "../../types/review";
import { StatCard } from "../common/stat-card";
import { ScoreBadge } from "../reviews/score-badge";
import { SeverityBadge } from "../reviews/severity-badge";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

type ScoreSummaryCardsProps = {
  /** Undefined while loading. A brand-new account has zero counts and null scores */
  summary?: ScoreSummary;
  isLoading?: boolean;
  className?: string;
};

const EMPTY_SUMMARY: ScoreSummary = {
  projectCount: 0,
  reviewCount: 0,
  latestScore: null,
  avgScore: null,
  lastReviewAt: null,
  issueTotals: { high: 0, medium: 0, low: 0 },
};

/**
 * Projects, reviews, latest score, average score and issue totals.
 * Takes a ScoreSummary, so the student dashboard and the teacher's
 * student detail page use the same component.
 */
export function ScoreSummaryCards({
  summary,
  isLoading = false,
  className,
}: ScoreSummaryCardsProps) {
  const data = summary ?? EMPTY_SUMMARY;
  const loading = isLoading || summary === undefined;
  const totalIssues = countIssues(data.issueTotals);

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
        className,
      )}
    >
      <StatCard
        label="Projects"
        value={formatNumber(data.projectCount)}
        icon={FolderGit2}
        isLoading={loading}
      />
      <StatCard
        label="Reviews"
        value={formatNumber(data.reviewCount)}
        icon={ClipboardCheck}
        isLoading={loading}
      />
      <StatCard
        label="Latest score"
        value={<ScoreBadge score={data.latestScore} />}
        icon={Target}
        hint={
          data.lastReviewAt !== null
            ? `Reviewed ${formatRelativeTime(data.lastReviewAt)}`
            : "No reviews yet"
        }
        isLoading={loading}
      />
      <StatCard
        label="Average score"
        value={<ScoreBadge score={data.avgScore} />}
        icon={Gauge}
        hint={
          data.reviewCount > 0
            ? `Across ${pluralize(data.reviewCount, "review")}`
            : undefined
        }
        isLoading={loading}
      />

      <Card className="col-span-2 p-4 sm:p-5 lg:col-span-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              Issue totals
            </p>
            {loading ? (
              <Skeleton className="mt-2 h-4 w-32" />
            ) : (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {totalIssues === 0
                  ? "No issues found"
                  : `${pluralize(totalIssues, "issue")} across all reviews`}
              </p>
            )}
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <TriangleAlert className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {SEVERITY_LIST.map((info) => (
            <div
              key={info.severity}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 sm:flex-col sm:items-start sm:justify-start"
            >
              <SeverityBadge severity={info.severity} size="sm" />
              {loading ? (
                <Skeleton className="h-8 w-12 sm:mt-1" />
              ) : (
                <p className="text-2xl font-semibold tabular-nums tracking-tight text-card-foreground sm:mt-1">
                  {formatNumber(data.issueTotals[info.severity])}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
