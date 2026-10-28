import { axiosInstance } from "@/lib/axios";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rejected";

export interface BookingProject {
  location: string;
  areaSize?: number;
  areaUnit?: string;
  message?: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  project: BookingProject;
  isSiteVisit?: boolean;
}

export interface BookingUserSummary {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
}

export interface BookingServiceSummary {
  _id: string;
  name: string;
  slug: string;
  price: number;
  primaryImage?: {
    url?: string;
    publicId?: string;
    alt?: string;
    caption?: string;
  };
  status: string;
}

export interface BookingConfirmation {
  _id: string;
  bookingNumber: string;
  userId: string | BookingUserSummary;
  serviceId: string | BookingServiceSummary | null;
  project: BookingProject;
  isSiteVisit: boolean;
  siteVisitDate?: string;
  finalPrice: number;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

type BookingApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
};

export async function createBooking(payload: CreateBookingRequest) {
  const response = await axiosInstance.post<BookingApiResponse<BookingConfirmation>>(
    "/booking",
    payload,
  );

  const result = response.data;

  if (!result.success || !result.data?._id || !result.data.bookingNumber) {
    throw new Error(result.message || "The booking response was incomplete.");
  }

  return result.data;
}

export async function getMyBookingById(bookingId: string) {
  const response = await axiosInstance.get<BookingApiResponse<BookingConfirmation>>(
    `/booking/mine/${encodeURIComponent(bookingId)}`,
  );

  const result = response.data;

  if (!result.success || !result.data?._id || !result.data.bookingNumber) {
    throw new Error(result.message || "The booking could not be retrieved.");
  }

  return result.data;
}

