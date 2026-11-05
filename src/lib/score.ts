export type ScoreBandKey = "poor" | "fair" | "good" | "excellent";

export type ScoreBandInfo = {
  key: ScoreBandKey;
  /** Text shown next to the number, so color is never the only signal */
  label: string;
  /** Same text the API uses in teacher scoreBands, e.g. "0-39" */
  range: string;
  min: number;
  max: number;
  textClass: string;
  softBgClass: string;
  borderClass: string;
  /** CSS variable name, for chart code that reads variables at runtime */
  cssVar: string;
};

export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

/** Poor 0-39, Fair 40-59, Good 60-79, Excellent 80-100 (used everywhere) */
export const SCORE_BANDS: readonly ScoreBandInfo[] = [
  {
    key: "poor",
    label: "Poor",
    range: "0-39",
    min: 0,
    max: 39,
    textClass: "text-score-poor",
    softBgClass: "bg-score-poor/10",
    borderClass: "border-score-poor/40",
    cssVar: "--score-poor",
  },
  {
    key: "fair",
    label: "Fair",
    range: "40-59",
    min: 40,
    max: 59,
    textClass: "text-score-fair",
    softBgClass: "bg-score-fair/10",
    borderClass: "border-score-fair/40",
    cssVar: "--score-fair",
  },
  {
    key: "good",
    label: "Good",
    range: "60-79",
    min: 60,
    max: 79,
    textClass: "text-score-good",
    softBgClass: "bg-score-good/10",
    borderClass: "border-score-good/40",
    cssVar: "--score-good",
  },
  {
    key: "excellent",
    label: "Excellent",
    range: "80-100",
    min: 80,
    max: 100,
    textClass: "text-score-excellent",
    softBgClass: "bg-score-excellent/10",
    borderClass: "border-score-excellent/40",
    cssVar: "--score-excellent",
  },
];

function isMissing(
  score: number | null | undefined,
): score is null | undefined {
  return score === null || score === undefined || Number.isNaN(score);
}

/**
 * The band of a score, or null when there is no score yet.
 * The score is rounded first, so the band always matches the number shown
 * (an average of 39.6 is shown as 40 and is "Fair").
 */
export function getScoreBand(
  score: number | null | undefined,
): ScoreBandInfo | null {
  if (isMissing(score)) return null;

  const rounded = Math.min(Math.max(Math.round(score), SCORE_MIN), SCORE_MAX);
  return SCORE_BANDS.find((band) => rounded <= band.max) ?? null;
}

/** Find a band by the label the API sends in scoreBands, e.g. "40-59" */
export function getScoreBandByRange(range: string): ScoreBandInfo | null {
  return SCORE_BANDS.find((band) => band.range === range) ?? null;
}

/** "64" for 63.9, "–" when there is no score */
export function formatScore(score: number | null | undefined): string {
  if (isMissing(score)) return "–";
  return String(Math.round(score));
}
