import { Wrench } from "lucide-react";
import { LANGUAGE_OPTIONS } from "../../lib/languages";
import { cn } from "../../lib/utils";
import type { Issue } from "../../types/review";
import { CodeViewer } from "../projects/code-viewer";
import { CategoryBadge } from "./category-badge";
import { SeverityBadge } from "./severity-badge";
import { SourceBadge } from "./source-badge";

type IssueCardProps = {
  issue: Issue;
  className?: string;
};

/** Extensions the paste form does not offer but the server still detects */
const EXTRA_EXTENSIONS: Record<string, string> = {
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".tsx": "typescript",
  ".h": "c",
  ".hpp": "cpp",
};

/** The language of a file path, for coloring the suggested fix. Unknown becomes "unknown" (plain text) */
function getLanguageFromPath(path: string): string {
  const dot = path.lastIndexOf(".");
  if (dot === -1) return "unknown";

  const extension = path.slice(dot).toLowerCase();
  const option = LANGUAGE_OPTIONS.find((item) => item.extension === extension);
  return option?.value ?? EXTRA_EXTENSIONS[extension] ?? "unknown";
}

/** One issue: where it is, what is wrong, why, and the suggested fix */
export function IssueCard({ issue, className }: IssueCardProps) {
  return (
    <article
      className={cn(
        "min-w-0 space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={issue.severity} size="sm" />
        <CategoryBadge category={issue.category} />
        <SourceBadge source={issue.source} />
      </div>

      <p className="wrap-break-word text-sm font-medium leading-relaxed sm:text-base">
        {issue.message}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="min-w-0 break-all font-mono">
          {issue.file}
          <span className="text-foreground">:{issue.line}</span>
        </span>
        <span>Line {issue.line}</span>
        {issue.rule ? (
          <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-foreground">
            {issue.rule}
          </code>
        ) : null}
      </div>

      {issue.explanation ? (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Explanation
          </p>
          <p className="wrap-break-word text-sm leading-relaxed text-muted-foreground">
            {issue.explanation}
          </p>
        </div>
      ) : null}

      {issue.suggestedFix ? (
        <details className="group rounded-lg border border-border">
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
              "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <Wrench
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            Suggested fix
            <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">
              Show
            </span>
            <span className="ml-auto hidden text-xs font-normal text-muted-foreground group-open:inline">
              Hide
            </span>
          </summary>
          <div className="border-t border-border p-2 sm:p-3">
            <CodeViewer
              code={issue.suggestedFix}
              language={getLanguageFromPath(issue.file)}
              label={`Suggested fix for ${issue.file}, line ${issue.line}`}
              showLineNumbers={false}
              className="max-h-72"
            />
          </div>
        </details>
      ) : null}
    </article>
  );
}
