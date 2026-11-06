import { Link } from "react-router-dom";
import { formatNumber, formatRelativeTime } from "../../lib/format";
import { studentPath } from "../../lib/routes";
import { SEVERITY_LIST } from "../../lib/severity";
import type { CompareStudent } from "../../types/teacher";
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

type CompareTableProps = {
  students: readonly CompareStudent[];
  className?: string;
};

/** The numbers of each student, in the same order and colors as the chart lines */
export function CompareTable({ students, className }: CompareTableProps) {
  return (
    <Table className={className ?? "min-w-4xl"}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Student</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead>Latest score</TableHead>
          <TableHead>Average score</TableHead>
          <TableHead>Last review</TableHead>
          {SEVERITY_LIST.map((info) => {
            const Icon = info.icon;
            return (
              <TableHead key={info.severity}>
                <span className="inline-flex items-center gap-1">
                  <Icon className="size-3.5" aria-hidden="true" />
                  {info.label}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.map((entry, index) => (
          <TableRow key={entry.student._id}>
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: `var(--chart-${index + 1})` }}
                />
                <StudentAvatar student={entry.student} size="sm" />
                <div className="min-w-0">
                  <Link
                    to={studentPath(entry.student._id)}
                    className="block truncate rounded-sm font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {entry.student.fullName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.student.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="tabular-nums">
              {formatNumber(entry.projectCount)}
            </TableCell>
            <TableCell className="tabular-nums">
              {formatNumber(entry.reviewCount)}
            </TableCell>
            <TableCell>
              <ScoreBadge score={entry.latestScore} size="sm" />
            </TableCell>
            <TableCell>
              <ScoreBadge score={entry.avgScore} size="sm" />
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {entry.lastReviewAt
                ? formatRelativeTime(entry.lastReviewAt)
                : "No reviews yet"}
            </TableCell>
            {SEVERITY_LIST.map((info) => (
              <TableCell key={info.severity} className="tabular-nums">
                {formatNumber(entry.issueTotals[info.severity])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
