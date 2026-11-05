import { useId, useMemo, useState } from "react";
import { CircleCheck, FilterX, SearchX } from "lucide-react";
import {
  DEFAULT_ISSUE_FILTERS,
  filterIssues,
  getIssueFacets,
  getIssueFiles,
  hasActiveFilters,
  sortIssues,
  type IssueFilters,
} from "../../lib/issue-filters";
import { pluralize } from "../../lib/format";
import {
  CATEGORY_LIST,
  CATEGORY_ORDER,
  SEVERITY_LIST,
  SEVERITY_ORDER,
} from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Category, Issue, Severity } from "../../types/review";
import { EmptyState } from "../common/empty-state";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IssueCard } from "./issue-card";

const PAGE_SIZE = 20;

type IssueListProps = {
  issues: readonly Issue[];
  className?: string;
};

function isSeverity(value: string): value is Severity {
  return (SEVERITY_ORDER as readonly string[]).includes(value);
}

function isCategory(value: string): value is Category {
  return (CATEGORY_ORDER as readonly string[]).includes(value);
}

type FilterFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

function FilterField({ label, value, onChange, options }: FilterFieldProps) {
  const id = useId();

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** The issues of one review: filter by severity, category and file, most serious first */
export function IssueList({ issues, className }: IssueListProps) {
  const [filters, setFilters] = useState<IssueFilters>(DEFAULT_ISSUE_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const files = useMemo(() => getIssueFiles(issues), [issues]);
  const facets = useMemo(
    () => getIssueFacets(issues, filters),
    [issues, filters],
  );
  const filtered = useMemo(
    () => sortIssues(filterIssues(issues, filters)),
    [issues, filters],
  );

  // Any filter change starts the list from the top again
  function updateFilters(change: Partial<IssueFilters>) {
    setFilters((current) => ({ ...current, ...change }));
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setFilters(DEFAULT_ISSUE_FILTERS);
    setVisibleCount(PAGE_SIZE);
  }

  if (issues.length === 0) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="No issues found"
        description="This review did not find anything to fix in the reviewed files."
        className={className}
      />
    );
  }

  const severityTotal = SEVERITY_ORDER.reduce(
    (sum, key) => sum + facets.severity[key],
    0,
  );
  const categoryTotal = CATEGORY_ORDER.reduce(
    (sum, key) => sum + facets.category[key],
    0,
  );
  const fileTotal = facets.files.reduce((sum, item) => sum + item.count, 0);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;
  const filtersActive = hasActiveFilters(filters);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <div
          className={cn(
            "grid gap-3 sm:gap-4",
            files.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-2",
          )}
        >
          <FilterField
            label="Severity"
            value={filters.severity}
            onChange={(value) => {
              if (value === "all" || isSeverity(value))
                updateFilters({ severity: value });
            }}
            options={[
              { value: "all", label: `All severities (${severityTotal})` },
              ...SEVERITY_LIST.map((info) => ({
                value: info.severity,
                label: `${info.label} (${facets.severity[info.severity]})`,
              })),
            ]}
          />

          <FilterField
            label="Category"
            value={filters.category}
            onChange={(value) => {
              if (value === "all" || isCategory(value))
                updateFilters({ category: value });
            }}
            options={[
              { value: "all", label: `All categories (${categoryTotal})` },
              ...CATEGORY_LIST.map((info) => ({
                value: info.category,
                label: `${info.label} (${facets.category[info.category]})`,
              })),
            ]}
          />

          {files.length > 1 ? (
            <FilterField
              label="File"
              value={filters.file}
              onChange={(value) => updateFilters({ file: value })}
              options={[
                { value: "all", label: `All files (${fileTotal})` },
                ...facets.files.map((item) => ({
                  value: item.file,
                  label: `${item.file} (${item.count})`,
                })),
              ]}
            />
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {filtersActive
              ? `Showing ${filtered.length} of ${pluralize(issues.length, "issue")}`
              : pluralize(issues.length, "issue")}
          </p>
          {filtersActive ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <FilterX />
              Clear filters
            </Button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No issues match these filters"
          description="Try a different severity, category or file."
          action={
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((issue, index) => (
            <li
              key={`${issue.file}:${issue.line}:${issue.rule ?? ""}:${index}`}
            >
              <IssueCard issue={issue} />
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, remaining)} more ({remaining} left)
          </Button>
        </div>
      ) : null}
    </div>
  );
}
