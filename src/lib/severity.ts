import {
  Bug,
  Info,
  Layers,
  Lightbulb,
  ListChecks,
  OctagonAlert,
  Paintbrush,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { IssueCounts } from "../types/api";
import type { Category, IssueSource, Severity } from "../types/review";

/* ---------- Severity ---------- */

export type SeverityInfo = {
  severity: Severity;
  /** Shown next to the icon, so color is never the only signal */
  label: string;
  icon: LucideIcon;
  textClass: string;
  softBgClass: string;
  borderClass: string;
  /** CSS variable name, for chart code that reads variables at runtime */
  cssVar: string;
};

/** Always show severities in this order: high, medium, low */
export const SEVERITY_ORDER: readonly Severity[] = ["high", "medium", "low"];

export const SEVERITIES: Record<Severity, SeverityInfo> = {
  high: {
    severity: "high",
    label: "High",
    icon: OctagonAlert,
    textClass: "text-severity-high",
    softBgClass: "bg-severity-high/10",
    borderClass: "border-severity-high/40",
    cssVar: "--severity-high",
  },
  medium: {
    severity: "medium",
    label: "Medium",
    icon: TriangleAlert,
    textClass: "text-severity-medium",
    softBgClass: "bg-severity-medium/10",
    borderClass: "border-severity-medium/40",
    cssVar: "--severity-medium",
  },
  low: {
    severity: "low",
    label: "Low",
    icon: Info,
    textClass: "text-severity-low",
    softBgClass: "bg-severity-low/10",
    borderClass: "border-severity-low/40",
    cssVar: "--severity-low",
  },
};

/** The three severities in display order, ready to map over */
export const SEVERITY_LIST: readonly SeverityInfo[] = SEVERITY_ORDER.map(
  (severity) => SEVERITIES[severity],
);

export function getSeverityInfo(severity: Severity): SeverityInfo {
  return SEVERITIES[severity];
}

/** Sort comparator: high first, then medium, then low */
export function compareSeverity(a: Severity, b: Severity): number {
  return SEVERITY_ORDER.indexOf(a) - SEVERITY_ORDER.indexOf(b);
}

export function countIssues(counts: IssueCounts): number {
  return counts.high + counts.medium + counts.low;
}

/* ---------- Category ---------- */

export type CategoryInfo = {
  category: Category;
  label: string;
  icon: LucideIcon;
};

export const CATEGORY_ORDER: readonly Category[] = [
  "bug",
  "security",
  "improvement",
  "style",
];

export const CATEGORIES: Record<Category, CategoryInfo> = {
  bug: { category: "bug", label: "Bug", icon: Bug },
  security: { category: "security", label: "Security", icon: ShieldAlert },
  improvement: {
    category: "improvement",
    label: "Improvement",
    icon: Lightbulb,
  },
  style: { category: "style", label: "Style", icon: Paintbrush },
};

export const CATEGORY_LIST: readonly CategoryInfo[] = CATEGORY_ORDER.map(
  (category) => CATEGORIES[category],
);

export function getCategoryInfo(category: Category): CategoryInfo {
  return CATEGORIES[category];
}

/* ---------- Issue source ---------- */

export type SourceInfo = {
  source: IssueSource;
  label: string;
  /** Longer text for a tooltip or title attribute */
  description: string;
  icon: LucideIcon;
};

export const SOURCES: Record<IssueSource, SourceInfo> = {
  lint: {
    source: "lint",
    label: "Linter",
    description: "Found by the linter",
    icon: ListChecks,
  },
  llm: {
    source: "llm",
    label: "AI",
    description: "Found by the AI reviewer",
    icon: Sparkles,
  },
  "lint+llm": {
    source: "lint+llm",
    label: "Linter + AI",
    description: "Found by the linter and confirmed by the AI reviewer",
    icon: Layers,
  },
};

export function getSourceInfo(source: IssueSource): SourceInfo {
  return SOURCES[source];
}
