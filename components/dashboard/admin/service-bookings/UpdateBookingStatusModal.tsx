"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
import { axiosInstance } from "@/lib/axios";
import type { Booking, BookingStatus } from "@/types/admin/booking.type";
import { formatBookingStatus } from "./bookingUtils";

type UpdateBookingStatusModalProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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
  status: z.enum(BOOKING_STATUSES, { message: "Select a valid booking status." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateBookingStatusModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
    },
  });

  useEffect(() => {
    if (open && booking) {
      reset({
        status: booking.status,
      });
    }
  }, [open, booking, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!booking) return;

    if (values.status === booking.status) {
      toast.info("Status is already set to " + formatBookingStatus(values.status));
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.patch(`/booking/${booking._id}/status`, {
        status: values.status,
      });

      toast.success(
        response.data?.message || "Booking status updated successfully.",
      );
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking status.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue mb-2">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-navy">
            Update Booking Status
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Change the current workflow status for booking{" "}
            <span className="font-semibold text-foreground">
              #{booking?.bookingNumber}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 py-6 sm:px-7">
            <div className="space-y-2">
              <Label htmlFor="status-select" className="text-sm font-semibold text-navy">
                New Status
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="status-select" className="h-10 w-full rounded-xl">
                      <SelectValue placeholder="Select booking status" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKING_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatBookingStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-slate-50/70 px-6 py-4 dark:bg-muted/30 sm:px-7">
            <DashboardButton
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleClose}
              className="rounded-full"
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
