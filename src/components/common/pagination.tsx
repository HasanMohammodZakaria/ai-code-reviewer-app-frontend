import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

type PaginationProps = {
  /** Current page, starting at 1 */
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
  /** With all three of from, to and total, a line like "Showing 10–18 of 23 projects" is shown */
  from?: number;
  to?: number;
  total?: number;
  /** Plural noun for the summary line, e.g. "projects" */
  itemLabel?: string;
  className?: string;
};

/** Page numbers to show: first, last and the neighbours of the current page */
function getPageItems(page: number, pages: number): PageItem[] {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);

  if (start > 2) items.push("ellipsis-start");
  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }
  if (end < pages - 1) items.push("ellipsis-end");

  items.push(pages);
  return items;
}

/** Previous and Next buttons with page numbers. Renders nothing for a single page */
export function Pagination({
  page,
  pages,
  onPageChange,
  from,
  to,
  total,
  itemLabel = "items",
  className,
}: PaginationProps) {
  if (pages <= 1) return null;

  const items = getPageItems(page, pages);
  const showSummary =
    from !== undefined && to !== undefined && total !== undefined;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between",
        className,
      )}
    >
      {showSummary ? (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium tabular-nums text-foreground">
            {from}–{to}
          </span>{" "}
          of{" "}
          <span className="font-medium tabular-nums text-foreground">
            {total}
          </span>{" "}
          {itemLabel}
        </p>
      ) : null}

      <div className="flex items-center gap-1 sm:ml-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <ul className="hidden items-center gap-1 sm:flex">
          {items.map((item) =>
            typeof item === "number" ? (
              <li key={item}>
                <Button
                  type="button"
                  variant={item === page ? "default" : "ghost"}
                  size="sm"
                  className="min-w-8 px-2 tabular-nums"
                  onClick={() => onPageChange(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                >
                  {item}
                </Button>
              </li>
            ) : (
              <li
                key={item}
                aria-hidden="true"
                className="px-1 text-muted-foreground"
              >
                …
              </li>
            ),
          )}
        </ul>

        <span className="px-2 text-sm tabular-nums text-muted-foreground sm:hidden">
          Page {page} of {pages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
