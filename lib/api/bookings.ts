import { axiosInstance } from "@/lib/axios";
import type {
  Booking,
  BookingListQuery,
  BookingListResponse,
  BookingResponse,
} from "@/types/admin/booking.type";

const MAX_PAGE_SIZE = 100;

function normalizePage(value: number | undefined, fallback: number) {
  return Number.isInteger(value) && value !== undefined && value > 0
    ? value
    : fallback;
}

function buildBookingListUrlAt(
  endpoint: "/booking" | "/booking/mine",
  query: BookingListQuery = {},
) {
  const page = normalizePage(query.page, 1);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    normalizePage(query.limit, 10),
  );
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.status) params.set("status", query.status);
  if (query.bookingNumber?.trim()) {
    params.set("bookingNumber", query.bookingNumber.trim());
  }

  return `${endpoint}?${params.toString()}`;
}

export function buildBookingListUrl(query: BookingListQuery = {}) {
  return buildBookingListUrlAt("/booking", query);
}

export function buildMyBookingListUrl(query: BookingListQuery = {}) {
  return buildBookingListUrlAt("/booking/mine", query);
}

export async function listBookings(
  query: BookingListQuery = {},
): Promise<BookingListResponse> {
  const response = await axiosInstance.get<BookingListResponse>(
    buildBookingListUrl(query),
  );
  const result = response.data;
  if (
    !result.success ||
    !Array.isArray(result.data) ||
    !result.meta ||
    !Number.isInteger(result.meta.page) ||
    !Number.isInteger(result.meta.limit) ||
    !Number.isInteger(result.meta.total) ||
    !Number.isInteger(result.meta.totalPages)
  ) {
    throw new Error(result.message || "The booking list response was invalid.");
  }
  return result;
}

export async function getBooking(id: string): Promise<Booking> {
  if (!id) throw new Error("A booking ID is required.");
  const response = await axiosInstance.get<BookingResponse>(
    `/booking/${encodeURIComponent(id)}`,
  );
  const result = response.data;
  if (!result.success || !result.data?._id) {
    throw new Error(result.message || "The booking could not be retrieved.");
  }
  return result.data;
}

export function getBookingApiError(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
