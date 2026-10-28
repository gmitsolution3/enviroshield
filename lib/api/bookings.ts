import { axiosInstance } from "@/lib/axios";
import type {
  Booking,
  BookingListQuery,
  BookingListResponse,
  BookingManagementUpdate,
  BookingResponse,
  BookingStatus,
} from "@/types/admin/booking.type";

const MAX_PAGE_SIZE = 100;

function normalizePage(value: number | undefined, fallback: number) {
  return Number.isInteger(value) && value !== undefined && value > 0
    ? value
    : fallback;
}

export function buildBookingListUrl(query: BookingListQuery = {}) {
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

  return `/booking?${params.toString()}`;
}

function assertBookingResponse(response: BookingResponse): Booking {
  if (!response.success || !response.data?._id) {
    throw new Error(response.message || "The booking could not be retrieved.");
  }
  return response.data;
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
  return assertBookingResponse(response.data);
}

export async function updateBookingPrice(
  id: string,
  finalPrice: number,
): Promise<BookingResponse> {
  if (!Number.isFinite(finalPrice) || finalPrice < 0) {
    throw new Error("Enter a valid non-negative price.");
  }
  const response = await axiosInstance.patch<BookingResponse>(
    `/booking/${encodeURIComponent(id)}/price`,
    { finalPrice },
  );
  assertBookingResponse(response.data);
  return response.data;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<BookingResponse> {
  const response = await axiosInstance.patch<BookingResponse>(
    `/booking/${encodeURIComponent(id)}/status`,
    { status },
  );
  assertBookingResponse(response.data);
  return response.data;
}

export async function updateBookingManagement(
  id: string,
  changes: BookingManagementUpdate,
): Promise<BookingResponse> {
  const payload: BookingManagementUpdate = {};
  if (changes.isSiteVisit !== undefined) {
    payload.isSiteVisit = changes.isSiteVisit;
  }
  if (changes.siteVisitDate !== undefined) {
    if (Number.isNaN(Date.parse(changes.siteVisitDate))) {
      throw new Error("Enter a valid site-visit date and time.");
    }
    payload.siteVisitDate = changes.siteVisitDate;
  }
  if (changes.adminNotes !== undefined) {
    if (changes.adminNotes.length > 2000) {
      throw new Error("Admin notes must be 2,000 characters or fewer.");
    }
    payload.adminNotes = changes.adminNotes;
  }
  if (Object.keys(payload).length === 0) {
    throw new Error("Change at least one booking management field.");
  }

  const response = await axiosInstance.patch<BookingResponse>(
    `/booking/${encodeURIComponent(id)}/management`,
    payload,
  );
  assertBookingResponse(response.data);
  return response.data;
}

export async function cancelBooking(id: string): Promise<BookingResponse> {
  const response = await axiosInstance.patch<BookingResponse>(
    `/booking/${encodeURIComponent(id)}/cancel`,
  );
  assertBookingResponse(response.data);
  return response.data;
}

export function getBookingApiError(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}
