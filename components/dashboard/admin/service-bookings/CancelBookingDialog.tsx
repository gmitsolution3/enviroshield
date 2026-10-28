"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePatch } from "@/hooks/swr/usePatch";
import { getBookingApiError } from "@/lib/api/bookings";
import type {
  Booking,
  BookingResponse,
} from "@/types/admin/booking.type";

type CancelBookingDialogProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
  onConflict: () => void;
};

const canCancelBooking = (booking: Booking) =>
  booking.status === "pending" ||
  booking.status === "confirmed" ||
  booking.status === "in-progress";

export default function CancelBookingDialog({
  booking,
  open,
  onClose,
  onSuccess,
  onConflict,
}: CancelBookingDialogProps) {
  const { mutate: patchCancelBooking, isLoading } =
    usePatch("/booking");
  const eligible = canCancelBooking(booking);

  async function submit() {
    if (isLoading || !eligible) return;
    try {
      const response: BookingResponse = await patchCancelBooking({
        id: `${encodeURIComponent(booking._id)}/cancel`,
        data: undefined,
      });
      if (!response.success || !response.data?._id) {
        throw new Error(
          response.message || "Failed to cancel this booking.",
        );
      }
      onSuccess(
        response.data,
        response.message || "Booking cancelled successfully.",
      );
    } catch (error: unknown) {
      toast.error(
        getBookingApiError(error, "Failed to cancel this booking."),
      );
      if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error.statusCode === 404 || error.statusCode === 409)
      ) {
        onConflict();
      }
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-navy">
                Cancel booking?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                Booking{" "}
                <span className="font-semibold text-foreground">
                  {booking.bookingNumber}
                </span>{" "}
                will change to Cancelled. The booking record will
                remain in the system.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isLoading}
              className="min-h-10 rounded-xl px-5"
            >
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading || !eligible}
              onClick={(event) => {
                event.preventDefault();
                void submit();
              }}
              className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm cancellation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
