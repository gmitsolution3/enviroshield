"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { axiosInstance } from "@/lib/axios";
import type { Booking } from "@/types/admin/booking.type";

type UpdateBookingPriceModalProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const formSchema = z.object({
  finalPrice: z
    .string()
    .trim()
    .min(1, "Price is required.")
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) >= 0,
      "Price must be a valid non-negative number.",
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateBookingPriceModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingPriceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      finalPrice: "",
    },
  });

  useEffect(() => {
    if (open && booking) {
      reset({
        finalPrice:
          booking.finalPrice != null ? String(booking.finalPrice) : "",
      });
    }
  }, [open, booking, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!booking) return;

    const numericPrice = Number(values.finalPrice);
    if (booking.finalPrice === numericPrice) {
      toast.info("Price is already set to BDT " + numericPrice.toLocaleString());
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.patch(`/booking/${booking._id}/price`, {
        finalPrice: numericPrice,
      });

      toast.success(
        response.data?.message || "Booking price updated successfully.",
      );
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking price.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
            <DollarSign className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-navy">
            Update Final Price
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Set or adjust the final agreed service price for booking{" "}
            <span className="font-semibold text-foreground">
              #{booking?.bookingNumber}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 py-6 sm:px-7">
            <div className="space-y-2">
              <Label htmlFor="final-price-input" className="text-sm font-semibold text-navy">
                Final Price (BDT)
              </Label>
              <Input
                id="final-price-input"
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
                "Update Price"
              )}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
