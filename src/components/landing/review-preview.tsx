import {
  getCategoryInfo,
  getSeverityInfo,
  SEVERITY_LIST,
} from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Category, Severity } from "../../types/review";
import { ReviewModeBadge } from "../reviews/review-mode-badge";
import { ScoreBadge } from "../reviews/score-badge";
import { Card } from "../ui/card";

/** 1 high + 3 medium + 6 low = 100 - (10 + 12 + 6) = 72, the same formula the app uses */
const SAMPLE_COUNTS: Record<Severity, number> = { high: 1, medium: 3, low: 6 };
const SAMPLE_SCORE = 72;

type SampleIssue = {
  severity: Severity;
  category: Category;
  location: string;
  message: string;
  fix?: string;
};

const SAMPLE_ISSUES: readonly SampleIssue[] = [
  {
    severity: "high",
    category: "security",
    location: "src/config.js:12",
    message: "An API key is written directly in the source code.",
    fix: "const apiKey = process.env.API_KEY;",
  },
  {
    severity: "medium",
    category: "bug",
    location: "src/todos.js:48",
    message: "todos can be undefined when the list is empty.",
  },
  {
    severity: "low",
    category: "style",
    location: "src/utils.js:5",
    message: "count is assigned but never used.",
  },
];

function SeverityChip({ severity }: { severity: Severity }) {
  const info = getSeverityInfo(severity);
  const Icon = info.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        info.textClass,
        info.softBgClass,
        info.borderClass,
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {info.label}
    </span>
  );
}

/** A sample review drawn with the app's own pieces. Static example data, not a real project */
export function ReviewPreview() {
  return (
    <figure className="mx-auto w-full max-w-md lg:max-w-none">
      <Card className="overflow-hidden shadow-lg">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <p className="truncate font-semibold text-card-foreground">
              todo-api
            </p>
            <p className="text-xs text-muted-foreground">3 files reviewed</p>
          </div>
          <ReviewModeBadge mode="ai+lint" size="sm" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <ScoreBadge score={SAMPLE_SCORE} size="lg" />
          <ul className="flex flex-wrap gap-2">
            {SEVERITY_LIST.map((info) => {
              const Icon = info.icon;

              return (
                <li
                  key={info.severity}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                    info.textClass,
                    info.softBgClass,
                    info.borderClass,
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span className="tabular-nums">
                    {SAMPLE_COUNTS[info.severity]}
                  </span>
                  {info.label}
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="divide-y divide-border border-t border-border">
          {SAMPLE_ISSUES.map((issue) => {
            const category = getCategoryInfo(issue.category);
            const CategoryIcon = category.icon;

            return (
              <li key={issue.location} className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityChip severity={issue.severity} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CategoryIcon className="size-3" aria-hidden="true" />
                    {category.label}
                  </span>
                  <span className="min-w-0 break-all font-mono text-xs text-muted-foreground">
                    {issue.location}
                  </span>
                </div>
                <p className="text-sm text-card-foreground">{issue.message}</p>
                {issue.fix ? (
                  <pre className="overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground">
                    <code>{issue.fix}</code>
                  </pre>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Card>

      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Example review with sample data
      </figcaption>
    </figure>
  );
}
