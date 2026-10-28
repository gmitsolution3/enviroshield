"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { usePatch } from "@/hooks/swr/usePatch";
import type { Booking, BookingResponse, BookingStatus } from "@/types/admin/booking.type";
import { formatBookingStatus } from "./bookingUtils";

type UpdateBookingStatusModalProps = {
  booking: Booking;
  open: boolean;
  revalidateKey: string | string[];
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
  onRequestCancel: () => void;
};

const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
] as const satisfies readonly BookingStatus[];

const formSchema = z.object({
  status: z.enum(BOOKING_STATUSES, { message: "Select a booking status." }),
});
type FormValues = z.infer<typeof formSchema>;

const canCancelBooking = (status: BookingStatus) =>
  status === "pending" || status === "confirmed" || status === "in-progress";

export default function UpdateBookingStatusModal({
  booking,
  open,
  revalidateKey,
  onClose,
  onSuccess,
  onRequestCancel,
}: UpdateBookingStatusModalProps) {
  const { mutate: patchBookingStatus, isLoading } = usePatch("/booking", {
    revalidateKey,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: booking.status },
  });

  useEffect(() => {
    if (open) reset({ status: booking.status });
  }, [booking._id, booking.status, open, reset]);

  async function onSubmit(values: FormValues) {
    if (isLoading || values.status === booking.status) return;
    if (values.status === "cancelled") {
      if (canCancelBooking(booking.status)) onRequestCancel();
      else toast.error("This booking is not eligible for cancellation.");
      return;
    }

    try {
      const response: BookingResponse = await patchBookingStatus({
        id: `${encodeURIComponent(booking._id)}/status`,
        data: { status: values.status },
      });
      if (!response.success || !response.data?._id) {
        throw new Error(response.message || "Failed to update booking status.");
      }
      onSuccess(
        response.data,
        response.message || "Booking status updated successfully.",
      );
    } catch (error: unknown) {
      const responseError = error as { message?: string; error?: string };
      toast.error(
        responseError.message ||
          responseError.error ||
          "Failed to update booking status.",
      );
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
              <span className="font-semibold text-foreground">
                {booking.bookingNumber}
              </span>
              . Cancellation requires the separate confirmation flow.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="rounded-xl border bg-muted/20 p-4 text-sm">
                <span className="text-muted-foreground">Current status: </span>
                <span className="font-semibold">
                  {formatBookingStatus(booking.status)}
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-booking-status" className="font-semibold text-navy">
                  New status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        const nextStatus = BOOKING_STATUSES.find(
                          (item) => item === value,
                        );
                        if (nextStatus) field.onChange(nextStatus);
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="new-booking-status" className="h-11 w-full rounded-xl">
                        <SelectValue placeholder="Select a status" />
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
                  )}
                />
                {errors.status && <p className="text-sm text-destructive" role="alert">{errors.status.message}</p>}
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
                type="submit"
                disabled={isLoading}
                icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isLoading ? "Updating..." : "Update Status"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
