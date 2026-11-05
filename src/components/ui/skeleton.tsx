import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/** A grey placeholder block shown while data loads. Size it with className: <Skeleton className="h-8 w-20" /> */
function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-muted motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
