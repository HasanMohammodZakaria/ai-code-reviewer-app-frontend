import type { ProjectWithScore } from "../types/project";

export type ProjectSort =
  | "recent"
  | "newest"
  | "score-desc"
  | "score-asc"
  | "title-asc"
  | "files-desc";

export const DEFAULT_PROJECT_SORT: ProjectSort = "recent";

/** Nine fits the three-column grid exactly (3 rows) */
export const PROJECTS_PER_PAGE = 9;

export const PROJECT_SORT_OPTIONS: readonly {
  value: ProjectSort;
  label: string;
}[] = [
  { value: "recent", label: "Recently active" },
  { value: "newest", label: "Newest first" },
  { value: "score-desc", label: "Highest score" },
  { value: "score-asc", label: "Lowest score" },
  { value: "title-asc", label: "Title A to Z" },
  { value: "files-desc", label: "Most files" },
];

export function isProjectSort(value: string): value is ProjectSort {
  return PROJECT_SORT_OPTIONS.some((option) => option.value === value);
}

/** Most recent activity of a project: its last review, or its last edit */
export function lastActivity(project: ProjectWithScore): number {
  return Math.max(
    project.lastReviewAt ? new Date(project.lastReviewAt).getTime() : 0,
    new Date(project.updatedAt).getTime(),
  );
}

/** Case-insensitive match on title and description. An empty search keeps everything */
export function filterProjects(
  projects: readonly ProjectWithScore[],
  search: string,
): ProjectWithScore[] {
  const term = search.trim().toLowerCase();
  if (!term) return [...projects];

  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(term) ||
      (project.description ?? "").toLowerCase().includes(term),
  );
}

/** Score sorts put projects without a score last, whatever the direction */
function compareScore(
  a: ProjectWithScore,
  b: ProjectWithScore,
  direction: 1 | -1,
): number {
  if (a.latestScore === null && b.latestScore === null) return 0;
  if (a.latestScore === null) return 1;
  if (b.latestScore === null) return -1;
  return (a.latestScore - b.latestScore) * direction;
}

/** Returns a sorted copy. The input (the query cache) is never changed */
export function sortProjects(
  projects: readonly ProjectWithScore[],
  sort: ProjectSort,
): ProjectWithScore[] {
  const byRecent = (a: ProjectWithScore, b: ProjectWithScore) =>
    lastActivity(b) - lastActivity(a);

  return [...projects].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "score-desc":
        return compareScore(a, b, -1) || byRecent(a, b);
      case "score-asc":
        return compareScore(a, b, 1) || byRecent(a, b);
      case "title-asc":
        return a.title.localeCompare(b.title, "en", {
          sensitivity: "base",
          numeric: true,
        });
      case "files-desc":
        return b.fileCount - a.fileCount || byRecent(a, b);
      case "recent":
      default:
        return byRecent(a, b);
    }
  });
}

export type ProjectPage = {
  items: ProjectWithScore[];
  /** The page actually shown (the requested one, kept inside 1..pages) */
  page: number;
  pages: number;
  /** Projects after the search, before paging */
  total: number;
  /** 1-based position of the first and last item on this page, 0 when empty */
  from: number;
  to: number;
};

export function paginateProjects(
  projects: readonly ProjectWithScore[],
  page: number,
  perPage: number = PROJECTS_PER_PAGE,
): ProjectPage {
  const total = projects.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const start = (current - 1) * perPage;
  const items = projects.slice(start, start + perPage);

  return {
    items,
    page: current,
    pages,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + items.length,
  };
}

type ProjectListOptions = {
  search: string;
  sort: ProjectSort;
  page: number;
};

/** Search, then sort, then cut one page */
export function getProjectPage(
  projects: readonly ProjectWithScore[],
  { search, sort, page }: ProjectListOptions,
): ProjectPage {
  return paginateProjects(
    sortProjects(filterProjects(projects, search), sort),
    page,
  );
}
