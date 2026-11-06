import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "../../lib/format";
import { Button } from "../ui/button";

type StudentsPaginationProps = {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

/** "Showing 11-20 of 34" with Previous and Next */
export function StudentsPagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
}: StudentsPaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Students pages"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-muted-foreground">
        Showing {formatNumber(from)}-{formatNumber(to)} of {formatNumber(total)}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft />
          Previous
        </Button>
        <span className="text-sm tabular-nums text-muted-foreground">
          Page {page} of {pages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
