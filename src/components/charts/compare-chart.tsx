import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useChartColors } from "../../hooks/use-chart-colors";
import { formatDateTime, formatShortDate } from "../../lib/format";
import { SCORE_MAX, SCORE_MIN } from "../../lib/score";
import { cn } from "../../lib/utils";
import type { CompareStudent } from "../../types/teacher";
import { EmptyState } from "../common/empty-state";

type CompareChartProps = {
  students: readonly CompareStudent[];
  className?: string;
};

const Y_TICKS = [0, 20, 40, 60, 80, 100];

function toIso(time: number): string {
  return new Date(time).toISOString();
}

/** One line per student on a shared time axis. Students 6 to 10 get dashed lines, so lines differ by more than color */
export function CompareChart({ students, className }: CompareChartProps) {
  const colors = useChartColors();

  // One row per review: { time, s0: score } for the first student, { time, s1: score } for the second...
  const rows = useMemo(() => {
    const items: Record<string, number>[] = [];
    students.forEach((entry, index) => {
      entry.history.forEach((point) => {
        items.push({
          time: new Date(point.createdAt).getTime(),
          [`s${index}`]: point.qualityScore,
        });
      });
    });
    return items.sort((a, b) => a.time - b.time);
  }, [students]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No score history yet"
        description="None of these students has run a review."
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <ul
        className="flex flex-wrap gap-x-4 gap-y-2 text-sm"
        aria-label="Chart legend"
      >
        {students.map((entry, index) => (
          <li
            key={entry.student._id}
            className="flex min-w-0 items-center gap-2"
          >
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: `var(--chart-${index + 1})` }}
            />
            <span className="min-w-0 truncate text-foreground">
              {entry.student.fullName}
            </span>
          </li>
        ))}
      </ul>

      <div
        role="img"
        aria-label={`Score history of ${students.length} students over time`}
        className="h-64 w-full min-w-0 sm:h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
          >
            <CartesianGrid
              stroke={colors.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="time"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickCount={5}
              padding={{ left: 16, right: 16 }}
              tickFormatter={(value: number) => formatShortDate(toIso(value))}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: colors.grid }}
            />
            <YAxis
              domain={[SCORE_MIN, SCORE_MAX]}
              ticks={Y_TICKS}
              tick={{ fill: colors.axis, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              labelFormatter={(value) => formatDateTime(toIso(Number(value)))}
              contentStyle={{
                backgroundColor: colors.tooltipBackground,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: 8,
                color: colors.tooltipText,
              }}
              labelStyle={{ color: colors.tooltipText }}
              itemStyle={{ color: colors.tooltipText }}
              cursor={{ stroke: colors.grid }}
            />
            {students.map((entry, index) =>
              entry.history.length > 0 ? (
                <Line
                  key={entry.student._id}
                  type="monotone"
                  dataKey={`s${index}`}
                  name={entry.student.fullName}
                  stroke={colors.series[index % colors.series.length]}
                  strokeWidth={2}
                  strokeDasharray={index >= 5 ? "6 4" : undefined}
                  connectNulls
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
