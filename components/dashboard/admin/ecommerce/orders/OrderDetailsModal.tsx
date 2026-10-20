"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminOrder } from "@/types";
import {
  formatOrderAmount,
  formatOrderDate,
  prettyOrderStatus,
} from "./orderActionUtils";

const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  processing: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shipped: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-slate-200 bg-slate-100 text-slate-700",
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="break-words font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={statusStyles[status] ?? "capitalize"}>
      {prettyOrderStatus(status)}
    </Badge>
  );
}

type OrderDetailsModalProps = {
  order: AdminOrder | null;
  open: boolean;
  onClose: () => void;
};

export default function OrderDetailsModal({ order, open, onClose }: OrderDetailsModalProps) {
  return (
    <Dialog open={open && Boolean(order)} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-hidden border-0 bg-[#f8fafc] p-0 shadow-2xl">
        {order && (
          <div className="flex max-h-[92vh] flex-col overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Complete customer, delivery, item, payment, and order information.</DialogDescription>
            </DialogHeader>

            <section className="relative shrink-0 overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
              <div className="relative space-y-2 pr-8">
                <p className="text-sm text-white/70">Order placed {formatOrderDate(order.createdAt)}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">Order {order.orderNumber}</h2>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </section>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">Customer</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Detail label="Name" value={order.customer.name} />
                  <Detail label="Phone" value={order.customer.phone} />
                  <Detail label="Email" value={order.customer.email} />
                </div>
              </section>

              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">Delivery</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Address" value={order.deliveryAddress.addressLine} />
                  <Detail label="Area" value={order.deliveryAddress.area} />
                  <Detail label="City" value={order.deliveryAddress.city} />
                  <Detail label="District" value={order.deliveryAddress.district} />
                  <Detail label="Postal code" value={order.deliveryAddress.postalCode ?? "—"} />
                  <Detail label="Delivery zone" value={prettyOrderStatus(order.deliveryZone)} />
                </div>
              </section>

              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">Ordered products</h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.primaryImage?.url ? (
                          <Image src={item.primaryImage.url} alt={item.primaryImage.alt || item.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</div>
                        )}
                      </div>
                      <div className="min-w-[140px] flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-2 text-sm sm:w-auto sm:min-w-[300px]">
                        <Detail label="Unit" value={formatOrderAmount(item.unitPrice, order.currency)} />
                        <Detail label="Qty" value={String(item.quantity)} />
                        <Detail label="Line total" value={formatOrderAmount(item.lineTotal, order.currency)} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-5 rounded-2xl border bg-white p-5 md:grid-cols-2">
                <div className="space-y-3">
                  <h2 className="font-semibold text-navy">Payment</h2>
                  <Detail label="Method" value={order.paymentMethod === "cod" ? "Cash on delivery" : prettyOrderStatus(order.paymentMethod)} />
                  <div className="space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment status</p><StatusBadge status={order.paymentStatus} /></div>
                  <div className="space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Order status</p><StatusBadge status={order.status} /></div>
                </div>
                <div className="space-y-3">
                  <h2 className="font-semibold text-navy">Summary</h2>
                  <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatOrderAmount(order.subtotal, order.currency)}</span></div>
                  <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Delivery fee</span><span>{formatOrderAmount(order.deliveryFee, order.currency)}</span></div>
                  <div className="flex justify-between gap-4 border-t pt-3 font-bold text-navy"><span>Total ({order.currency})</span><span>{formatOrderAmount(order.totalAmount, order.currency)}</span></div>
                </div>
              </section>

              {(order.customerNote || order.cancellationReason) && (
                <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
                  {order.customerNote && <Detail label="Customer note" value={order.customerNote} />}
                  {order.cancellationReason && <Detail label="Cancellation reason" value={order.cancellationReason} />}
                </section>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
