"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import type { Booking, BookingStatus } from "@/types/admin/booking.type";
import { formatBookingStatus } from "./bookingUtils";

type UpdateBookingModalProps = {
  booking: Booking | null;
  open: boolean;
  revalidateKey: string | string[];
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

const formSchema = z
  .object({
    status: z.enum(BOOKING_STATUSES, { message: "Select a booking status." }),
    finalPrice: z
      .string()
      .trim()
      .refine(
        (val) => val === "" || (!Number.isNaN(Number(val)) && Number(val) >= 0),
        "Price must be a positive number.",
      ),
    isSiteVisit: z.boolean(),
    siteVisitDate: z.string(),
    adminNotes: z.string().max(2000, "Notes must be 2000 characters or fewer."),
  })
  .superRefine((values, context) => {
    if (
      values.isSiteVisit &&
      values.siteVisitDate &&
      Number.isNaN(Date.parse(values.siteVisitDate))
    ) {
      context.addIssue({
        code: "custom",
        path: ["siteVisitDate"],
        message: "Enter a valid site-visit date.",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

function toDateTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function UpdateBookingModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
      finalPrice: "",
      isSiteVisit: false,
      siteVisitDate: "",
      adminNotes: "",
    },
  });

  const isSiteVisit = useWatch({ control, name: "isSiteVisit" });

  useEffect(() => {
    if (open && booking) {
      reset({
        status: booking.status,
        finalPrice:
          booking.finalPrice != null ? String(booking.finalPrice) : "",
        isSiteVisit: Boolean(booking.isSiteVisit),
        siteVisitDate: toDateTimeInput(booking.siteVisitDate),
        adminNotes: booking.adminNotes || "",
      });
    }
  }, [open, booking, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!booking) return;

    setIsSubmitting(true);
    try {
      const promises: Promise<unknown>[] = [];

      // 1. Update Status if changed
      if (values.status !== booking.status) {
        promises.push(
          axiosInstance.patch(`/booking/${booking._id}/status`, {
            status: values.status,
          }),
        );
      }

      // 2. Update Price if changed or provided
      const currentPriceStr =
        booking.finalPrice != null ? String(booking.finalPrice) : "";
      if (values.finalPrice !== currentPriceStr && values.finalPrice !== "") {
        promises.push(
          axiosInstance.patch(`/booking/${booking._id}/price`, {
            finalPrice: Number(values.finalPrice),
          }),
        );
      }

      // 3. Update Management (Site visit & admin notes) if changed
      const originalDate = toDateTimeInput(booking.siteVisitDate);
      const isManagementChanged =
        values.isSiteVisit !== booking.isSiteVisit ||
        (values.isSiteVisit && values.siteVisitDate !== originalDate) ||
        values.adminNotes.trim() !== (booking.adminNotes || "").trim();

      if (isManagementChanged) {
        const payload: {
          isSiteVisit: boolean;
          siteVisitDate?: Date;
          adminNotes?: string;
        } = {
          isSiteVisit: values.isSiteVisit,
          adminNotes: values.adminNotes.trim(),
        };

        if (values.isSiteVisit && values.siteVisitDate) {
          payload.siteVisitDate = new Date(values.siteVisitDate);
        }

        promises.push(
          axiosInstance.patch(`/booking/${booking._id}/management`, payload),
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success("Booking updated successfully.");
      } else {
        toast.info("No changes were made.");
      }

      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <DialogTitle className="text-xl font-bold text-navy">
            Update Booking
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Modify the status, price, inspection schedule, and admin notes for{" "}
            <span className="font-semibold text-foreground">
              #{booking?.bookingNumber}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-6 sm:px-7">
            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="booking-status" className="text-sm font-semibold text-navy">
                Booking Status
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
                    <SelectTrigger id="booking-status" className="h-10 w-full rounded-xl">
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

            {/* Final Price Field */}
            <div className="space-y-2">
              <Label htmlFor="final-price" className="text-sm font-semibold text-navy">
                Final Agreed Price (BDT)
              </Label>
              <Input
                id="final-price"
                type="number"
                step="any"
                min="0"
                placeholder="e.g. 15000"
                disabled={isSubmitting}
                {...register("finalPrice")}
                className="h-10 rounded-xl"
              />
              {errors.finalPrice && (
                <p className="text-xs text-destructive">{errors.finalPrice.message}</p>
              )}
            </div>

            {/* Site Visit Toggle & Date */}
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-border/60 dark:bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="site-visit-toggle" className="text-sm font-semibold text-navy">
                    Site Visit Required
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable if an onsite inspection or technical visit is needed.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isSiteVisit"
                  render={({ field }) => (
                    <Switch
                      id="site-visit-toggle"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>

              {isSiteVisit && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="site-visit-date" className="text-xs font-semibold text-navy">
                    Scheduled Inspection Date & Time
                  </Label>
                  <Input
                    id="site-visit-date"
                    type="datetime-local"
                    disabled={isSubmitting}
                    {...register("siteVisitDate")}
                    className="h-10 rounded-xl bg-white dark:bg-background"
                  />
                  {errors.siteVisitDate && (
                    <p className="text-xs text-destructive">
                      {errors.siteVisitDate.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="admin-notes" className="text-sm font-semibold text-navy">
                Internal Admin Notes
              </Label>
              <Textarea
                id="admin-notes"
                rows={3}
                placeholder="Add internal notes, client requirements, or inspection summaries..."
                disabled={isSubmitting}
                {...register("adminNotes")}
                className="rounded-xl"
              />
              {errors.adminNotes && (
                <p className="text-xs text-destructive">{errors.adminNotes.message}</p>
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
