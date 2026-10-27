"use client";

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
  BadgeCheck,
  Check,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
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
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="break-words font-medium text-foreground">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={statusStyles[status] ?? "capitalize"}
    >
      {prettyOrderStatus(status)}
    </Badge>
  );
}

const fulfillmentStages: {
  status: AdminOrder["status"];
  label: string;
  Icon: LucideIcon;
}[] = [
  { status: "pending", label: "Order Placed", Icon: ShoppingBag },
  { status: "confirmed", label: "Confirmed", Icon: BadgeCheck },
  { status: "processing", label: "Processing", Icon: Package },
  { status: "shipped", label: "Shipped", Icon: Truck },
  { status: "delivered", label: "Delivered", Icon: PackageCheck },
];

const SEGMENT_DURATION = 0.45; // seconds the bar takes to travel between two stages

function OrderTrackingTimeline({ order }: { order: AdminOrder }) {
  const prefersReducedMotion = useReducedMotion();

  if (order.status === "cancelled") {
    return (
      <section
        aria-label="Order cancellation status"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
            <XCircle className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Order Cancelled
            </h3>
            <p className="mt-1 text-sm leading-5 text-red-800/80 dark:text-red-200/80">
              This order is no longer progressing through fulfilment.
            </p>
            {order.cancellationReason && (
              <p className="mt-3 text-sm text-red-900 dark:text-red-200">
                <span className="font-semibold">Reason:</span>{" "}
                {order.cancellationReason}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const currentIndex = Math.max(
    fulfillmentStages.findIndex(
      (stage) => stage.status === order.status,
    ),
    0,
  );
  const lastIndex = fulfillmentStages.length - 1;
  const isDelivered = order.status === "delivered";

  // One shared clock: the bar moves at a constant speed (linear), so stage `i`
  // is reached at exactly i * SEGMENT_DURATION. Nodes/labels use the same value.
  const reachTime = (index: number) =>
    prefersReducedMotion ? 0 : index * SEGMENT_DURATION;
  const totalFillTime = reachTime(currentIndex);

  return (
    <section
      aria-label="Order fulfilment progress"
      className="rounded-2xl border bg-card p-4 text-card-foreground sm:p-5"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-navy dark:text-foreground">
          Order tracking
        </h3>
        <p className="text-xs text-muted-foreground">
          {prettyOrderStatus(order.status)}
        </p>
      </div>

      {/* key replays the whole sequence when the order or its status changes */}
      <ol
        key={`${order.orderNumber}-${order.status}`}
        className="relative grid grid-cols-5 gap-1"
      >
        {fulfillmentStages.map(({ status, label, Icon }, index) => {
          const isCurrent = index === currentIndex;
          const isComplete = index < currentIndex || isDelivered;
          const isReached = isCurrent || isComplete;
          const delay = reachTime(index);
          const nodeFade = {
            duration: prefersReducedMotion ? 0 : 0.3,
            delay,
            ease: "easeOut" as const,
          };

          return (
            <li
              key={status}
              className="relative flex min-w-0 flex-col items-center text-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Track + fill (drawn once from the first step, spans centre-to-centre) */}
              {index === 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-4 z-0 h-1 w-[calc(400%+1rem)] -translate-y-1/2 overflow-hidden rounded-full bg-border sm:top-5"
                >
                  {currentIndex > 0 && (
                    <motion.span
                      initial={
                        prefersReducedMotion ? false : { scaleX: 0 }
                      }
                      animate={{ scaleX: currentIndex / lastIndex }}
                      transition={{
                        duration: prefersReducedMotion
                          ? 0
                          : totalFillTime,
                        ease: "linear",
                      }}
                      style={{ transformOrigin: "left center" }}
                      className="absolute inset-0 rounded-full bg-blue will-change-transform"
                    />
                  )}
                </span>
              )}

              {/* Glow pulse behind the current step. The loops run from mount;
                  only the wrapper fades in once the bar arrives, so nothing
                  restarts or pops at the end of the fill. */}
              {isCurrent && !prefersReducedMotion && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: totalFillTime,
                    ease: "easeOut",
                  }}
                  className="pointer-events-none absolute left-1/2 top-0 z-0 size-8 -translate-x-1/2 sm:size-10"
                >
                  <motion.span
                    className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(1,110,220,0.55)_0%,rgba(1,110,220,0)_70%)]"
                    animate={{
                      opacity: [0.35, 0.9, 0.35],
                      scale: [0.95, 1.25, 0.95],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-blue"
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </motion.span>
              )}

              {/* Step node: muted base + blue layer that fades in when the bar arrives */}
              <span className="relative z-10 grid size-8 place-items-center rounded-full border border-border bg-muted text-muted-foreground sm:size-10">
                <Icon
                  className="size-4 sm:size-[18px]"
                  aria-hidden="true"
                />

                {isReached && (
                  <motion.span
                    initial={
                      prefersReducedMotion ? false : { opacity: 0 }
                    }
                    animate={{ opacity: 1 }}
                    transition={nodeFade}
                    className={`absolute -inset-px grid place-items-center rounded-full border border-blue bg-blue text-white ${
                      isCurrent
                        ? "shadow-[0_0_14px_rgba(1,110,220,0.5)] ring-4 ring-blue/20"
                        : "shadow-[0_0_6px_rgba(1,110,220,0.25)]"
                    }`}
                  >
                    <Icon
                      className="size-4 sm:size-[18px]"
                      aria-hidden="true"
                    />
                  </motion.span>
                )}

                {isComplete && (
                  <motion.span
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, scale: 0 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.25,
                      delay: delay + 0.12,
                      ease: "easeOut",
                    }}
                    className="absolute -right-1 -bottom-1 z-10 grid size-4 place-items-center rounded-full border border-card bg-card text-blue"
                  >
                    <Check className="size-3" aria-hidden="true" />
                  </motion.span>
                )}
              </span>

              {/* Label: muted text fades out while the active text fades in, same clock */}
              <span className="relative mt-2 max-w-full text-[9px] font-medium leading-tight sm:text-xs">
                <motion.span
                  className="block text-muted-foreground"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isReached ? 0 : 1 }}
                  transition={nodeFade}
                >
                  {label}
                </motion.span>
                {isReached && (
                  <motion.span
                    initial={
                      prefersReducedMotion ? false : { opacity: 0 }
                    }
                    animate={{ opacity: 1 }}
                    transition={nodeFade}
                    className={`absolute inset-0 block ${
                      isCurrent
                        ? "font-semibold text-blue"
                        : "text-foreground"
                    }`}
                  >
                    {label}
                  </motion.span>
                )}
              </span>

              {isCurrent && (
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? false
                      : { opacity: 0, y: -3 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...nodeFade, delay: delay + 0.1 }}
                  className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-blue sm:text-[9px]"
                >
                  Current Status
                </motion.span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

type OrderDetailsModalProps = {
  order: AdminOrder | null;
  open: boolean;
  onClose: () => void;
  displayPaymentStatus?: string;
  showTrackingTimeline?: boolean;
};

export default function OrderDetailsModal({
  order,
  open,
  onClose,
  displayPaymentStatus,
  showTrackingTimeline = false,
}: OrderDetailsModalProps) {
  return (
    <Dialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-hidden border-0 bg-[#f8fafc] p-0 shadow-2xl">
        {order && (
          <div className="flex max-h-[92vh] flex-col overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Complete customer, delivery, item, payment, and order
                information.
              </DialogDescription>
            </DialogHeader>

            <section className="relative shrink-0 overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
              <div className="relative space-y-2 pr-8">
                <p className="text-sm text-white/70">
                  Order placed {formatOrderDate(order.createdAt)}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    Order {order.orderNumber}
                  </h2>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </section>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-8">
              {showTrackingTimeline && (
                <OrderTrackingTimeline order={order} />
              )}

              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">
                  Customer
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Detail label="Name" value={order.customer.name} />
                  <Detail
                    label="Phone"
                    value={order.customer.phone}
                  />
                  <Detail
                    label="Email"
                    value={order.customer.email}
                  />
                </div>
              </section>

              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">
                  Delivery
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail
                    label="Address"
                    value={order.deliveryAddress.addressLine}
                  />
                  <Detail
                    label="Area"
                    value={order.deliveryAddress.area}
                  />
                  <Detail
                    label="City"
                    value={order.deliveryAddress.city}
                  />
                  <Detail
                    label="District"
                    value={order.deliveryAddress.district}
                  />
                  <Detail
                    label="Postal code"
                    value={order.deliveryAddress.postalCode ?? "—"}
                  />
                  <Detail
                    label="Delivery zone"
                    value={prettyOrderStatus(order.deliveryZone)}
                  />
                </div>
              </section>

              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-4 font-semibold text-navy">
                  Ordered products
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex flex-wrap items-center gap-3 rounded-xl border p-3 sm:flex-nowrap"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.primaryImage?.url ? (
                          <Image
                            src={item.primaryImage.url}
                            alt={item.primaryImage.alt || item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-[140px] flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-2 text-sm sm:w-auto sm:min-w-[300px]">
                        <Detail
                          label="Unit"
                          value={formatOrderAmount(
                            item.unitPrice,
                            order.currency,
                          )}
                        />
                        <Detail
                          label="Qty"
                          value={String(item.quantity)}
                        />
                        <Detail
                          label="Line total"
                          value={formatOrderAmount(
                            item.lineTotal,
                            order.currency,
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-5 rounded-2xl border bg-white p-5 md:grid-cols-2">
                <div className="space-y-3">
                  <h2 className="font-semibold text-navy">Payment</h2>
                  <Detail
                    label="Method"
                    value={
                      order.paymentMethod === "cod"
                        ? "Cash on delivery"
                        : prettyOrderStatus(order.paymentMethod)
                    }
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Payment status
                    </p>
                    <StatusBadge
                      status={
                        displayPaymentStatus ?? order.paymentStatus
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Order status
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="font-semibold text-navy">Summary</h2>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>
                    <span>
                      {formatOrderAmount(
                        order.subtotal,
                        order.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Delivery fee
                    </span>
                    <span>
                      {formatOrderAmount(
                        order.deliveryFee,
                        order.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t pt-3 font-bold text-navy">
                    <span>Total ({order.currency})</span>
                    <span>
                      {formatOrderAmount(
                        order.totalAmount,
                        order.currency,
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {(order.customerNote || order.cancellationReason) && (
                <section className="grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-2">
                  {order.customerNote && (
                    <Detail
                      label="Customer note"
                      value={order.customerNote}
                    />
                  )}
                  {order.cancellationReason && (
                    <Detail
                      label="Cancellation reason"
                      value={order.cancellationReason}
                    />
                  )}
                </section>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
