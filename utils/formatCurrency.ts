/**
 * Utility functions for currency and amount formatting.
 */

const DEFAULT_CURRENCY = "BDT";
const DEFAULT_LOCALE = "en-BD";

/**
 * Formats an amount in BDT with the Taka currency symbol (৳).
 * e.g. 1500 -> "৳1,500"
 */
export function formatTaka(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `৳${safeAmount.toLocaleString(DEFAULT_LOCALE)}`;
}

/**
 * Formats a currency amount using Intl.NumberFormat.
 * Supports arbitrary currency codes (defaults to BDT).
 * e.g. (1500, "BDT") -> "BDT 1,500.00" or localized equivalent.
 */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  options?: Intl.NumberFormatOptions,
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      ...options,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toLocaleString(DEFAULT_LOCALE)}`;
  }
}

/**
 * Formats a number with standard Bangladeshi grouping (e.g. 1,00,000).
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString(DEFAULT_LOCALE, options);
}

