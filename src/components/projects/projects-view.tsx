import { Link } from "react-router-dom";
import { FolderGit2, Plus, SearchX } from "lucide-react";
import { useProjectStats } from "../../hooks/queries/use-project-stats";
import { useProjectListControls } from "../../hooks/use-project-list-controls";
import { pluralize } from "../../lib/format";
import { getProjectPage } from "../../lib/project-list";
import { ROUTES } from "../../lib/routes";
import { EmptyState } from "../common/empty-state";
import { ErrorState } from "../common/error-state";
import { Pagination } from "../common/pagination";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ProjectCard } from "./project-card";
import { ProjectListToolbar } from "./project-list-toolbar";

const LOADING_CARD_COUNT = 6;

/**
 * The My projects body: search, sort, a grid of project cards and pagination.
 * Everything is done on the client from GET /projects/stats, which already
 * holds all of the user's projects with their latest score.
 */
export function ProjectsView() {
  const { data, isPending, error, refetch, isFetching } = useProjectStats();
  const { search, sort, page, setSearch, setSort, setPage, reset, hasFilters } =
    useProjectListControls();

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
      <div className="space-y-4" role="status" aria-label="Loading projects">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: LOADING_CARD_COUNT }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Brand-new account: no projects at all, so no toolbar either
  if (data.projects.length === 0) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No projects yet"
        description="Paste some code or import a public GitHub repository to get your first review."
        action={
          <Button asChild>
            <Link to={ROUTES.newProject}>
              <Plus />
              New project
            </Link>
          </Button>
        }
      />
    );
  }

  const result = getProjectPage(data.projects, { search, sort, page });

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="space-y-6">
      <ProjectListToolbar
        search={search}
        sort={sort}
        hasFilters={hasFilters}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onReset={reset}
      />

      {hasFilters ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {pluralize(result.total, "project")} found
        </p>
      ) : null}

      {result.total === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No projects match"
          description="Try a different search or clear the filters."
          action={
            <Button type="button" variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {result.items.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        pages={result.pages}
        from={result.from}
        to={result.to}
        total={result.total}
        itemLabel="projects"
        onPageChange={handlePageChange}
      />
    </div>
  );
}
