/** Date input as the API sends it: an ISO string, or null when there is none */
type DateInput = string | null | undefined;

/** One fixed locale, so dates stay English whatever the browser language is */
const LOCALE = "en-US";

/** Shown when a value is missing or not a valid date */
export const EMPTY_VALUE = "–";

/* No timeZone option: dates render in the user's local time (the API sends UTC) */
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: "auto",
});

const numberFormatter = new Intl.NumberFormat(LOCALE);

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function toDate(value: DateInput): Date | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Nov 5, 2026" */
export function formatDate(value: DateInput): string {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : EMPTY_VALUE;
}

/** "Nov 5, 2026, 3:10 PM" */
export function formatDateTime(value: DateInput): string {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : EMPTY_VALUE;
}

/** "Nov 5", for chart axes and tooltips */
export function formatShortDate(value: DateInput): string {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : EMPTY_VALUE;
}

/**
 * "just now", "5 minutes ago", "3 hours ago", "yesterday", "12 days ago".
 * Older than 30 days it falls back to the plain date.
 */
export function formatRelativeTime(
  value: DateInput,
  now: number = Date.now(),
): string {
  const date = toDate(value);
  if (!date) return EMPTY_VALUE;

  const diff = now - date.getTime();

  // Also covers small clock differences where the date is slightly in the future
  if (diff < MINUTE_MS) return "just now";

  if (diff < HOUR_MS) {
    return relativeFormatter.format(-Math.floor(diff / MINUTE_MS), "minute");
  }
  if (diff < DAY_MS) {
    return relativeFormatter.format(-Math.floor(diff / HOUR_MS), "hour");
  }
  if (diff < 30 * DAY_MS) {
    return relativeFormatter.format(-Math.floor(diff / DAY_MS), "day");
  }

  return dateFormatter.format(date);
}

/** "1,234" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** pluralize(1, "project") gives "1 project"; pluralize(3, "project") gives "3 projects" */
export function pluralize(
  count: number,
  singular: string,
  plural: string = `${singular}s`,
): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}
