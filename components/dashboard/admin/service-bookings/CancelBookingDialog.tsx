"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
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
  revalidateKey?: string;
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
      open={open}
      onOpenChange={(value) => {
        if (!value && !isCancelling) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="rounded-2xl border-0 p-6 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <AlertDialogTitle className="pt-2 text-xl font-bold text-navy">
            Cancel Booking
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to cancel booking{" "}
            <span className="font-semibold text-foreground">
              #{booking?.bookingNumber}
            </span>
            ? Its status will be changed to cancelled and the customer will be
            notified.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={isCancelling}
            onClick={onClose}
            className="rounded-full"
          >
            Keep Booking
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isCancelling}
            onClick={handleCancel}
            className="rounded-full bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
