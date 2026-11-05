import { ClipboardPaste, GitBranch, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ProjectSourceType } from "../../types/project";

type SourceTypeBadgeSize = "sm" | "md";

type SourceTypeBadgeProps = {
  sourceType: ProjectSourceType;
  size?: SourceTypeBadgeSize;
  className?: string;
};

type SourceTypeInfo = {
  label: string;
  description: string;
  icon: LucideIcon;
};

const SOURCE_TYPES: Record<ProjectSourceType, SourceTypeInfo> = {
  paste: {
    label: "Paste",
    description: "Code pasted into the app",
    icon: ClipboardPaste,
  },
  github: {
    label: "GitHub",
    description: "Imported from a public GitHub repository",
    icon: GitBranch,
  },
};

const SIZE_CLASSES: Record<
  SourceTypeBadgeSize,
  { root: string; icon: string }
> = {
  sm: { root: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
  md: { root: "gap-1.5 px-2.5 py-1 text-sm", icon: "size-4" },
};

/** How a project was created: Paste or GitHub. Neutral colors, told apart by icon and label */
export function SourceTypeBadge({
  sourceType,
  size = "sm",
  className,
}: SourceTypeBadgeProps) {
  const info = SOURCE_TYPES[sourceType];
  const Icon = info.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      title={info.description}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-md border border-border bg-muted font-medium text-muted-foreground",
        sizeClasses.root,
        className,
      )}
    >
      <Icon className={sizeClasses.icon} aria-hidden="true" />
      <span>{info.label}</span>
    </span>
  );
}
