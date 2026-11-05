import { getSeverityInfo } from "../../lib/severity";
import { cn } from "../../lib/utils";
import type { Severity } from "../../types/review";

type SeverityBadgeSize = "sm" | "md";

type SeverityBadgeProps = {
  severity: Severity;
  size?: SeverityBadgeSize;
  /** Hide the word (e.g. in tight spaces); the icon stays and the word stays for screen readers */
  showLabel?: boolean;
  className?: string;
};

const SIZE_CLASSES: Record<SeverityBadgeSize, { root: string; icon: string }> =
  {
    sm: { root: "gap-1 px-2 py-0.5 text-xs", icon: "size-3" },
    md: { root: "gap-1.5 px-2.5 py-1 text-sm", icon: "size-4" },
  };

/** Severity icon plus label (High, Medium, Low), colored by severity */
export function SeverityBadge({
  severity,
  size = "md",
  showLabel = true,
  className,
}: SeverityBadgeProps) {
  const info = getSeverityInfo(severity);
  const Icon = info.icon;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <span
      title={`${info.label} severity`}
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
      <span className={showLabel ? undefined : "sr-only"}>{info.label}</span>
    </span>
  );
}
