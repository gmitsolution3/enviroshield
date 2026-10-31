"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import type { Booking } from "@/types/booking.type";
import { formatBookingAmount } from "./bookingUtils";

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
      toast.info("Price is already set to BDT " + formatBookingAmount(numericPrice));
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
    <Dialog open={open && Boolean(booking)} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Final Price
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Adjust the final agreed price for booking{" "}
              <span className="font-semibold text-foreground">
                #{booking?.bookingNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Current Price Box */}
              <div className="rounded-xl border bg-muted/20 p-4 text-sm">
                <span className="text-muted-foreground">Current final price: </span>
                <span className="font-semibold text-foreground">
                  {booking?.finalPrice != null
                    ? `BDT ${formatBookingAmount(booking.finalPrice)}`
                    : "Not set (Quote Pending)"}
                </span>
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <Label htmlFor="final-price-input" className="text-sm font-semibold text-navy">
                  New Final Price (BDT)
                </Label>
                <Input
                  id="final-price-input"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 15000"
                  disabled={isSubmitting}
                  {...register("finalPrice")}
                  className="h-11 rounded-xl"
                />
                {errors.finalPrice && (
                  <p className="text-xs text-destructive">{errors.finalPrice.message}</p>
                )}
                <p className="text-xs leading-5 text-muted-foreground">
                  Enter the total finalized price in BDT for this booking request.
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
                {isSubmitting ? "Updating..." : "Update Price"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
