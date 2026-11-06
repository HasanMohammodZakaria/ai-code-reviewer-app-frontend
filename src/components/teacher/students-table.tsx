import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { formatNumber, formatRelativeTime } from "../../lib/format";
import { studentPath } from "../../lib/routes";
import { cn } from "../../lib/utils";
import type {
  SortOrder,
  StudentInfo,
  StudentListItem,
  StudentSortField,
} from "../../types/teacher";
import { ScoreBadge } from "../reviews/score-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { StudentAvatar } from "./student-avatar";

type StudentsTableProps = {
  items: readonly StudentListItem[];
  sort: StudentSortField;
  order: SortOrder;
  onSort: (field: StudentSortField) => void;
  /** Selected student id -> name, for the compare button */
  selected: ReadonlyMap<string, string>;
  maxSelected: number;
  onToggle: (student: StudentInfo) => void;
  className?: string;
};

type SortHeadProps = {
  field: StudentSortField;
  label: string;
  sort: StudentSortField;
  order: SortOrder;
  onSort: (field: StudentSortField) => void;
};

function SortHead({ field, label, sort, order, onSort }: SortHeadProps) {
  const active = sort === field;
  const Icon = !active ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead
      aria-sort={
        active ? (order === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm font-medium transition-colors hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
    </TableHead>
  );
}

/** Students with sortable columns and a checkbox per row for comparing */
export function StudentsTable({
  items,
  sort,
  order,
  onSort,
  selected,
  maxSelected,
  onToggle,
  className,
}: StudentsTableProps) {
  const limitReached = selected.size >= maxSelected;

  return (
    <Table className={cn("min-w-208", className)}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-10">
            <span className="sr-only">Select for comparison</span>
          </TableHead>
          <SortHead
            field="name"
            label="Student"
            sort={sort}
            order={order}
            onSort={onSort}
          />
          <SortHead
            field="projectCount"
            label="Projects"
            sort={sort}
            order={order}
            onSort={onSort}
          />
          <SortHead
            field="reviewCount"
            label="Reviews"
            sort={sort}
            order={order}
            onSort={onSort}
          />
          <SortHead
            field="latestScore"
            label="Latest score"
            sort={sort}
            order={order}
            onSort={onSort}
          />
          <SortHead
            field="avgScore"
            label="Average score"
            sort={sort}
            order={order}
            onSort={onSort}
          />
          <TableHead>Last review</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => {
          const { student } = item;
          const isSelected = selected.has(student._id);

          return (
            <TableRow
              key={student._id}
              data-state={isSelected ? "selected" : undefined}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={!isSelected && limitReached}
                  onChange={() => onToggle(student)}
                  aria-label={`Select ${student.fullName} for comparison`}
                  className="size-4 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </TableCell>

              <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                  <StudentAvatar student={student} />
                  <div className="min-w-0">
                    <Link
                      to={studentPath(student._id)}
                      className="block truncate rounded-sm font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {student.fullName}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {student.email}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="tabular-nums">
                {formatNumber(item.projectCount)}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatNumber(item.reviewCount)}
              </TableCell>
              <TableCell>
                <ScoreBadge score={item.latestScore} size="sm" />
              </TableCell>
              <TableCell>
                <ScoreBadge score={item.avgScore} size="sm" />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {item.lastReviewAt
                  ? formatRelativeTime(item.lastReviewAt)
                  : "No reviews yet"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
