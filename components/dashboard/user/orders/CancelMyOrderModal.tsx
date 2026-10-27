"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import type { AdminOrder } from "@/types";

import {
  getOrderActionError,
  type OrderMutationResponse,
} from "../../admin/ecommerce/orders/orderActionUtils";

type CancelMyOrderModalProps = {
  order: AdminOrder | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
  onSuccess: (order: AdminOrder) => void;
};

export default function CancelMyOrderModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: CancelMyOrderModalProps) {
  const { mutate: cancelOrder, isLoading } = usePatch("/order/mine", {
    revalidateKey,
  });
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const submit = async () => {
    if (!order || isLoading) return;

    const normalizedReason = reason.trim();
    if (
      normalizedReason.length < 3 ||
      normalizedReason.length > 500
    ) {
      setValidationError(
        "Enter a reason between 3 and 500 characters.",
      );
      return;
    }

    setValidationError("");
    try {
      const response: OrderMutationResponse = await cancelOrder({
        id: `${order._id}/cancel`,
        data: { reason: normalizedReason },
      });

      if (!response.success) {
        toast.error(response.message || "Failed to cancel order.");
        return;
      }

      toast.success(
        response.message || "Order cancelled successfully.",
      );
      onSuccess(response.data);
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(error, "Failed to cancel order."),
      );
    }
  };

  return (
    <Dialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-xl font-bold text-navy">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Request cancellation for order{" "}
              <span className="font-semibold text-foreground">
                {order?.orderNumber}
              </span>
              . Only pending orders can be cancelled.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="space-y-2">
              <Label
                htmlFor="my-order-cancellation-reason"
                className="font-semibold text-navy"
              >
                Reason for Cancellation
              </Label>
              <Textarea
                id="my-order-cancellation-reason"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setValidationError("");
                }}
                disabled={isLoading}
                maxLength={500}
                aria-invalid={Boolean(validationError)}
                placeholder="Please tell us why you want to cancel this order..."
                className="min-h-32 resize-none"
              />
              <div className="flex justify-between gap-3 text-xs">
                <p className="text-red-600" role="alert">
                  {validationError}
                </p>
                <p className="ml-auto text-muted-foreground">
                  {reason.trim().length}/500 (minimum 3)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5"
              disabled={isLoading}
              onClick={onClose}
            >
              Keep Order
            </DashboardButton>
            <DashboardButton
              className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
              disabled={
                isLoading ||
                !order ||
                order.status !== "pending" ||
                reason.trim().length < 3 ||
                reason.trim().length > 500
              }
              onClick={() => void submit()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </DashboardButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
