import { getReviewModeInfo } from "../../lib/review-mode";
import { cn } from "../../lib/utils";
import type { ReviewMode } from "../../types/review";

type ReviewModeBadgeSize = "sm" | "md";

type ReviewModeBadgeProps = {
  mode: ReviewMode;
  size?: ReviewModeBadgeSize;
  className?: string;
};

const SIZE_CLASSES: Record<
  ReviewModeBadgeSize,
  { root: string; icon: string }
> = {
  sm: { root: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
  md: { root: "gap-1.5 px-2.5 py-1 text-sm", icon: "size-4" },
};

/** How a review was made: AI + Linter, AI only, or Linter only */
export function ReviewModeBadge({
  mode,
  size = "md",
  className,
}: ReviewModeBadgeProps) {
  const info = getReviewModeInfo(mode);
  const Icon = info.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      title={info.description}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-medium",
        info.textClass,
        info.softBgClass,
        info.borderClass,
        sizeClasses.root,
        className,
      )}
    >
      <Icon className={sizeClasses.icon} aria-hidden="true" />
      <span>{info.label}</span>
    </span>
  );
}
