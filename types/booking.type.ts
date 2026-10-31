import type { IServiceImage } from "./service.type";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "rejected";

export type BookingProject = {
  location: string;
  areaSize?: number;
  areaUnit?: string;
  message?: string;
};

export type BookingUserSummary = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
};

export type BookingServiceSummary = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  primaryImage?: IServiceImage;
  status: string;
};

export type Booking = {
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
};

export type BookingPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BookingListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  meta: BookingPagination;
  data: Booking[];
};

export type BookingSingleResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Booking;
};

export type BookingResponse = BookingListResponse;

