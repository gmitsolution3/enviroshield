import { formatDateTime, formatNumber, formatStatus } from "@/lib/utils";
import type { BookingStatus } from "@/types/booking.type";

const bookingStatusStyles: Record<BookingStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  confirmed:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  "in-progress":
    "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300",
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  cancelled:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  rejected:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
};

export function formatBookingStatus(status: BookingStatus) {
  return formatStatus(status);
}

export function getBookingStatusClass(status: BookingStatus) {
  return bookingStatusStyles[status];
}

export function formatBookingDate(value?: string) {
  return formatDateTime(value);
}

export function formatBookingAmount(value: number) {
  return formatNumber(value, { maximumFractionDigits: 2 });
}
