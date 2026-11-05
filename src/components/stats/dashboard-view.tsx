import { Link } from "react-router-dom";
import { FolderGit2, Plus } from "lucide-react";
import { useProjectStats } from "../../hooks/queries/use-project-stats";
import { lastActivity } from "../../lib/project-list";
import { ROUTES } from "../../lib/routes";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { ScoreHistoryChart } from "../charts/score-history-chart";
import { ProjectCard } from "../projects/project-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ScoreSummaryCards } from "./score-summary-cards";

const RECENT_PROJECT_COUNT = 6;

function NewProjectButton() {
  return (
    <Button asChild>
      <Link to={ROUTES.newProject}>
        <Plus />
        New project
      </Link>
    </Button>
  );
}

/**
 * The student dashboard body: summary cards, score history and recent projects,
 * with its own loading, error and empty states.
 */
export function DashboardView() {
  const { data, isPending, error, refetch, isFetching } = useProjectStats();

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
      <div className="space-y-6" role="status" aria-label="Loading dashboard">
        <ScoreSummaryCards isLoading />
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-56 w-full sm:h-72" />
          </CardContent>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32 sm:hidden xl:block" />
        </div>
      </div>
    );
  }

  // Brand-new account: zero counts and null scores, so show a friendly start instead of empty cards
  if (data.projects.length === 0) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No projects yet"
        description="Paste some code or import a public GitHub repository to get your first review."
        action={<NewProjectButton />}
      />
    );
  }

  const recentProjects = [...data.projects]
    .sort((a, b) => lastActivity(b) - lastActivity(a))
    .slice(0, RECENT_PROJECT_COUNT);

  return (
    <div className="space-y-6 sm:space-y-8">
      <ScoreSummaryCards summary={data.summary} />

      <Card>
        <CardHeader>
          <CardTitle>Score history</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreHistoryChart
            data={data.history}
            emptyDescription="Run a review on one of your projects to see your score over time."
          />
        </CardContent>
      </Card>

      <section aria-labelledby="recent-projects-title" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="recent-projects-title"
            className="text-lg font-semibold text-foreground"
          >
            Recent projects
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to={ROUTES.projects}>View all projects</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
