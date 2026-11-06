import {
  ClipboardCheck,
  FolderGit2,
  Gauge,
  Target,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useTeacherOverview } from "../../hooks/queries/use-teacher-overview";
import { formatNumber, pluralize } from "../../lib/format";
import { SEVERITY_LIST, countIssues } from "../../lib/severity";
import type { IssueCounts } from "../../types/api";
import { ScoreBandsChart } from "../charts/score-bands-chart";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { StatCard } from "../common/stat-card";
import { ScoreBadge } from "../reviews/score-badge";
import { SeverityBadge } from "../reviews/severity-badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function IssueTotalsCard({ totals }: { totals: IssueCounts }) {
  const total = countIssues(totals);

  return (
    <Card className="col-span-2 p-4 sm:p-5 lg:col-span-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            Issue totals
          </p>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {total === 0
              ? "No issues found"
              : `${pluralize(total, "issue")} across all reviews`}
          </p>
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
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-card-foreground sm:mt-1">
              {formatNumber(totals[info.severity])}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** The teacher overview body: totals, averages, issue totals and the score bands chart */
export function TeacherOverviewView() {
  const { data, isPending, error, refetch, isFetching } = useTeacherOverview();

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (isPending) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading overview">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (data.students === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No students yet"
        description="Students appear here as soon as they register."
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Students"
          value={formatNumber(data.students)}
          icon={Users}
        />
        <StatCard
          label="Projects"
          value={formatNumber(data.projects)}
          icon={FolderGit2}
        />
        <StatCard
          label="Reviews"
          value={formatNumber(data.reviews)}
          icon={ClipboardCheck}
        />
        <StatCard
          label="Average score"
          value={<ScoreBadge score={data.avgScore} />}
          icon={Gauge}
          hint={
            data.reviews > 0
              ? `Across ${pluralize(data.reviews, "review")}`
              : "No reviews yet"
          }
        />
        <StatCard
          label="Average of latest scores"
          value={<ScoreBadge score={data.avgLatestProjectScore} />}
          icon={Target}
          hint="Latest review of each project"
          className="col-span-2 lg:col-span-4"
        />
        <IssueTotalsCard totals={data.issueTotals} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects by latest score</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreBandsChart bands={data.scoreBands} />
        </CardContent>
      </Card>
    </div>
  );
}
