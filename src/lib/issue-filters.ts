import { CATEGORY_ORDER, SEVERITY_ORDER, compareSeverity } from "./severity";
import type { Category, Issue, Severity } from "../types/review";

/** "all" keeps everything. A severity, category or file path keeps only that one */
export type IssueFilters = {
  severity: Severity | "all";
  category: Category | "all";
  file: string | "all";
};

export const DEFAULT_ISSUE_FILTERS: IssueFilters = {
  severity: "all",
  category: "all",
  file: "all",
};

export function hasActiveFilters(filters: IssueFilters): boolean {
  return (
    filters.severity !== "all" ||
    filters.category !== "all" ||
    filters.file !== "all"
  );
}

/** Keep the issues that match every active filter */
export function filterIssues(
  issues: readonly Issue[],
  filters: IssueFilters,
): Issue[] {
  return issues.filter(
    (issue) =>
      (filters.severity === "all" || issue.severity === filters.severity) &&
      (filters.category === "all" || issue.category === filters.category) &&
      (filters.file === "all" || issue.file === filters.file),
  );
}

/**
 * Most serious first, then by file, then by line, so the list reads the same
 * way every time. Returns a copy: the query cache is never changed.
 */
export function sortIssues(issues: readonly Issue[]): Issue[] {
  return [...issues].sort(
    (a, b) =>
      compareSeverity(a.severity, b.severity) ||
      a.file.localeCompare(b.file, "en", { numeric: true }) ||
      a.line - b.line,
  );
}

export type IssueFacets = {
  severity: Record<Severity, number>;
  category: Record<Category, number>;
  /** Files that have issues, A to Z, each with its issue count */
  files: { file: string; count: number }[];
};

/**
 * Counts for the filter options (e.g. "Security (3)"). Each group is counted
 * with the OTHER filters applied but not its own, so choosing one value never
 * makes the other values of the same group look empty.
 */
export function getIssueFacets(
  issues: readonly Issue[],
  filters: IssueFilters,
): IssueFacets {
  const severity = Object.fromEntries(
    SEVERITY_ORDER.map((key) => [key, 0]),
  ) as Record<Severity, number>;
  const category = Object.fromEntries(
    CATEGORY_ORDER.map((key) => [key, 0]),
  ) as Record<Category, number>;
  const fileCounts = new Map<string, number>();

  for (const issue of issues) {
    const matchesCategory =
      filters.category === "all" || issue.category === filters.category;
    const matchesFile = filters.file === "all" || issue.file === filters.file;
    const matchesSeverity =
      filters.severity === "all" || issue.severity === filters.severity;

    if (matchesCategory && matchesFile) severity[issue.severity] += 1;
    if (matchesSeverity && matchesFile) category[issue.category] += 1;
    if (matchesSeverity && matchesCategory) {
      fileCounts.set(issue.file, (fileCounts.get(issue.file) ?? 0) + 1);
    }
  }

  // A file chosen earlier stays in the list even when its count is now 0
  if (filters.file !== "all" && !fileCounts.has(filters.file)) {
    fileCounts.set(filters.file, 0);
  }

  const files = [...fileCounts.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => a.file.localeCompare(b.file, "en", { numeric: true }));

  return { severity, category, files };
}

/** Every file path that has at least one issue (for deciding whether to show the file filter) */
export function getIssueFiles(issues: readonly Issue[]): string[] {
  return [...new Set(issues.map((issue) => issue.file))].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
}
