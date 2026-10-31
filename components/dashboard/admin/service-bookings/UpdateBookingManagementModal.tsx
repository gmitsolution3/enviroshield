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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import type { Booking } from "@/types/booking.type";
import { formatBookingDate } from "./bookingUtils";

type UpdateBookingManagementModalProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const formSchema = z
  .object({
    isSiteVisit: z.boolean(),
    siteVisitDate: z.string(),
    adminNotes: z.string().max(2000, "Notes must be 2,000 characters or fewer."),
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
        message: "Enter a valid site-visit date and time.",
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

export default function UpdateBookingManagementModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingManagementModalProps) {
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
      isSiteVisit: false,
      siteVisitDate: "",
      adminNotes: "",
    },
  });

  const isSiteVisit = useWatch({ control, name: "isSiteVisit" });

  useEffect(() => {
    if (open && booking) {
      reset({
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
      const payload: {
        isSiteVisit: boolean;
        siteVisitDate?: string;
        adminNotes?: string;
      } = {
        isSiteVisit: values.isSiteVisit,
        adminNotes: values.adminNotes.trim(),
      };

      if (values.isSiteVisit && values.siteVisitDate) {
        payload.siteVisitDate = new Date(values.siteVisitDate).toISOString();
      }

      const response = await axiosInstance.patch(
        `/booking/${booking._id}/management`,
        payload,
      );

      toast.success(
        response.data?.message || "Booking details updated successfully.",
      );
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking site visit and notes.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open && Boolean(booking)} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Manage Site Visit & Notes
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Configure the site visit inspection schedule and internal notes for booking{" "}
              <span className="font-semibold text-foreground">
                #{booking?.bookingNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Current Overview Box */}
              <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Site visit:</span>
                  <span className="font-semibold text-foreground">
                    {booking?.isSiteVisit ? "Enabled / Required" : "Disabled"}
                  </span>
                </div>
                {booking?.siteVisitDate && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                    <span className="text-muted-foreground">Scheduled inspection:</span>
                    <span className="font-medium text-foreground">
                      {formatBookingDate(booking.siteVisitDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Site Visit Switch */}
              <div className="space-y-4 rounded-xl border bg-muted/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="site-visit-switch" className="text-sm font-semibold text-navy">
                      Site Visit Inspection
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enable if a physical inspection or site assessment is required.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="isSiteVisit"
                    render={({ field }) => (
                      <Switch
                        id="site-visit-switch"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>

                {isSiteVisit && (
                  <div className="space-y-2 pt-3 border-t border-border/60">
                    <Label htmlFor="site-visit-time" className="text-xs font-semibold text-navy">
                      Scheduled Inspection Date & Time
                    </Label>
                    <Input
                      id="site-visit-time"
                      type="datetime-local"
                      disabled={isSubmitting}
                      {...register("siteVisitDate")}
                      className="h-11 rounded-xl bg-background"
                    />
                    {errors.siteVisitDate && (
                      <p className="text-xs text-destructive">
                        {errors.siteVisitDate.message}
                      </p>
                    )}
                    <p className="text-xs leading-5 text-muted-foreground">
                      Set the planned inspection date and time for the site team.
                    </p>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="mgmt-admin-notes" className="text-sm font-semibold text-navy">
                  Internal Admin Notes
                </Label>
                <Textarea
                  id="mgmt-admin-notes"
                  rows={4}
                  placeholder="Record internal notes, scope observations, or client requirements..."
                  disabled={isSubmitting}
                  {...register("adminNotes")}
                  className="min-h-28 resize-none rounded-xl"
                />
                {errors.adminNotes && (
                  <p className="text-xs text-destructive">{errors.adminNotes.message}</p>
                )}
                <p className="text-xs leading-5 text-muted-foreground">
                  Internal notes are private to administrators and never shown to the customer.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <DashboardButton
                type="button"
                variant="outline"
                className="min-h-10 rounded-xl px-5 text-xs font-bold"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                type="submit"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? "Saving..." : "Save Details"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
