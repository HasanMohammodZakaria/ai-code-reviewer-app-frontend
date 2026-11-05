import { Link } from "react-router-dom";
import { Clock, FileCode2 } from "lucide-react";
import { formatRelativeTime, pluralize } from "../../lib/format";
import { projectPath } from "../../lib/routes";
import { cn } from "../../lib/utils";
import type { ProjectWithScore } from "../../types/project";
import { ScoreBadge } from "../reviews/score-badge";
import { Card } from "../ui/card";
import { SourceTypeBadge } from "./source-type-badge";

type ProjectCardProps = {
  project: ProjectWithScore;
  className?: string;
};

/** One project: title, description, source, file count, latest score and last review. The whole card is a link */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const lastReview =
    project.lastReviewAt !== null
      ? `Reviewed ${formatRelativeTime(project.lastReviewAt)}`
      : "No reviews yet";

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col gap-3 p-4 transition-colors hover:border-primary/50 hover:bg-accent/40 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 wrap-break-word text-base font-semibold leading-snug text-card-foreground">
          {/* The ::after layer stretches this link over the whole card */}
          <Link
            to={projectPath(project._id)}
            className="rounded-sm after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {project.title}
          </Link>
        </h3>
        <ScoreBadge
          score={project.latestScore}
          size="sm"
          className="shrink-0"
        />
      </div>

      {project.description ? (
        <p className="line-clamp-2 wrap-break-word text-sm text-muted-foreground">
          {project.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-xs text-muted-foreground">
        <SourceTypeBadge sourceType={project.sourceType} />
        <span className="inline-flex items-center gap-1">
          <FileCode2 className="size-3.5" aria-hidden="true" />
          {pluralize(project.fileCount, "file")}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {lastReview}
        </span>
      </div>
    </Card>
  );
}
