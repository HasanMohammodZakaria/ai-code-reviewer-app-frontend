import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useProject } from "../../hooks/queries/use-project";
import { useRunReviewFlow } from "../../hooks/use-run-review-flow";
import { isProjectOwner } from "../../lib/project-owner";
import { ROUTES } from "../../lib/routes";
import type { Project } from "../../types/project";
import { ErrorState } from "../common/error-state";
import { ReviewHistory } from "../reviews/review-history";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { EditProjectDialog } from "./edit-project-dialog";
import { FileViewer } from "./file-viewer";
import { ProjectDetailHeader } from "./project-detail-header";
import { RunReviewButton } from "./run-review-button";
import { RunReviewStatus } from "./run-review-status";

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
    <div className="space-y-6" role="status" aria-label="Loading project">
      <div className="space-y-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-full max-w-lg" />
      </div>
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

/** Split from the view so the run-review hook always has a real project id */
function ProjectDetailContent({ project }: { project: Project }) {
  const { user } = useAuth();
  const flow = useRunReviewFlow(project._id);
  const canManage = isProjectOwner(project, user);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      <ProjectDetailHeader
        project={project}
        actions={<RunReviewButton flow={flow} />}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleteOpen(true)}
      />

      {canManage ? <RunReviewStatus flow={flow} /> : null}

      <section aria-labelledby="project-files-title" className="space-y-4">
        <h2
          id="project-files-title"
          className="text-lg font-semibold text-foreground"
        >
          Files
        </h2>
        <FileViewer files={project.files ?? []} />
      </section>

      <section aria-labelledby="project-reviews-title" className="space-y-4">
        <h2
          id="project-reviews-title"
          className="text-lg font-semibold text-foreground"
        >
          Review history
        </h2>
        <ReviewHistory
          projectId={project._id}
          emptyDescription={
            canManage
              ? "Run a review to see the score history of this project."
              : "This project has not been reviewed yet."
          }
        />
      </section>

      {canManage ? (
        <>
          <EditProjectDialog
            project={project}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteProjectDialog
            project={project}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      ) : null}
    </div>
  );
}

/** The project detail page body: loading, error and not-found states, then everything about one project */
export function ProjectDetailView() {
  const { id } = useParams();
  const {
    data: project,
    isPending,
    error,
    refetch,
    isFetching,
  } = useProject(id);

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

  // key: moving from one project to another starts every part fresh
  return <ProjectDetailContent key={project._id} project={project} />;
}
