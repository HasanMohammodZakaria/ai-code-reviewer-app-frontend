import { formatScore, getScoreBand, SCORE_MAX } from "../../lib/score";
import { cn } from "../../lib/utils";

type ScoreBadgeSize = "sm" | "md" | "lg";

type ScoreBadgeProps = {
  score: number | null | undefined;
  size?: ScoreBadgeSize;
  /** Hide the band word (e.g. in tight table cells); the number stays */
  showLabel?: boolean;
  className?: string;
};

const SIZE_CLASSES: Record<ScoreBadgeSize, { root: string; number: string }> = {
  sm: {
    root: "gap-1.5 rounded-full px-2 py-0.5 text-xs",
    number: "font-semibold",
  },
  md: {
    root: "gap-2 rounded-full px-3 py-1 text-sm",
    number: "font-semibold",
  },
  lg: {
    root: "gap-3 rounded-xl px-5 py-3 text-base",
    number: "text-4xl font-bold leading-none",
  },
};

/** Score number plus its band (Poor, Fair, Good, Excellent), colored by band */
export function ScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: ScoreBadgeProps) {
  const band = getScoreBand(score);
  const sizeClasses = SIZE_CLASSES[size];

  if (!band) {
    return (
      <span
        className={cn(
          "inline-flex items-center border border-border bg-muted font-medium text-muted-foreground",
          sizeClasses.root,
          className,
        )}
      >
        No score
      </span>
    );
  }

  const text = formatScore(score);

  return (
    <span
      title={`Quality score ${text} out of ${SCORE_MAX}: ${band.label}`}
      className={cn(
        "inline-flex items-center border font-medium",
        band.textClass,
        band.softBgClass,
        band.borderClass,
        sizeClasses.root,
        className,
      )}
    >
      <span className={cn("tabular-nums", sizeClasses.number)}>{text}</span>
      {size === "lg" ? (
        <span className="text-sm font-normal text-muted-foreground">
          / {SCORE_MAX}
        </span>
      ) : null}
      <span className={showLabel ? undefined : "sr-only"}>{band.label}</span>
    </span>
  );
}
