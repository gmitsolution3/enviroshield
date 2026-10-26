"use client";

import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { getMyOrderById, type CreatedOrderConfirmation } from "@/lib/api/orders";
import { getProductImageUrl } from "@/lib/products/images";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(amount);
const pretty = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ");

export default function CheckoutSuccessContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<CreatedOrderConfirmation | null>(null);
  const [checked, setChecked] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setOrder(null);
    setChecked(false);
    setLoadError("");

    if (!orderId.trim()) {
      setLoadError("The order ID is missing from this confirmation link.");
      setChecked(true);
      return () => { active = false; };
    }

    getMyOrderById(orderId)
      .then((retrievedOrder) => {
        if (active) setOrder(retrievedOrder);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "We could not retrieve this order. Please try again.",
        );
      })
      .finally(() => {
        if (active) setChecked(true);
      });

    return () => { active = false; };
  }, [orderId]);

  async function copyOrderNumber() {
    if (!order?.orderNumber || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (!checked) {
    return (
      <section className="bg-mist/45 py-20">
        <Container>
          <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 text-center text-sm text-ink/60 shadow-sm">
            Loading your order confirmation…
          </div>
        </Container>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="bg-mist/45 py-16 max-[600px]:py-10">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white px-7 py-12 text-center shadow-[0_18px_55px_rgba(0,51,78,0.07)]">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue/10 text-blue"><PackageCheck size={30} aria-hidden="true" /></span>
            <h1 className="mt-5 text-2xl font-extrabold text-navy">Order details unavailable</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/65">
              {loadError || "We could not retrieve this order."} If you just placed an order, verify the confirmation link or check your account orders.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/cart" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-5 text-sm font-bold text-navy transition hover:border-blue hover:text-blue">View cart</Link>
              <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition hover:bg-deep">Browse products <ArrowRight size={16} /></Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const currency = order.currency || "BDT";
  const address = order.deliveryAddress;

  return (
    <section className="overflow-hidden bg-[#f7f9fc] py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-[1120px]">
          <div className="relative isolate overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_18px_60px_rgba(0,51,78,0.08)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-r from-blue/5 via-mist to-blue/10" />
            <div className="grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:px-12">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-800">
                  <CheckCircle2 size={14} aria-hidden="true" /> Order placed successfully
                </div>
                <h1 className="mt-5 text-[clamp(34px,5vw,54px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                  Thank you
                  <span className="block text-blue">for your order!</span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/70 sm:text-base lg:mx-0">
                  Your order has been received by Enviroshield. We’re getting everything ready and will use the account email on file to share updates.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <button type="button" onClick={copyOrderNumber} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(1,110,220,0.2)] transition hover:-translate-y-0.5 hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
                    {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {copied ? "Order number copied" : "Copy order number"}
                  </button>
                  <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-bold text-navy transition hover:border-blue hover:text-blue">
                    Continue shopping <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto flex w-full max-w-[360px] flex-col items-center py-2">
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-[62%] rounded-full bg-blue/[0.04] sm:size-64" />
                <div className="relative grid size-36 place-items-center rounded-full border border-emerald-200 bg-emerald-50 shadow-[0_0_0_12px_rgba(16,185,129,0.05)] sm:size-40">
                  <div className="grid size-24 place-items-center rounded-full bg-emerald-100 text-emerald-700 sm:size-28">
                    <Check size={58} strokeWidth={2.8} aria-hidden="true" />
                  </div>
                </div>
                <div className="relative mt-5 w-full rounded-2xl border border-line bg-white px-5 py-5 text-center shadow-[0_12px_32px_rgba(0,51,78,0.08)]">
                  <p className="text-lg font-extrabold text-navy">Order confirmed</p>
                  <p className="mt-1.5 text-sm leading-6 text-ink/65">Thank you for choosing Enviroshield. We appreciate your trust in us.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue"><FileText size={21} aria-hidden="true" /></span>
                  <div><h2 className="text-lg font-extrabold text-navy">Order information</h2><p className="mt-0.5 text-xs text-ink/55">Keep this reference for your records</p></div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">Order number</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="min-w-0 break-all font-mono text-base font-extrabold text-navy sm:text-lg">{order.orderNumber}</p>
                      <button type="button" onClick={copyOrderNumber} aria-label="Copy order number" className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink/70 transition hover:border-blue hover:text-blue">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={19} /></span>
                      <div className="min-w-0"><p className="text-sm font-bold text-emerald-900">{pretty(order.status)}</p><p className="mt-0.5 text-xs text-emerald-800/70">Order status</p></div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-blue/5 p-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue/10 text-blue"><CreditCard size={19} /></span>
                      <div className="min-w-0"><p className="text-sm font-bold text-navy">{pretty(order.paymentMethod)}</p><p className="mt-0.5 text-xs text-ink/60">Payment · {pretty(order.paymentStatus)}</p></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue"><MapPin size={21} aria-hidden="true" /></span>
                  <div><h2 className="text-lg font-extrabold text-navy">Delivery information</h2><p className="mt-0.5 text-xs text-ink/55">Where your order is headed</p></div>
                </div>
                {order.customer && (
                  <div className="mt-4 rounded-2xl bg-[#fbfcfe] p-4 text-sm leading-6 text-ink/75">
                    <p className="font-bold text-navy">{order.customer.name}</p>
                    <p>{order.customer.phone}</p>
                    {order.customer.email && <p className="break-all">{order.customer.email}</p>}
                  </div>
                )}
                {address ? (
                  <address className="mt-3 not-italic text-sm leading-6 text-ink/75">
                    <span className="font-bold text-navy">{address.addressLine}</span><br />
                    {address.area}, {address.city}<br />
                    {address.district}{address.postalCode ? ` ${address.postalCode}` : ""}
                  </address>
                ) : <p className="mt-4 text-sm leading-6 text-ink/65">Your delivery address is available in your account order details.</p>}
                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-mist/70 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm"><Truck size={21} aria-hidden="true" /></span>
                  <div><p className="text-sm font-bold text-navy">Delivery updates</p><p className="mt-1 text-xs leading-5 text-ink/65">Our team will follow up with you to coordinate the delivery schedule.</p></div>
                </div>
              </section>
            </div>

            <section className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.04)] sm:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue"><ShoppingBag size={21} aria-hidden="true" /></span>
                  <div><h2 className="text-lg font-extrabold text-navy">Order summary</h2><p className="mt-0.5 text-xs text-ink/55">A quick look at your purchase</p></div>
                </div>
                <span className="shrink-0 rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-navy">{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
              </div>
              <ul className="divide-y divide-line">
                {order.items.map((item, index) => {
                  const image = getProductImageUrl(item.primaryImage?.url ?? "");
                  return (
                    <li key={`${item.productId}-${index}`} className="flex items-center gap-3 py-4 sm:gap-4">
                      <div className="relative size-[68px] shrink-0 overflow-hidden rounded-2xl border border-line bg-mist/60">
                        {image ? <Image src={image} alt={item.primaryImage?.alt || item.name} fill sizes="68px" className="object-cover" /> : <span className="grid h-full place-items-center text-[10px] text-ink/50">No image</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold leading-5 text-navy">{item.name}</p>
                        <p className="mt-1 text-xs text-ink/55">Qty {item.quantity}{item.sku ? ` · SKU ${item.sku}` : ""}</p>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold tabular-nums text-navy">{money(item.lineTotal, currency)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-3 border-t border-line pt-5 text-sm">
                <div className="flex justify-between gap-4"><span className="text-ink/65">Subtotal</span><span className="font-semibold tabular-nums text-navy">{money(order.subtotal, currency)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-ink/65">Delivery · {pretty(order.deliveryZone)}</span><span className="font-semibold tabular-nums text-navy">{money(order.deliveryFee, currency)}</span></div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-blue/5 px-4 py-4">
                  <span className="font-extrabold text-navy">Total amount</span>
                  <span className="text-xl font-extrabold tabular-nums text-blue">{money(order.totalAmount, currency)}</span>
                </div>
                <p className="flex items-start gap-2 pt-1 text-xs leading-5 text-ink/55"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" /> Your order details are shown here for reference. Payment status: {pretty(order.paymentStatus)}.</p>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-3 rounded-3xl border border-blue/10 bg-gradient-to-r from-blue/[0.07] via-white to-mist/80 p-5 sm:grid-cols-3 sm:p-6">
            <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm"><ShieldCheck size={20} /></span><div><p className="text-sm font-bold text-navy">Quality products</p><p className="mt-0.5 text-xs text-ink/60">Solutions you can rely on</p></div></div>
            <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm"><PackageCheck size={20} /></span><div><p className="text-sm font-bold text-navy">Helpful support</p><p className="mt-0.5 text-xs text-ink/60">We’re here when you need us</p></div></div>
            <div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-blue shadow-sm"><Truck size={20} /></span><div><p className="text-sm font-bold text-navy">Delivery updates</p><p className="mt-0.5 text-xs text-ink/60">We’ll keep you informed</p></div></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
