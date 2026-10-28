"use client";

import { AlertTriangle, Ban, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { axiosInstance } from "@/lib/axios";
import type { Booking } from "@/types/admin/booking.type";

type CancelBookingDialogProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CancelBookingDialog({
  booking,
  open,
  onClose,
  onSuccess,
}: CancelBookingDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!booking) return;

    setIsCancelling(true);
    try {
      await axiosInstance.patch(`/booking/${booking._id}/cancel`);
      toast.success("Booking cancelled successfully.");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel booking.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog
      open={open && Boolean(booking)}
      onOpenChange={(value) => {
        if (!value && !isCancelling) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-navy">
                Cancel booking?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                Are you sure you want to cancel booking{" "}
                <span className="font-semibold text-foreground">
                  #{booking?.bookingNumber}
                </span>
                ? Its workflow status will be marked as cancelled.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isCancelling}
              onClick={onClose}
              className="min-h-10 rounded-xl px-5"
            >
              Keep Booking
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isCancelling || !booking}
              onClick={(event) => {
                event.preventDefault();
                void handleCancel();
              }}
              className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel Booking
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
