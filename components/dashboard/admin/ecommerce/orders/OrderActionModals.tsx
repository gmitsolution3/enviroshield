"use client";

import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import type { AdminOrder, OrderStatus } from "@/types";
import {
  getOrderActionError,
  prettyOrderStatus,
  type OrderMutationResponse,
} from "./orderActionUtils";

type OrderActionModalProps = {
  order: AdminOrder | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
  onSuccess: (order: AdminOrder, message: string) => void;
};

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function UpdateOrderStatusModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: updateStatus, isLoading } = usePatch("/order", {
    revalidateKey,
  });
  const [status, setStatus] = useState<OrderStatus>(
    order?.status ?? "pending",
  );

  const submit = async () => {
    if (!order || isLoading || status === order.status) return;
    try {
      const response: OrderMutationResponse = await updateStatus({
        id: `${order._id}/status`,
        data: { status },
      });
      if (response.success === false) {
        toast.error(
          response.message || "Failed to update order status.",
        );
        return;
      }
      onSuccess(
        response.data,
        response.message || "Order status updated successfully.",
      );
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(error, "Failed to update order status."),
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
          <DialogTitle className="text-xl font-bold text-navy">
            Update Order Status
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Choose the new fulfillment status for order{" "}
            {order?.orderNumber}.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            <span className="text-muted-foreground">
              Current status:{" "}
            </span>
            <span className="font-semibold">
              {order ? prettyOrderStatus(order.status) : "—"}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-order-status" className="font-semibold text-navy">New status</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                const nextStatus = ORDER_STATUSES.find(
                  (item) => item === value,
                );
                if (nextStatus) setStatus(nextStatus);
              }}
            >
              <SelectTrigger id="new-order-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {prettyOrderStatus(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={isLoading || !order || status === order.status}
            onClick={() => void submit()}
            icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </DashboardButton>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MarkPaymentPaidModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: markPaid, isLoading } = usePatch("/order", {
    revalidateKey,
  });

  const submit = async () => {
    if (!order || isLoading || order.paymentStatus === "paid") return;
    try {
      const response: OrderMutationResponse = await markPaid({
        id: `${order._id}/payment-status`,
        data: { paymentStatus: "paid" },
      });
      if (response.success === false) {
        toast.error(
          response.message || "Failed to update payment status.",
        );
        return;
      }
      onSuccess(
        response.data,
        response.message || "Payment marked as paid.",
      );
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(
          error,
          "Failed to update payment status.",
        ),
      );
    }
  };

  return (
    <AlertDialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl">
        <div className="p-6">
          <AlertDialogHeader className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold text-navy">
                Mark Payment as Paid
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm leading-6">
                Confirm payment for order{" "}
                <span className="font-semibold text-foreground">{order?.orderNumber}</span>. Its current payment status is{" "}
                <span className="font-semibold text-foreground">{order ? prettyOrderStatus(order.paymentStatus) : "—"}</span>. Confirming will change it to Paid.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isLoading}
              className="min-h-10 rounded-xl px-5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading || !order || order.paymentStatus === "paid"}
              onClick={(event) => {
                event.preventDefault();
                void submit();
              }}
              className="min-h-10 rounded-xl bg-blue px-5 font-semibold text-white shadow-sm hover:bg-blue/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CancelOrderModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: cancelOrder, isLoading } = usePatch("/order", {
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
      if (response.success === false) {
        toast.error(response.message || "Failed to cancel order.");
        return;
      }
      onSuccess(
        response.data,
        response.message || "Order cancelled successfully.",
      );
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
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-navy">
            Cancel Order
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            Cancel order{" "}
            <span className="font-semibold text-foreground">{order?.orderNumber}</span>. This changes its status to Cancelled.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="space-y-2">
          <Label htmlFor="order-cancellation-reason" className="font-semibold text-navy">
            Cancellation reason
          </Label>
          <Textarea
            id="order-cancellation-reason"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setValidationError("");
            }}
            disabled={isLoading}
            maxLength={500}
            aria-invalid={Boolean(validationError)}
            placeholder="Enter why this order is being cancelled"
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
            Close
          </DashboardButton>
          <DashboardButton
            className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
            disabled={
              isLoading ||
              !order ||
              order.status === "cancelled" ||
              reason.trim().length < 3 ||
              reason.trim().length > 500
            }
            onClick={() => void submit()}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cancelling...</>
            ) : "Confirm Cancellation"}
          </DashboardButton>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
