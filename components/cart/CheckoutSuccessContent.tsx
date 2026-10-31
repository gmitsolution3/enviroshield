"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import CheckoutSuccessLoading from "@/components/cart/CheckoutSuccessLoading";
import Container from "@/components/Container";
import {
  getMyOrderById,
  type CreatedOrderConfirmation,
} from "@/lib/api/orders";
import { getProductImageUrl } from "@/lib/products/images";
import {
  formatCurrency,
  formatDateTime,
  formatStatus,
} from "@/lib/utils";

const money = formatCurrency;

const pretty = (value: string) =>
  formatStatus(value, "Not available");

type OrderStatusPresentation = {
  label: string;
  heading: string;
  highlight: string;
  message: string;
  cardTitle: string;
  cardMessage: string;
  Icon: LucideIcon;
  badgeClass: string;
  iconFrameClass: string;
  iconClass: string;
  textClass: string;
};

const orderStatusPresentations: Record<
  string,
  OrderStatusPresentation
> = {
  pending: {
    label: "Order Placed",
    heading: "Order Placed",
    highlight: "Successfully Received",
    message:
      "We have received your order. Our team is preparing your items and will share updates as your order progresses.",
    cardTitle: "Order Received",
    cardMessage:
      "We will notify you as soon as your order moves to preparation.",
    Icon: CheckCircle2,
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconFrameClass:
      "border-emerald-200 bg-emerald-50 shadow-[0_0_0_12px_rgba(16,185,129,0.06)]",
    iconClass: "bg-emerald-100 text-emerald-700",
    textClass: "text-emerald-900",
  },
  confirmed: {
    label: "Order Confirmed",
    heading: "Your Order is",
    highlight: "Confirmed",
    message:
      "Your order has been confirmed by Enviroshield. We will share updates as it moves toward delivery.",
    cardTitle: "Order Confirmed",
    cardMessage: "Your order is moving to preparation.",
    Icon: CheckCircle2,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass:
      "border-blue/20 bg-blue/5 shadow-[0_0_0_12px_rgba(1,110,220,0.06)]",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  processing: {
    label: "Order Processing",
    heading: "We Are Preparing",
    highlight: "Your Order",
    message:
      "Your order is being prepared. We will share another update when it is on the way.",
    cardTitle: "Being Prepared",
    cardMessage: "Your order is being prepared for delivery.",
    Icon: PackageCheck,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass:
      "border-blue/20 bg-blue/5 shadow-[0_0_0_12px_rgba(1,110,220,0.06)]",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  shipped: {
    label: "Order Shipped",
    heading: "Your Order is",
    highlight: "On The Way",
    message:
      "Your order has been shipped. Our team will keep you updated about delivery.",
    cardTitle: "On The Way",
    cardMessage: "Your order has been shipped for delivery.",
    Icon: Truck,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass:
      "border-blue/20 bg-blue/5 shadow-[0_0_0_12px_rgba(1,110,220,0.06)]",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  delivered: {
    label: "Order Delivered",
    heading: "Your Order Has Been",
    highlight: "Delivered",
    message:
      "This order is marked as delivered. You can review its items and payment details below.",
    cardTitle: "Delivered",
    cardMessage: "This order is marked as delivered.",
    Icon: CheckCircle2,
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconFrameClass:
      "border-emerald-200 bg-emerald-50 shadow-[0_0_0_12px_rgba(16,185,129,0.06)]",
    iconClass: "bg-emerald-100 text-emerald-700",
    textClass: "text-emerald-900",
  },
  cancelled: {
    label: "Order Cancelled",
    heading: "Order Cancelled",
    highlight: "",
    message:
      "This order has been cancelled. Its payment status below reflects the current payment record.",
    cardTitle: "Order Cancelled",
    cardMessage:
      "This order is cancelled. See the current payment status below.",
    Icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-800",
    iconFrameClass:
      "border-red-200 bg-red-50 shadow-[0_0_0_12px_rgba(239,68,68,0.06)]",
    iconClass: "bg-red-100 text-red-700",
    textClass: "text-red-900",
  },
};

export default function CheckoutSuccessContent({
  orderId,
}: {
  orderId: string;
}) {
  const [orderLookup, setOrderLookup] = useState<{
    orderId: string;
    order?: CreatedOrderConfirmation;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const checked = !orderId.trim() || orderLookup?.orderId === orderId;
  const order =
    orderLookup?.orderId === orderId
      ? (orderLookup.order ?? null)
      : null;
  const loadError = !orderId.trim()
    ? "The order ID is missing from this confirmation link."
    : orderLookup?.orderId === orderId
      ? (orderLookup.error ?? "")
      : "";

  useEffect(() => {
    let active = true;

    if (!orderId.trim()) {
      return () => {
        active = false;
      };
    }

    getMyOrderById(orderId)
      .then((retrievedOrder) => {
        if (active) {
          setOrderLookup({ orderId, order: retrievedOrder });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        setOrderLookup({
          orderId,
          error:
            error instanceof Error
              ? error.message
              : "We could not retrieve this order. Please try again.",
        });
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const copyOrderNumber = async () => {
    if (!order?.orderNumber || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!checked) {
    return <CheckoutSuccessLoading />;
  }

  if (!order) {
    return (
      <section className="bg-mist/45 py-16 max-[600px]:py-10">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-[0_18px_55px_rgba(0,51,78,0.07)] sm:px-10">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue/10 text-blue">
              <PackageCheck size={30} aria-hidden="true" />
            </span>

            <h1 className="mt-5 text-2xl font-extrabold text-navy">
              Order details unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/65">
              {loadError || "We could not retrieve this order."} If
              you just placed an order, check your confirmation link
              or sign in to view your order history.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/cart"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-bold text-navy transition hover:border-blue hover:text-blue"
              >
                View cart
              </Link>

              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition hover:bg-deep"
              >
                Browse products
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const currency = order.currency || "BDT";
  const address = order.deliveryAddress;
  const customer = order.customer;

  const placedDate = order.createdAt
    ? new Date(order.createdAt)
    : null;

  const formattedDate = placedDate
    ? formatDateTime(placedDate, undefined, "") || null
    : null;

  const statusPresentation =
    orderStatusPresentations[order.status] ??
    ({
      label: `Order ${pretty(order.status)}`,
      heading: "Order status",
      highlight: pretty(order.status),
      message: `The current status of this order is ${pretty(order.status)}.`,
      cardTitle: pretty(order.status),
      cardMessage: `The current order status is ${pretty(order.status)}.`,
      Icon: PackageCheck,
      badgeClass: "border-blue/20 bg-blue/5 text-blue",
      iconFrameClass: "border-blue/20 bg-blue/5",
      iconClass: "bg-blue/10 text-blue",
      textClass: "text-blue",
    } satisfies OrderStatusPresentation);
  const isCancelled = order.status === "cancelled";
  const StatusIcon = statusPresentation.Icon;

  return (
    <section className="min-h-[80vh] bg-mist/35 py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1080px]">
          {/* Top Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/dashboard/my-orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-deep"
            >
              <ArrowRight
                size={16}
                className="rotate-180"
                aria-hidden="true"
              />
              View All My Orders
            </Link>
          </div>

          {/* Order status hero banner */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_36px_rgba(0,51,78,0.06)]">
            <div className="grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${statusPresentation.badgeClass}`}
                >
                  <StatusIcon size={14} aria-hidden="true" />
                  {statusPresentation.label}
                </div>

                <h1 className="mt-5 text-[clamp(32px,4.5vw,50px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">
                  {statusPresentation.heading}
                  {statusPresentation.highlight && (
                    <span
                      className={`block ${
                        isCancelled ? "text-red-700" : "text-blue"
                      }`}
                    >
                      {statusPresentation.highlight}
                    </span>
                  )}
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {statusPresentation.message}
                </p>

                {/* Actions */}
                <div className="mt-7 flex flex-wrap gap-3">
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={copyOrderNumber}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(1,110,220,0.22)] transition hover:-translate-y-0.5 hover:bg-deep focus-visible:outline-blue"
                    >
                      {copied ? (
                        <Check size={17} aria-hidden="true" />
                      ) : (
                        <Copy size={16} aria-hidden="true" />
                      )}
                      {copied
                        ? "Order number copied!"
                        : "Copy order number"}
                    </button>
                  )}

                  <Link
                    href="/dashboard/my-orders"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-bold text-navy transition hover:border-blue hover:text-blue"
                  >
                    View in Dashboard
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>

                  <Link
                    href="/products"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-transparent px-5 text-sm font-bold text-ink/70 transition hover:text-navy"
                  >
                    Browse other products
                  </Link>
                </div>
              </div>

              {/* Status Graphic Frame */}
              <div className="flex flex-col items-center py-2">
                <div
                  className={`relative grid size-36 place-items-center rounded-full border sm:size-40 ${statusPresentation.iconFrameClass}`}
                >
                  <div
                    className={`grid size-24 place-items-center rounded-full sm:size-28 ${statusPresentation.iconClass}`}
                  >
                    <StatusIcon
                      size={54}
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="mt-5 w-full max-w-[320px] rounded-2xl border border-line bg-white p-4 text-center shadow-sm">
                  <p
                    className={`text-base font-extrabold ${statusPresentation.textClass}`}
                  >
                    {statusPresentation.cardTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink/65">
                    {statusPresentation.cardMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order information and summary */}
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              {/* Order information */}
              <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <FileText size={21} aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-lg font-extrabold text-navy">
                      Order information
                    </h2>
                    <p className="mt-0.5 text-xs text-ink/55">
                      Keep this reference for your records
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">
                      Order number
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <p className="min-w-0 break-all font-mono text-base font-extrabold text-navy sm:text-lg">
                        {order.orderNumber}
                      </p>

                      <button
                        type="button"
                        onClick={copyOrderNumber}
                        aria-label="Copy order number"
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink/70 transition hover:border-blue hover:text-blue"
                      >
                        {copied ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Copy size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div
                      className={`flex items-center gap-3 rounded-2xl p-3.5 ${statusPresentation.iconFrameClass}`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${statusPresentation.iconClass}`}
                      >
                        <StatusIcon size={19} aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold ${statusPresentation.textClass}`}
                        >
                          {pretty(order.status)}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/60">
                          Order status
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-blue/5 p-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue">
                        <CreditCard size={19} aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-navy">
                          {pretty(order.paymentMethod)}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/60">
                          Payment method
                        </p>
                        <p className="mt-1 text-xs font-semibold text-ink/70">
                          Payment status:{" "}
                          {pretty(order.paymentStatus)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {formattedDate && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                    <span className="text-ink/60">Order date</span>
                    <time
                      dateTime={order.createdAt}
                      className="font-semibold text-navy"
                    >
                      {formattedDate}
                    </time>
                  </div>
                )}
              </section>

              {/* Customer and delivery information */}
              <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <MapPin size={21} aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-lg font-extrabold text-navy">
                      Delivery information
                    </h2>
                    <p className="mt-0.5 text-xs text-ink/55">
                      {isCancelled
                        ? "Customer and delivery details for this order"
                        : "Where your order is headed"}
                    </p>
                  </div>
                </div>

                {customer && (
                  <div className="mt-4 rounded-2xl bg-[#fbfcfe] p-4 text-sm leading-6 text-ink/75">
                    <p className="font-bold text-navy">
                      {customer.name}
                    </p>

                    <p>{customer.phone}</p>

                    {customer.email && (
                      <p className="break-all">{customer.email}</p>
                    )}
                  </div>
                )}

                {address ? (
                  <address className="mt-4 not-italic text-sm leading-6 text-ink/75">
                    <span className="font-bold text-navy">
                      {address.addressLine}
                    </span>
                    <br />
                    {address.area}, {address.city}
                    <br />
                    {address.district}
                    {address.postalCode
                      ? ` ${address.postalCode}`
                      : ""}
                  </address>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-ink/65">
                    Your delivery address is available in your account
                    order details.
                  </p>
                )}

                <div
                  className={`mt-5 flex items-start gap-3 rounded-2xl p-4 ${isCancelled ? "bg-red-50" : "bg-mist/70"}`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm ${isCancelled ? "text-red-700" : "text-blue"}`}
                  >
                    {isCancelled ? (
                      <XCircle size={21} aria-hidden="true" />
                    ) : (
                      <Truck size={21} aria-hidden="true" />
                    )}
                  </span>

                  <div>
                    <p className="text-sm font-bold text-navy">
                      {isCancelled
                        ? "Cancellation information"
                        : "Delivery updates"}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink/65">
                      {isCancelled
                        ? "This order has been cancelled. The payment status above shows its current state."
                        : "Our team will follow up with you to coordinate your delivery schedule."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Order summary */}
            <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <ShoppingBag size={21} aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-lg font-extrabold text-navy">
                      Order summary
                    </h2>
                    <p className="mt-0.5 text-xs text-ink/55">
                      A quick look at this order
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-navy">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <ul className="divide-y divide-line">
                {order.items.map((item, index) => {
                  const image = getProductImageUrl(
                    item.primaryImage?.url ?? "",
                  );

                  return (
                    <li
                      key={`${item.productId}-${index}`}
                      className="flex items-center gap-3 py-4 sm:gap-4"
                    >
                      <div className="relative size-[68px] shrink-0 overflow-hidden rounded-2xl border border-line bg-mist/60">
                        {image ? (
                          <Image
                            src={image}
                            alt={item.primaryImage?.alt || item.name}
                            fill
                            sizes="68px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-[10px] text-ink/50">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-5 text-navy">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-ink/55">
                          {money(item.unitPrice, currency)} ×{" "}
                          {item.quantity}
                          {item.sku ? ` · SKU ${item.sku}` : ""}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-extrabold tabular-nums text-navy">
                        {money(item.lineTotal, currency)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3 border-t border-line pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-ink/65">Subtotal</span>
                  <span className="font-semibold tabular-nums text-navy">
                    {money(order.subtotal, currency)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-ink/65">
                    Delivery · {pretty(order.deliveryZone)}
                  </span>
                  <span className="font-semibold tabular-nums text-navy">
                    {money(order.deliveryFee, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl bg-blue/5 px-4 py-4">
                  <span className="font-extrabold text-navy">
                    Total amount
                  </span>
                  <span className="text-xl font-extrabold tabular-nums text-blue">
                    {money(order.totalAmount, currency)}
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-1 text-xs leading-5 text-ink/55">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-blue"
                    aria-hidden="true"
                  />
                  <p>
                    Your order details are shown here for reference.
                    Payment status: {pretty(order.paymentStatus)}.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Reassurance cards */}
          {!isCancelled && (
            <div className="mt-6 grid gap-3 rounded-3xl border border-blue/10 bg-gradient-to-r from-blue/[0.07] via-white to-mist/80 p-5 sm:grid-cols-3 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm">
                  <ShieldCheck size={20} aria-hidden="true" />
                </span>

                <div>
                  <p className="text-sm font-bold text-navy">
                    Quality products
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    Solutions you can rely on
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm">
                  <PackageCheck size={20} aria-hidden="true" />
                </span>

                <div>
                  <p className="text-sm font-bold text-navy">
                    Helpful support
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    We&apos;re here when you need us
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm">
                  <Truck size={20} aria-hidden="true" />
                </span>

                <div>
                  <p className="text-sm font-bold text-navy">
                    Delivery updates
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    We&apos;ll keep you informed
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
