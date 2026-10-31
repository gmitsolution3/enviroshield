import {
  formatCurrency,
  formatDateTime,
  formatStatus,
} from "@/lib/utils";
import type { AdminOrder } from "@/types";

export interface OrderMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminOrder;
}

export function getOrderActionError(
  error: unknown,
  fallback: string,
) {
  if (typeof error === "object" && error !== null) {
    const response = error as {
      message?: unknown;
      error?: unknown;
      errors?: unknown;
    };
    if (typeof response.message === "string") return response.message;
    if (typeof response.error === "string") return response.error;
    if (Array.isArray(response.errors)) {
      const messages = response.errors
        .map((item) => {
          if (typeof item === "string") return item;
          if (
            typeof item === "object" &&
            item !== null &&
            "message" in item
          ) {
            return String(item.message);
          }
          return "";
        })
        .filter(Boolean);
      if (messages.length) return messages.join(" ");
    }
  }
  return fallback;
}

export function prettyOrderStatus(status: string) {
  return formatStatus(status);
}

export function formatOrderAmount(amount: number, currency: string) {
  return formatCurrency(amount, currency);
}

export function formatOrderDate(date?: string) {
  return formatDateTime(date);
}
