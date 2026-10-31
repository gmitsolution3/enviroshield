/**
 * Formats a date string, timestamp, or Date instance into a user-friendly format.
 * Returns a fallback (default "—") when given nullish or invalid values.
 */

type DateInput = string | number | Date | null | undefined;

/**
 * Default standard date: e.g. "Oct 31, 2026"
 */
export function formatDate(
  date: DateInput,
  options?: Intl.DateTimeFormatOptions,
  fallback = "—",
): string {
  if (!date) return fallback;

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

/**
 * Formats date and time: e.g. "Oct 31, 2026, 3:30 PM"
 */
export function formatDateTime(
  date: DateInput,
  options?: Intl.DateTimeFormatOptions,
  fallback = "—",
): string {
  if (!date) return fallback;

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
    ...options,
  }).format(parsed);
}
