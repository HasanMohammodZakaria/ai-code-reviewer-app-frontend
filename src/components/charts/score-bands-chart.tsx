import {
  Cell,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gauge } from "lucide-react";
import { useChartColors } from "../../hooks/use-chart-colors";
import { getScoreBandByRange } from "../../lib/score";
import { cn } from "../../lib/utils";
import type { ScoreBand } from "../../types/teacher";
import { EmptyState } from "../common/empty-state";

type ScoreBandsChartProps = {
  bands: readonly ScoreBand[];
  className?: string;
};

/** Number of projects in each score band (by the score of each project's latest review) */
export function ScoreBandsChart({ bands, className }: ScoreBandsChartProps) {
  const colors = useChartColors();
  const total = bands.reduce((sum, band) => sum + band.projects, 0);

  if (total === 0) {
    return (
      <EmptyState
        icon={Gauge}
        title="No scored projects yet"
        description="Bars appear here once students run their first reviews."
        className={className}
      />
    );
  }

  // The label carries the band name and range, so color is never the only signal
  const rows = bands.map((band) => {
    const info = getScoreBandByRange(band.label);
    return {
      name: info ? `${info.label} ${band.label}` : band.label,
      projects: band.projects,
      fill: info ? colors.score[info.key] : colors.axis,
    };
  });

  const summary = `Projects by score band: ${rows.map((row) => `${row.name}, ${row.projects}`).join("; ")}`;

  return (
    <div
      role="img"
      aria-label={summary}
      className={cn("h-60 w-full min-w-0 sm:h-72", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 16, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid
            stroke={colors.grid}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            interval={0}
            tick={{ fill: colors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: colors.axis, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            formatter={(value) => [value, "Projects"]}
            cursor={{ fill: colors.grid, opacity: 0.3 }}
            contentStyle={{
              backgroundColor: colors.tooltipBackground,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 8,
              color: colors.tooltipText,
            }}
            labelStyle={{ color: colors.tooltipText }}
            itemStyle={{ color: colors.tooltipText }}
          />
          <Bar
            dataKey="projects"
            radius={[4, 4, 0, 0]}
            maxBarSize={72}
            label={{ position: "top", fill: colors.text, fontSize: 12 }}
          >
            {rows.map((row) => (
              <Cell key={row.name} fill={row.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
