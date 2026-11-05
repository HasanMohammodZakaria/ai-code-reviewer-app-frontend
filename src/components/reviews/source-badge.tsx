import { getSourceInfo } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { IssueSource } from "../../types/review";

type SourceBadgeSize = "sm" | "md";

type SourceBadgeProps = {
  source: IssueSource;
  size?: SourceBadgeSize;
  className?: string;
};

const SIZE_CLASSES: Record<SourceBadgeSize, { root: string; icon: string }> = {
  sm: { root: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
  md: { root: "gap-1.5 px-2.5 py-1 text-sm", icon: "size-4" },
};

/** Where an issue came from: Linter, AI, or Linter + AI. Neutral colors, told apart by icon and label */
export function SourceBadge({
  source,
  size = "sm",
  className,
}: SourceBadgeProps) {
  const info = getSourceInfo(source);
  const Icon = info.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      title={info.description}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-muted font-medium text-muted-foreground",
        sizeClasses.root,
        className,
      )}
    >
      <Icon className={sizeClasses.icon} aria-hidden="true" />
      <span>{info.label}</span>
    </span>
  );
}
