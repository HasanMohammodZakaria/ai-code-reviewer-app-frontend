import type { ReactNode } from "react";
import { FileX, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { pluralize } from "../../lib/format";
import { LANGUAGE_OPTIONS } from "../../lib/languages";
import { getReviewModeInfo } from "../../lib/review-mode";
import { cn } from "../../lib/utils";
import type { Review } from "../../types/review";

type ReviewWarningsProps = {
  review: Pick<Review, "reviewMode" | "filesSkipped" | "unlintedLanguages">;
  className?: string;
};

type WarningBlockProps = {
  tone: "warning" | "neutral";
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

/** "python" becomes "Python", "cpp" becomes "C++". A language the form does not offer stays as sent */
function getLanguageName(language: string): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ??
    language
  );
}

function WarningBlock({
  tone,
  icon: Icon,
  title,
  children,
}: WarningBlockProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        tone === "warning"
          ? "border-warning/40 bg-warning/10"
          : "border-border bg-muted/40",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "warning" ? "text-warning" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="space-y-2 wrap-break-word text-sm text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Things the reader should know about how complete the review is:
 * lint-only mode, languages without a linter, and files left out because
 * of the size budget. Renders nothing when there is nothing to warn about.
 */
export function ReviewWarnings({ review, className }: ReviewWarningsProps) {
  const { reviewMode, filesSkipped, unlintedLanguages } = review;
  const hasUnlinted = unlintedLanguages.length > 0;
  const hasSkipped = filesSkipped.length > 0;

  if (reviewMode !== "lint-only" && !hasUnlinted && !hasSkipped) return null;

  const languageNames = unlintedLanguages.map(getLanguageName).join(", ");

  return (
    <div className={cn("space-y-3", className)}>
      {reviewMode === "lint-only" ? (
        <WarningBlock
          tone="warning"
          icon={TriangleAlert}
          title="The AI reviewer was unavailable"
        >
          <p>
            {getReviewModeInfo("lint-only").description}. Run the review again
            later for a full result.
          </p>
        </WarningBlock>
      ) : null}

      {hasUnlinted ? (
        <WarningBlock
          tone="neutral"
          icon={Info}
          title={`No linter for ${languageNames}`}
        >
          <p>
            {reviewMode === "lint-only"
              ? "Files in these languages have no linter, and the AI reviewer was unavailable, so they were not checked in this review."
              : "Only the AI reviewer looked at files in these languages. Only JavaScript and TypeScript have a linter."}
          </p>
        </WarningBlock>
      ) : null}

      {hasSkipped ? (
        <WarningBlock
          tone="warning"
          icon={FileX}
          title={`${pluralize(filesSkipped.length, "file")} not reviewed`}
        >
          <p>
            Only about the first 40,000 characters of code are reviewed. These
            files did not fit, so nothing was checked in them:
          </p>
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2">
            {filesSkipped.map((path) => (
              <li
                key={path}
                className="break-all font-mono text-xs text-foreground"
              >
                {path}
              </li>
            ))}
          </ul>
        </WarningBlock>
      ) : null}
    </div>
  );
}
