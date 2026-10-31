/**
 * String formatting helpers (capitalization, slug formatting, status prettifying).
 */

/**
 * Capitalizes the first letter of each word in a string, replacing underscores and dashes with spaces.
 * e.g. "pending_payment" -> "Pending Payment"
 * e.g. "in-progress" -> "In Progress"
 */
export function formatStatus(status: string, fallback = "—"): string {
  if (!status) return fallback;
  return status
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Capitalizes only the very first letter of a sentence or string.
 * e.g. "hello world" -> "Hello world"
 */
export function capitalize(value: string, fallback = ""): string {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

