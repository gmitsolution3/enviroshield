"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBookingApiError, updateBookingStatus } from "@/lib/api/bookings";
import type { Booking, BookingStatus } from "@/types/admin/booking.type";
import { formatBookingStatus } from "./bookingUtils";

type UpdateBookingStatusModalProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
  onRequestCancel: () => void;
};

const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

const canCancelBooking = (status: BookingStatus) =>
  status === "pending" || status === "confirmed" || status === "in-progress";

export default function UpdateBookingStatusModal({
  booking,
  open,
  onClose,
  onSuccess,
  onRequestCancel,
}: UpdateBookingStatusModalProps) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    if (isLoading || status === booking.status) return;
    if (status === "cancelled") {
      if (canCancelBooking(booking.status)) onRequestCancel();
      else toast.error("This booking is not eligible for cancellation.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateBookingStatus(booking._id, status);
      onSuccess(response.data, response.message || "Booking status updated successfully.");
    } catch (error: unknown) {
      toast.error(getBookingApiError(error, "Failed to update booking status."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Booking Status
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Choose a status for booking{" "}
              <span className="font-semibold text-foreground">{booking.bookingNumber}</span>.
              Cancellation requires the separate confirmation flow.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="rounded-xl border bg-muted/20 p-4 text-sm">
              <span className="text-muted-foreground">Current status: </span>
              <span className="font-semibold">{formatBookingStatus(booking.status)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-booking-status" className="font-semibold text-navy">
                New status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  const nextStatus = BOOKING_STATUSES.find((item) => item === value);
                  if (nextStatus) setStatus(nextStatus);
                }}
                disabled={isLoading}
              >
                <SelectTrigger id="new-booking-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_STATUSES.map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                      disabled={value === "cancelled" && !canCancelBooking(booking.status)}
                    >
                      {formatBookingStatus(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              disabled={isLoading || status === booking.status}
              onClick={() => void submit()}
              icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isLoading ? "Updating..." : "Update Status"}
            </DashboardButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
