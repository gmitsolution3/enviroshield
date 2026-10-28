"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { usePatch } from "@/hooks/swr/usePatch";
import { getBookingApiError } from "@/lib/api/bookings";
import type { Booking, BookingManagementUpdate, BookingResponse } from "@/types/admin/booking.type";

type UpdateBookingManagementModalProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
};

const formSchema = z
  .object({
    isSiteVisit: z.boolean(),
    siteVisitDate: z.string(),
    adminNotes: z.string().max(2000, "Admin notes must be 2,000 characters or fewer."),
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
  const { mutate: patchBookingManagement, isLoading } = usePatch("/booking");
  const originalValues: FormValues = {
    isSiteVisit: booking.isSiteVisit,
    siteVisitDate: toDateTimeInput(booking.siteVisitDate),
    adminNotes: booking.adminNotes ?? "",
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: originalValues,
  });
  const watchedValues = useWatch({ control });
  const values = { ...originalValues, ...watchedValues };
  const hasChanges =
    values.isSiteVisit !== originalValues.isSiteVisit ||
    values.siteVisitDate !== originalValues.siteVisitDate ||
    values.adminNotes !== originalValues.adminNotes;

  useEffect(() => {
    if (open) reset(originalValues);
  // originalValues is derived from this booking and only changes when its data changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking._id, booking.updatedAt, open, reset]);

  async function onSubmit(formValues: FormValues) {
    if (isLoading) return;
    const changes: BookingManagementUpdate = {};

    if (formValues.isSiteVisit !== originalValues.isSiteVisit) {
      changes.isSiteVisit = formValues.isSiteVisit;
    }
    if (
      formValues.isSiteVisit &&
      formValues.siteVisitDate !== originalValues.siteVisitDate
    ) {
      if (formValues.siteVisitDate) {
        changes.siteVisitDate = new Date(formValues.siteVisitDate).toISOString();
      }
    }
    if (formValues.adminNotes !== originalValues.adminNotes) {
      changes.adminNotes = formValues.adminNotes;
    }
    if (Object.keys(changes).length === 0) return;

    try {
      const response: BookingResponse = await patchBookingManagement({
        id: `${encodeURIComponent(booking._id)}/management`,
        data: changes,
      });
      if (!response.success || !response.data?._id) {
        throw new Error(response.message || "Failed to update booking management information.");
      }
      onSuccess(
        response.data,
        response.message || "Booking management information updated.",
      );
    } catch (error: unknown) {
      const message = getBookingApiError(
        error,
        "Failed to update booking management information.",
      );
      setError("root.serverError", { message });
      toast.error(message);
    }
  }

  function handleClose() {
    if (isLoading) return;
    onClose();
    reset(originalValues);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && !isLoading && handleClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Manage Booking Information
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Update the site visit and internal notes for{" "}
              <span className="font-semibold text-foreground">
                {booking.bookingNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="space-y-1">
                  <Label htmlFor="booking-management-site-visit" className="font-semibold text-navy">
                    Enable site visit
                  </Label>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Disabling a site visit clears its scheduled date.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isSiteVisit"
                  render={({ field }) => (
                    <Switch
                      id="booking-management-site-visit"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        clearErrors("root.serverError");
                      }}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-management-site-visit-date" className="font-semibold text-navy">
                  Site-visit date and time (optional)
                </Label>
                <Input
                  id="booking-management-site-visit-date"
                  type="datetime-local"
                  {...register("siteVisitDate", {
                    onChange: () => clearErrors("root.serverError"),
                  })}
                  disabled={!values.isSiteVisit || isLoading}
                  aria-invalid={Boolean(errors.siteVisitDate)}
                  className="h-11 rounded-xl"
                />
                {errors.siteVisitDate ? (
                  <p className="text-sm text-destructive" role="alert">{errors.siteVisitDate.message}</p>
                ) : !values.isSiteVisit ? (
                  <p className="text-xs text-muted-foreground">Enable the site visit before assigning a date.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="booking-management-admin-notes" className="font-semibold text-navy">
                    Admin notes
                  </Label>
                  <span className="text-xs text-muted-foreground">{values.adminNotes.length}/2000</span>
                </div>
                <Textarea
                  id="booking-management-admin-notes"
                  {...register("adminNotes", {
                    onChange: () => clearErrors("root.serverError"),
                  })}
                  maxLength={2000}
                  rows={5}
                  disabled={isLoading}
                  aria-invalid={Boolean(errors.adminNotes)}
                  placeholder="Add internal notes about this booking..."
                  className="resize-none"
                />
                {errors.adminNotes && <p className="text-sm text-destructive" role="alert">{errors.adminNotes.message}</p>}
              </div>
              {errors.root?.serverError && <p className="text-sm text-destructive" role="alert">{errors.root.serverError.message}</p>}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <DashboardButton
                variant="outline"
                className="min-h-10 rounded-xl px-5"
                disabled={isLoading}
                onClick={handleClose}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                type="submit"
                disabled={isLoading || !hasChanges}
                icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
