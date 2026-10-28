import type { Metadata } from "next";

import ServiceBookingSuccessContent from "@/components/services/ServiceBookingSuccessContent";
import { requireAuth } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Service Booking Confirmation | Enviroshield",
  description: "Your Enviroshield service booking confirmation details.",
  robots: { index: false, follow: false },
};

type ServiceBookingSuccessPageProps = {
  searchParams: Promise<{ bookingId?: string | string[] }>;
};

export default async function ServiceBookingSuccessPage({
  searchParams,
}: ServiceBookingSuccessPageProps) {
  const params = await searchParams;

  const bookingId = Array.isArray(params.bookingId)
    ? (params.bookingId[0] ?? "")
    : (params.bookingId ?? "");

  await requireAuth(
    `/services/booking-success?bookingId=${encodeURIComponent(bookingId)}`,
  );

  return <ServiceBookingSuccessContent bookingId={bookingId} />;
}

