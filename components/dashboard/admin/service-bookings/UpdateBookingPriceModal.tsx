"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { usePatch } from "@/hooks/swr/usePatch";
import { getBookingApiError } from "@/lib/api/bookings";
import type { Booking, BookingResponse } from "@/types/admin/booking.type";
import { formatBookingAmount } from "./bookingUtils";

type UpdateBookingPriceModalProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
};

const formSchema = z.object({
  price: z
    .string()
    .trim()
    .min(1, "Enter a price.")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
      "Enter a valid, non-negative price.",
    ),
});
type FormValues = z.infer<typeof formSchema>;

export default function UpdateBookingPriceModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingPriceModalProps) {
  const { mutate: patchBookingPrice, isLoading } = usePatch("/booking");
  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: String(booking.finalPrice) },
  });
  const price = useWatch({ control, name: "price" });
  const parsedPrice = Number(price);

  useEffect(() => {
    if (open) reset({ price: String(booking.finalPrice) });
  }, [booking._id, booking.finalPrice, open, reset]);

  async function onSubmit(values: FormValues) {
    if (isLoading) return;
    try {
      const response: BookingResponse = await patchBookingPrice({
        id: `${encodeURIComponent(booking._id)}/price`,
        data: { finalPrice: Number(values.price) },
      });
      if (!response.success || !response.data?._id) {
        throw new Error(response.message || "Failed to update the booking price.");
      }
      onSuccess(
        response.data,
        response.message || "Booking price updated successfully.",
      );
    } catch (error: unknown) {
      const message = getBookingApiError(error, "Failed to update the booking price.");
      setError("root.serverError", { message });
      toast.error(message);
    }
  }

  function handleClose() {
    if (isLoading) return;
    onClose();
    reset({ price: String(booking.finalPrice) });
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
              Update Booking Price
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Set the final price for booking{" "}
              <span className="font-semibold text-foreground">
                {booking.bookingNumber}
              </span>
              . This does not change the service&apos;s catalogue price.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="rounded-xl border bg-muted/20 p-4 text-sm">
                <span className="text-muted-foreground">Current final price: </span>
                <span className="font-semibold">{formatBookingAmount(booking.finalPrice)}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-booking-price" className="font-semibold text-navy">
                  New final price
                </Label>
                <Input
                  id="new-booking-price"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  {...register("price", {
                    onChange: () => clearErrors("root.serverError"),
                  })}
                  disabled={isLoading}
                  aria-invalid={Boolean(errors.price)}
                  className="h-11 rounded-xl"
                />
                {errors.price && <p className="text-sm text-destructive" role="alert">{errors.price.message}</p>}
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
                disabled={isLoading || (Number.isFinite(parsedPrice) && parsedPrice === booking.finalPrice)}
                icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
              >
                {isLoading ? "Updating..." : "Update Price"}
              </DashboardButton>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
