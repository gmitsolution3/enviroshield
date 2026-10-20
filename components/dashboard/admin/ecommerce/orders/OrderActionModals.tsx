"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import type { AdminOrder, OrderStatus } from "@/types";
import { getOrderActionError, prettyOrderStatus, type OrderMutationResponse } from "./orderActionUtils";

type OrderActionModalProps = {
  order: AdminOrder | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
  onSuccess: (order: AdminOrder, message: string) => void;
};

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export function UpdateOrderStatusModal({ order, open, revalidateKey, onClose, onSuccess }: OrderActionModalProps) {
  const { mutate: updateStatus, isLoading } = usePatch("/order", { revalidateKey });
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? "pending");

  const submit = async () => {
    if (!order || isLoading || status === order.status) return;
    try {
      const response: OrderMutationResponse = await updateStatus({ id: `${order._id}/status`, data: { status } });
      if (response.success === false) {
        toast.error(response.message || "Failed to update order status.");
        return;
      }
      onSuccess(response.data, response.message || "Order status updated successfully.");
    } catch (error: unknown) {
      toast.error(getOrderActionError(error, "Failed to update order status."));
    }
  };

  return (
    <Dialog open={open && Boolean(order)} onOpenChange={(value) => !value && !isLoading && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5 pr-14 text-left">
          <DialogTitle className="text-xl font-bold text-navy">Update Order Status</DialogTitle>
          <DialogDescription>Choose the new fulfillment status for order {order?.orderNumber}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-6 py-5">
          <div className="rounded-xl bg-muted/50 p-4 text-sm">
            <span className="text-muted-foreground">Current status: </span><span className="font-semibold">{order ? prettyOrderStatus(order.status) : "—"}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-order-status">New status</Label>
            <Select value={status} onValueChange={(value) => {
              const nextStatus = ORDER_STATUSES.find((item) => item === value);
              if (nextStatus) setStatus(nextStatus);
            }}>
            <SelectTrigger id="new-order-status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
                {ORDER_STATUSES.map((value) => <SelectItem key={value} value={value}>{prettyOrderStatus(value)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4 sm:flex-row">
          <DashboardButton variant="outline" className="min-h-10 rounded-xl" disabled={isLoading} onClick={onClose}>Cancel</DashboardButton>
          <DashboardButton className="min-h-10 rounded-xl" disabled={isLoading || !order || status === order.status} onClick={() => void submit()}>
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : "Update Status"}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MarkPaymentPaidModal({ order, open, revalidateKey, onClose, onSuccess }: OrderActionModalProps) {
  const { mutate: markPaid, isLoading } = usePatch("/order", { revalidateKey });

  const submit = async () => {
    if (!order || isLoading || order.paymentStatus === "paid") return;
    try {
      const response: OrderMutationResponse = await markPaid({ id: `${order._id}/payment-status`, data: { paymentStatus: "paid" } });
      if (response.success === false) {
        toast.error(response.message || "Failed to update payment status.");
        return;
      }
      onSuccess(response.data, response.message || "Payment marked as paid.");
    } catch (error: unknown) {
      toast.error(getOrderActionError(error, "Failed to update payment status."));
    }
  };

  return (
    <Dialog open={open && Boolean(order)} onOpenChange={(value) => !value && !isLoading && onClose()}>
      <DialogContent className="rounded-2xl border-0 p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5 pr-14 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle className="h-5 w-5" /></div>
          <DialogTitle className="text-xl font-bold text-navy">Mark Payment as Paid</DialogTitle>
          <DialogDescription>Confirm payment for order {order?.orderNumber}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 px-6 py-5 text-sm">
          <p className="text-muted-foreground">Current payment status: <span className="font-semibold text-foreground">{order ? prettyOrderStatus(order.paymentStatus) : "—"}</span></p>
          <p>This will change this order&apos;s payment status to Paid.</p>
        </div>
        <DialogFooter className="border-t px-6 py-4 sm:flex-row">
          <DashboardButton variant="outline" className="min-h-10 rounded-xl" disabled={isLoading} onClick={onClose}>Cancel</DashboardButton>
          <DashboardButton className="min-h-10 rounded-xl" disabled={isLoading || !order || order.paymentStatus === "paid"} onClick={() => void submit()}>
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : "Confirm Payment"}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CancelOrderModal({ order, open, revalidateKey, onClose, onSuccess }: OrderActionModalProps) {
  const { mutate: cancelOrder, isLoading } = usePatch("/order", { revalidateKey });
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const submit = async () => {
    if (!order || isLoading) return;
    const normalizedReason = reason.trim();
    if (normalizedReason.length < 3 || normalizedReason.length > 500) {
      setValidationError("Enter a reason between 3 and 500 characters.");
      return;
    }
    setValidationError("");
    try {
      const response: OrderMutationResponse = await cancelOrder({ id: `${order._id}/cancel`, data: { reason: normalizedReason } });
      if (response.success === false) {
        toast.error(response.message || "Failed to cancel order.");
        return;
      }
      onSuccess(response.data, response.message || "Order cancelled successfully.");
    } catch (error: unknown) {
      toast.error(getOrderActionError(error, "Failed to cancel order."));
    }
  };

  return (
    <Dialog open={open && Boolean(order)} onOpenChange={(value) => !value && !isLoading && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-5 pr-14 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
          <DialogTitle className="text-xl font-bold text-navy">Cancel Order</DialogTitle>
          <DialogDescription>Cancel order {order?.orderNumber}. This changes its order status to Cancelled.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 px-6 py-5">
          <Label htmlFor="order-cancellation-reason">Cancellation reason</Label>
          <Textarea id="order-cancellation-reason" value={reason} onChange={(event) => { setReason(event.target.value); setValidationError(""); }} disabled={isLoading} maxLength={500} aria-invalid={Boolean(validationError)} placeholder="Enter why this order is being cancelled" />
          <div className="flex justify-between gap-3 text-xs">
            <p className="text-red-600" role="alert">{validationError}</p>
            <p className="ml-auto text-muted-foreground">{reason.trim().length}/500 (minimum 3)</p>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4 sm:flex-row">
          <DashboardButton variant="outline" className="min-h-10 rounded-xl" disabled={isLoading} onClick={onClose}>Close</DashboardButton>
          <DashboardButton className="min-h-10 rounded-xl bg-red-600 hover:bg-red-700" disabled={isLoading || !order || order.status === "cancelled" || reason.trim().length < 3 || reason.trim().length > 500} onClick={() => void submit()}>
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Cancelling...</> : "Confirm Cancellation"}
          </DashboardButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
