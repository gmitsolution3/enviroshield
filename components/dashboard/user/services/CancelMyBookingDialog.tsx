"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePatch } from "@/hooks/swr/usePatch";
import { getBookingApiError } from "@/lib/api/bookings";
import type { Booking, BookingResponse } from "@/types/admin/booking.type";

export default function CancelMyBookingDialog({ booking, open, listKey, onClose, onSuccess }: {
  booking: Booking | null;
  open: boolean;
  listKey: string;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}) {
  const { mutate: cancelBooking, isLoading } = usePatch("/booking/mine", { revalidateKey: listKey });

  async function submit() {
    if (!booking || isLoading) return;
    try {
      const response: BookingResponse = await cancelBooking({ id: `${encodeURIComponent(booking._id)}/cancel`, data: undefined });
      if (!response.success || !response.data?._id) {
        toast.error(response.message || "Could not cancel this booking.");
        return;
      }
      toast.success(response.message || "Booking cancelled successfully.");
      onSuccess(response.data);
    } catch (error: unknown) {
      toast.error(getBookingApiError(error, "Could not cancel this booking."));
    }
  }

  return <Dialog open={open && Boolean(booking)} onOpenChange={(value) => !value && !isLoading && onClose()}>
    <DialogContent className="overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-lg">
      <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"><AlertTriangle className="h-5 w-5" aria-hidden="true" /></div>
        <DialogTitle className="text-xl font-bold text-navy">Cancel Booking</DialogTitle>
        <DialogDescription className="text-sm leading-6">Cancel booking <span className="font-semibold text-foreground">{booking?.bookingNumber}</span>? Its status will change to cancelled; the booking record will remain in your history.</DialogDescription>
      </DialogHeader>
      <div className="px-6 py-5 text-sm text-muted-foreground sm:px-8">Only pending bookings can be cancelled through your account.</div>
      <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
        <DashboardButton variant="outline" className="min-h-10 rounded-xl px-5" disabled={isLoading} onClick={onClose}>Keep Booking</DashboardButton>
        <DashboardButton className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700" disabled={isLoading || !booking || booking.status !== "pending"} onClick={() => void submit()}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Cancelling...</> : "Confirm Cancellation"}
        </DashboardButton>
      </div>
    </DialogContent>
  </Dialog>;
}
