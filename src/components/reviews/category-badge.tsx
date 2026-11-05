import { getCategoryInfo } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Category } from "../../types/review";

type CategoryBadgeSize = "sm" | "md";

type CategoryBadgeProps = {
  category: Category;
  size?: CategoryBadgeSize;
  className?: string;
};

const SIZE_CLASSES: Record<CategoryBadgeSize, { root: string; icon: string }> =
  {
    sm: { root: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
    md: { root: "gap-1.5 px-2.5 py-1 text-sm", icon: "size-4" },
  };

/** Issue category: Bug, Security, Improvement or Style. Neutral colors, told apart by icon and label */
export function CategoryBadge({
  category,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  const info = getCategoryInfo(category);
  const Icon = info.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      title={`${info.label} issue`}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-border bg-secondary font-medium text-secondary-foreground",
        sizeClasses.root,
        className,
      )}
    >
      <Icon className={sizeClasses.icon} aria-hidden="true" />
      <span>{info.label}</span>
    </span>
  );
}
