import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FileCode2,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { formatDate, pluralize } from "../../lib/format";
import { getOwnerInfo, isProjectOwner } from "../../lib/project-owner";
import { ROUTES } from "../../lib/routes";
import type { Project } from "../../types/project";
import { PageHeader } from "../common/page-header";
import { Button } from "../ui/button";
import { SourceTypeBadge } from "./source-type-badge";

type ProjectDetailHeaderProps = {
  project: Project;
  /** Extra actions before Edit and Delete, e.g. the Run review button (owner only, added by the caller) */
  actions?: ReactNode;
  /** Opens the edit dialog. The Edit button shows for the owner only */
  onEdit?: () => void;
  /** Opens the delete confirmation. The Delete button shows for the owner only */
  onDelete?: () => void;
};

/** Project title and description, where it came from, and the owner's actions */
export function ProjectDetailHeader({
  project,
  actions,
  onEdit,
  onDelete,
}: ProjectDetailHeaderProps) {
  const { user } = useAuth();
  const canManage = isProjectOwner(project, user);
  const owner = getOwnerInfo(project);

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to={ROUTES.projects}>
          <ArrowLeft />
          Projects
        </Link>
      </Button>

      <PageHeader
        title={project.title}
        description={project.description || undefined}
        actions={
          canManage ? (
            <>
              {actions}
              {onEdit ? (
                <Button type="button" variant="outline" onClick={onEdit}>
                  <Pencil />
                  Edit
                </Button>
              ) : null}
              {onDelete ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 />
                  Delete
                </Button>
              ) : null}
            </>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <SourceTypeBadge sourceType={project.sourceType} size="md" />

        {project.sourceType === "github" && project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center gap-1 rounded-sm text-primary hover:underline"
          >
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate font-mono text-xs sm:text-sm">
              {project.repoUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
            </span>
            <span className="sr-only">(opens GitHub in a new tab)</span>
          </a>
        ) : null}

        <span className="inline-flex items-center gap-1">
          <FileCode2 className="size-4" aria-hidden="true" />
          {pluralize(project.fileCount, "file")}
        </span>

        <span className="inline-flex items-center gap-1">
          <Calendar className="size-4" aria-hidden="true" />
          Created{" "}
          <time dateTime={project.createdAt}>
            {formatDate(project.createdAt)}
          </time>
        </span>

        {!canManage && owner ? (
          <span className="inline-flex items-center gap-1">
            <User className="size-4" aria-hidden="true" />
            {owner.fullName}
          </span>
        ) : null}
      </div>
    </div>
  );
}
