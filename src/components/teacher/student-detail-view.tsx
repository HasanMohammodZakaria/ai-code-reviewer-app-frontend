import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FolderGit2 } from "lucide-react";
import { useStudentDetail } from "../../hooks/queries/use-student-detail";
import { formatDate, pluralize } from "../../lib/format";
import { ROUTES } from "../../lib/routes";
import { ScoreHistoryChart } from "../charts/score-history-chart";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { PageHeader } from "../common/page-header";
import { ProjectCard } from "../projects/project-card";
import { ScoreSummaryCards } from "../stats/score-summary-cards";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { StudentAvatar } from "./student-avatar";

function BackToStudents() {
  return (
    <Button asChild variant="outline">
      <Link to={ROUTES.teacherStudents}>
        <ArrowLeft />
        Back to students
      </Link>
    </Button>
  );
}

/** One student: summary cards, score history and their projects (open any project read-only) */
export function StudentDetailView() {
  const { id } = useParams();
  const { data, isPending, error, refetch, isFetching } = useStudentDetail(id);

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        action={<BackToStudents />}
      />
    );
  }

  if (isPending) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading student">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <ScoreSummaryCards isLoading />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const { student, summary, projects, history } = data;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to={ROUTES.teacherStudents}>
            <ArrowLeft />
            Students
          </Link>
        </Button>

        <div className="flex items-start gap-4">
          <StudentAvatar student={student} size="lg" />
          <PageHeader
            className="min-w-0 flex-1"
            title={student.fullName}
            description={`${student.email} · Joined ${formatDate(student.createdAt)}`}
          />
        </div>
      </div>

      <ScoreSummaryCards summary={summary} />

      <Card>
        <CardHeader>
          <CardTitle>Score history</CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreHistoryChart
            data={history}
            emptyDescription="This student has not run a review yet."
          />
        </CardContent>
      </Card>

      <section aria-labelledby="student-projects-title" className="space-y-4">
        <h2
          id="student-projects-title"
          className="text-lg font-semibold text-foreground"
        >
          Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No projects yet"
            description={`${student.fullName} has not submitted any code.`}
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {pluralize(projects.length, "project")}. Open one to read its code
              and reviews.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
