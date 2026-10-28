"use client";

import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/swr/useFetch";
import { getBookingApiError } from "@/lib/api/bookings";
import type { BookingResponse, BookingStatus } from "@/types/admin/booking.type";
import { formatBookingAmount, formatBookingDate, formatBookingStatus, getBookingStatusClass } from "@/components/dashboard/admin/service-bookings/bookingUtils";

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="break-words whitespace-pre-wrap font-medium text-foreground">{value || "—"}</p></div>;
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getBookingStatusClass(status)}`}>{formatBookingStatus(status)}</Badge>;
}

export default function MyBookingDetailsDialog({ bookingId, open, onClose }: { bookingId: string | null; open: boolean; onClose: () => void }) {
  const key = bookingId ? `/booking/mine/${encodeURIComponent(bookingId)}` : null;
  const { data, isLoading, isError, refetch } = useFetch<BookingResponse>(key, { shouldRetryOnError: false });
  const booking = data?.data?._id === bookingId ? data.data : null;
  const service = booking && typeof booking.serviceId === "object" ? booking.serviceId : null;

  return <Dialog open={open && Boolean(bookingId)} onOpenChange={(value) => !value && onClose()}>
    <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-3xl">
      <div className="flex max-h-[92vh] flex-col overflow-hidden">
        {booking && <>
          <DialogHeader className="shrink-0 border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">Booking {booking.bookingNumber}</DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-2">
              Submitted {formatBookingDate(booking.createdAt)} <StatusBadge status={booking.status} />
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
            <section className="rounded-2xl border bg-card p-5">
              <h2 className="mb-4 font-semibold text-navy dark:text-foreground">Service</h2>
              <div className="grid gap-4 sm:grid-cols-2"><Detail label="Service" value={service?.name || "Service information unavailable"} /><Detail label="Service details" value={service?.slug || "Not available"} /></div>
            </section>
            <section className="rounded-2xl border bg-card p-5">
              <h2 className="mb-4 font-semibold text-navy dark:text-foreground">Project</h2>
              <div className="grid gap-4 sm:grid-cols-2"><Detail label="Location" value={booking.project?.location || "Not provided"} /><Detail label="Area size" value={booking.project?.areaSize != null ? `${booking.project.areaSize}${booking.project.areaUnit ? ` ${booking.project.areaUnit}` : ""}` : "Not provided"} /></div>
              <div className="mt-4"><Detail label="Your message" value={booking.project?.message || "No message provided."} /></div>
            </section>
            <section className="rounded-2xl border bg-card p-5">
              <h2 className="mb-4 font-semibold text-navy dark:text-foreground">Booking information</h2>
              <div className="grid gap-4 sm:grid-cols-2"><Detail label="Site visit" value={booking.isSiteVisit ? "Requested" : "Not requested"} /><Detail label="Site-visit date" value={booking.siteVisitDate ? formatBookingDate(booking.siteVisitDate) : "Not scheduled"} /><Detail label="Final price" value={booking.finalPrice != null ? formatBookingAmount(booking.finalPrice) : "Not available"} /><Detail label="Last updated" value={formatBookingDate(booking.updatedAt)} /></div>
            </section>
          </div>
        </>}
        {!booking && <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
          {isLoading || (!isError && bookingId) ? <><Loader2 className="h-6 w-6 animate-spin text-blue" aria-hidden="true" /><p className="text-sm text-muted-foreground">Loading booking details...</p></> : <><p role="alert" className="text-sm text-destructive">{getBookingApiError(isError, "Could not load this booking.")}</p><Button type="button" variant="outline" onClick={() => void refetch()}>Retry</Button></>}
        </div>}
      </div>
    </DialogContent>
  </Dialog>;
}
