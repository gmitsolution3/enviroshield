"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, Loader2 } from "lucide-react";
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
import type { Booking } from "@/types/admin/booking.type";

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
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-2">
            <CalendarClock className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-navy">
            Manage Site Visit & Notes
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Schedule an inspection visit and add internal notes for booking{" "}
            <span className="font-semibold text-foreground">
              #{booking?.bookingNumber}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 px-6 py-6 sm:px-7">
            {/* Site Visit Toggle & Date */}
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-border/60 dark:bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="site-visit-switch" className="text-sm font-semibold text-navy">
                    Site Visit Inspection
                  </Label>
                  <p className="text-xs text-muted-foreground">
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
                <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-border/40">
                  <Label htmlFor="site-visit-time" className="text-xs font-semibold text-navy">
                    Scheduled Inspection Date & Time
                  </Label>
                  <Input
                    id="site-visit-time"
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
              <Label htmlFor="mgmt-admin-notes" className="text-sm font-semibold text-navy">
                Internal Admin Notes
              </Label>
              <Textarea
                id="mgmt-admin-notes"
                rows={4}
                placeholder="Record inspection details, scope observations, or internal team instructions..."
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
                "Save Details"
              )}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

