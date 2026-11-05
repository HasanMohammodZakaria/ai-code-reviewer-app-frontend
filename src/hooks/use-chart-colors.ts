import { useEffect, useState } from "react";

const SERIES_COUNT = 10;
const FALLBACK = "currentColor";

export type ChartColors = {
  /** --chart-1 to --chart-10, one per line or bar series */
  series: string[];
  grid: string;
  axis: string;
  text: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tooltipText: string;
  primary: string;
  score: { poor: string; fair: string; good: string; excellent: string };
  severity: { high: string; medium: string; low: string };
};

function readVar(style: CSSStyleDeclaration, name: string): string {
  const value = style.getPropertyValue(name).trim();
  return value || FALLBACK;
}

function readColors(): ChartColors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => readVar(style, name);

  return {
    series: Array.from({ length: SERIES_COUNT }, (_, index) =>
      get(`--chart-${index + 1}`),
    ),
    grid: get("--border"),
    axis: get("--muted-foreground"),
    text: get("--foreground"),
    tooltipBackground: get("--popover"),
    tooltipBorder: get("--border"),
    tooltipText: get("--popover-foreground"),
    primary: get("--primary"),
    score: {
      poor: get("--score-poor"),
      fair: get("--score-fair"),
      good: get("--score-good"),
      excellent: get("--score-excellent"),
    },
    severity: {
      high: get("--severity-high"),
      medium: get("--severity-medium"),
      low: get("--severity-low"),
    },
  };
}

/**
 * Resolved CSS variable values for Recharts, which cannot read var(--x).
 * Updates when the theme changes, so charts follow dark and light mode.
 */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(readColors);

  useEffect(() => {
    // Watching the <html> class works whatever order the theme provider's own effect runs in
    const observer = new MutationObserver(() => setColors(readColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
