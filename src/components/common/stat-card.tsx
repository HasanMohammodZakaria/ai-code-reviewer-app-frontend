import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "../ui/card";

type StatCardProps = {
  label: string;
  /** A number, a text, or an element such as a ScoreBadge */
  value: ReactNode;
  icon?: LucideIcon;
  /** Small line under the value, e.g. "across 4 projects" */
  hint?: string;
  /** Show a placeholder instead of the value while data loads */
  isLoading?: boolean;
  className?: string;
};

/** One summary number: label, big value, optional icon and hint */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 min-w-0">
        {isLoading ? (
          <div role="status" aria-label={`Loading ${label}`}>
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted sm:h-9" />
            {hint ? (
              <div className="mt-2 h-4 w-28 animate-pulse rounded-md bg-muted" />
            ) : null}
          </div>
        ) : (
          <>
            <div className="truncate text-2xl font-semibold tabular-nums tracking-tight text-card-foreground sm:text-3xl">
              {value}
            </div>
            {hint ? (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {hint}
              </p>
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
}
