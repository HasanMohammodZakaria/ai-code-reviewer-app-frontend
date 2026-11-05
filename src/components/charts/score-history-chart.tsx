import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartColors } from "../../hooks/use-chart-colors";
import { formatDateTime, formatShortDate } from "../../lib/format";
import { SCORE_MAX, SCORE_MIN } from "../../lib/score";
import { cn } from "../../lib/utils";
import { EmptyState } from "../common/empty-state";

/** Review history items and project review list items both fit this shape */
type ScorePoint = {
  _id: string;
  createdAt: string;
  qualityScore: number;
};

type ScoreHistoryChartProps = {
  /** Oldest first. The project review list arrives newest first, so reverse a copy before passing it */
  data: readonly ScorePoint[];
  emptyDescription?: string;
  className?: string;
};

const Y_TICKS = [0, 20, 40, 60, 80, 100];

/** Quality score over time: one point per review */
export function ScoreHistoryChart({
  data,
  emptyDescription = "Run a review to see your score over time.",
  className,
}: ScoreHistoryChartProps) {
  const colors = useChartColors();

  const { rows, shortLabels, fullLabels } = useMemo(() => {
    const short = new Map<string, string>();
    const full = new Map<string, string>();

    const items = data.map((point) => {
      short.set(point._id, formatShortDate(point.createdAt));
      full.set(point._id, formatDateTime(point.createdAt));
      return { id: point._id, score: point.qualityScore };
    });

    return { rows: items, shortLabels: short, fullLabels: full };
  }, [data]);

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No score history yet"
        description={emptyDescription}
        className={className}
      />
    );
  }

  const latest = rows[rows.length - 1].score;
  const summary = `Score history: ${rows.length} ${rows.length === 1 ? "review" : "reviews"}, latest score ${Math.round(latest)} out of ${SCORE_MAX}`;

  return (
    <div
      role="img"
      aria-label={summary}
      className={cn("h-56 w-full min-w-0 sm:h-72", className)}
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
            dataKey="id"
            tickFormatter={(id: string) => shortLabels.get(id) ?? ""}
            tick={{ fill: colors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
            interval="preserveStartEnd"
            minTickGap={24}
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
            labelFormatter={(id) => fullLabels.get(String(id)) ?? ""}
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
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke={colors.primary}
            strokeWidth={2}
            dot={{ r: 3, fill: colors.primary, stroke: colors.primary }}
            activeDot={{
              r: 5,
              fill: colors.primary,
              stroke: colors.tooltipBackground,
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
