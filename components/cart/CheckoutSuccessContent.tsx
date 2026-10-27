"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
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
import type { LucideIcon } from "lucide-react";
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

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
  }).format(amount);

const pretty = (value: string) =>
  value
    ? value.charAt(0).toUpperCase() +
      value.slice(1).replaceAll("_", " ")
    : "Not available";

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

const orderStatusPresentations: Record<string, OrderStatusPresentation> = {
  pending: {
    label: "Order pending",
    heading: "Order received",
    highlight: "awaiting confirmation",
    message:
      "We have received your order. It is pending confirmation, and we will share an update when its status changes.",
    cardTitle: "Awaiting confirmation",
    cardMessage: "We will update you when your order is confirmed.",
    Icon: Clock3,
    badgeClass: "border-amber-200 bg-amber-50 text-amber-800",
    iconFrameClass: "border-amber-200 bg-amber-50",
    iconClass: "bg-amber-100 text-amber-700",
    textClass: "text-amber-900",
  },
  confirmed: {
    label: "Order confirmed",
    heading: "Your order is",
    highlight: "confirmed",
    message:
      "Your order has been confirmed by Enviroshield. We will share updates as it moves toward delivery.",
    cardTitle: "Order confirmed",
    cardMessage: "Your order is moving to preparation.",
    Icon: CheckCircle2,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass: "border-blue/20 bg-blue/5",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  processing: {
    label: "Order processing",
    heading: "We are preparing",
    highlight: "your order",
    message:
      "Your order is being prepared. We will share another update when it is on the way.",
    cardTitle: "Being prepared",
    cardMessage: "Your order is being prepared for delivery.",
    Icon: PackageCheck,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass: "border-blue/20 bg-blue/5",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  shipped: {
    label: "Order shipped",
    heading: "Your order is",
    highlight: "on the way",
    message:
      "Your order has been shipped. Our team will keep you updated about delivery.",
    cardTitle: "On the way",
    cardMessage: "Your order has been shipped for delivery.",
    Icon: Truck,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass: "border-blue/20 bg-blue/5",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  delivered: {
    label: "Order delivered",
    heading: "Your order has been",
    highlight: "delivered",
    message:
      "This order is marked as delivered. You can review its items and payment details below.",
    cardTitle: "Delivered",
    cardMessage: "This order is marked as delivered.",
    Icon: CheckCircle2,
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconFrameClass: "border-emerald-200 bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-700",
    textClass: "text-emerald-900",
  },
  cancelled: {
    label: "Order cancelled",
    heading: "Order Cancelled",
    highlight: "",
    message:
      "This order has been cancelled. Its payment status below reflects the current payment record.",
    cardTitle: "Order cancelled",
    cardMessage: "This order is cancelled. See the current payment status below.",
    Icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-800",
    iconFrameClass: "border-red-200 bg-red-50",
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
  const order = orderLookup?.orderId === orderId
    ? orderLookup.order ?? null
    : null;
  const loadError = !orderId.trim()
    ? "The order ID is missing from this confirmation link."
    : orderLookup?.orderId === orderId
      ? orderLookup.error ?? ""
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

  const formattedDate =
    placedDate && !Number.isNaN(placedDate.getTime())
      ? new Intl.DateTimeFormat("en-BD", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Dhaka",
        }).format(placedDate)
      : null;

  const statusPresentation =
    orderStatusPresentations[order.status] ?? {
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
    } satisfies OrderStatusPresentation;
  const isCancelled = order.status === "cancelled";
  const StatusIcon = statusPresentation.Icon;

  return (
    <section className="overflow-hidden bg-[#f7f9fc] py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-[1120px]">
          {/* Order status hero */}
          <div className={`relative isolate overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_60px_rgba(0,51,78,0.08)] ${isCancelled ? "border-red-200" : "border-line"}`}>
            {!isCancelled && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-r from-blue/5 via-mist to-blue/10"
              />
            )}
            <div className="grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:px-12">
              <div className="text-center lg:text-left">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] ${statusPresentation.badgeClass}`}>
                  <StatusIcon size={14} aria-hidden="true" />
                  {statusPresentation.label}
                </div>

                <h1 className="mt-5 text-[clamp(34px,5vw,54px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                  {statusPresentation.heading}
                  {statusPresentation.highlight && (
                    <span className={`block ${isCancelled ? "text-red-700" : "text-blue"}`}>
                      {statusPresentation.highlight}
                    </span>
                  )}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/70 sm:text-base lg:mx-0">
                  {statusPresentation.message}
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  {isCancelled ? (
                    <Link
                      href="/dashboard/my-orders"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(1,110,220,0.2)] transition hover:-translate-y-0.5 hover:bg-deep"
                    >
                      View My Orders
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={copyOrderNumber}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(1,110,220,0.2)] transition hover:-translate-y-0.5 hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    >
                      {copied ? (
                        <Check size={17} aria-hidden="true" />
                      ) : (
                        <Copy size={16} aria-hidden="true" />
                      )}
                      {copied
                        ? "Order number copied"
                        : "Copy order number"}
                    </button>
                  )}

                  <Link
                    href="/products"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-bold text-navy transition hover:border-blue hover:text-blue"
                  >
                    Continue shopping
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto flex w-full max-w-[360px] flex-col items-center py-2">
                {!isCancelled && (
                  <div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-[62%] rounded-full bg-blue/[0.04] sm:size-64"
                  />
                )}

                <div className={`relative grid size-36 place-items-center rounded-full border sm:size-40 ${statusPresentation.iconFrameClass} ${isCancelled ? "" : "shadow-[0_0_0_12px_rgba(16,185,129,0.05)]"}`}>
                  <div className={`grid size-24 place-items-center rounded-full sm:size-28 ${statusPresentation.iconClass}`}>
                    <StatusIcon
                      size={58}
                      strokeWidth={isCancelled ? 2 : 2.8}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="relative mt-5 w-full rounded-2xl border border-line bg-white px-5 py-5 text-center shadow-[0_12px_32px_rgba(0,51,78,0.08)]">
                  <p className={`text-lg font-extrabold ${statusPresentation.textClass}`}>
                    {statusPresentation.cardTitle}
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-ink/65">
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
                    <div className={`flex items-center gap-3 rounded-2xl p-3.5 ${statusPresentation.iconFrameClass}`}>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${statusPresentation.iconClass}`}>
                        <StatusIcon size={19} aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <p className={`text-sm font-bold ${statusPresentation.textClass}`}>
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
                          Payment status: {pretty(order.paymentStatus)}
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

                <div className={`mt-5 flex items-start gap-3 rounded-2xl p-4 ${isCancelled ? "bg-red-50" : "bg-mist/70"}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm ${isCancelled ? "text-red-700" : "text-blue"}`}>
                    {isCancelled ? (
                      <XCircle size={21} aria-hidden="true" />
                    ) : (
                      <Truck size={21} aria-hidden="true" />
                    )}
                  </span>

                  <div>
                    <p className="text-sm font-bold text-navy">
                      {isCancelled ? "Cancellation information" : "Delivery updates"}
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
