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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBookingApiError, updateBookingPrice } from "@/lib/api/bookings";
import type { Booking } from "@/types/admin/booking.type";
import { formatBookingAmount } from "./bookingUtils";

type UpdateBookingPriceModalProps = {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking, message: string) => void;
};

export default function UpdateBookingPriceModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingPriceModalProps) {
  const [price, setPrice] = useState(String(booking.finalPrice));
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const parsedPrice = Number(price);
  const isValidPrice =
    price.trim() !== "" && Number.isFinite(parsedPrice) && parsedPrice >= 0;

  async function submit() {
    if (isLoading) return;
    if (!isValidPrice) {
      setValidationError("Enter a valid, non-negative price.");
      return;
    }

    setValidationError("");
    setIsLoading(true);
    try {
      const response = await updateBookingPrice(booking._id, parsedPrice);
      onSuccess(response.data, response.message || "Booking price updated successfully.");
    } catch (error: unknown) {
      const message = getBookingApiError(error, "Failed to update the booking price.");
      setValidationError(message);
      toast.error(message);
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
              Update Booking Price
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Set the final price for booking{" "}
              <span className="font-semibold text-foreground">{booking.bookingNumber}</span>.
              This does not change the service&apos;s catalogue price.
            </DialogDescription>
          </DialogHeader>

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
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                  setValidationError("");
                }}
                disabled={isLoading}
                aria-invalid={Boolean(validationError)}
              />
              {validationError && (
                <p className="text-sm text-destructive" role="alert">
                  {validationError}
                </p>
              )}
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
              disabled={isLoading || (isValidPrice && parsedPrice === booking.finalPrice)}
              onClick={() => void submit()}
              icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isLoading ? "Updating..." : "Update Price"}
            </DashboardButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
