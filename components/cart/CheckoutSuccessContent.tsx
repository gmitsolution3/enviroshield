"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { authClient } from "@/lib/auth-client";
import { getMyOrderById, type CreatedOrderConfirmation } from "@/lib/api/orders";
import { readOrderConfirmation } from "@/lib/order-confirmation";
import { getProductImageUrl } from "@/lib/products/images";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(amount);
const pretty = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " ");

export default function CheckoutSuccessContent() {
  const { data: session, isPending } = authClient.useSession();
  const [order, setOrder] = useState<CreatedOrderConfirmation | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isPending) return;
    let active = true;
    Promise.resolve().then(async () => {
      const savedOrder = readOrderConfirmation();
      if (!savedOrder) {
        if (active) setChecked(true);
        return;
      }
      if (!session?.user) {
        if (active) {
          setOrder(savedOrder);
          setChecked(true);
        }
        return;
      }
      try {
        const verifiedOrder = await getMyOrderById(savedOrder._id);
        if (active) setOrder(verifiedOrder);
      } catch {
        // The successful create response remains available for this session if refresh lookup fails.
        if (active) setOrder(savedOrder);
      } finally {
        if (active) setChecked(true);
      }
    });
    return () => { active = false; };
  }, [isPending, session?.user]);

  if (!checked) {
    return <section className="py-20"><Container><div role="status" className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink/60">Loading your order confirmation…</div></Container></section>;
  }

  if (!order) {
    return (
      <section className="py-16 max-[600px]:py-10">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white px-7 py-12 text-center shadow-[0_12px_36px_rgba(0,51,78,0.06)]">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-mist text-blue"><PackageCheck size={30} aria-hidden="true" /></span>
            <h1 className="mt-5 text-2xl font-extrabold text-navy">No order confirmation found</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/65">This page only displays an order after the order service confirms it. If you just placed an order, check your account orders or contact our team.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/cart" className="inline-flex min-h-12 items-center justify-center rounded-full border border-blue px-5 text-sm font-bold text-blue hover:bg-blue/5">View cart</Link>
              <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white hover:bg-deep">Browse products <ArrowRight size={16} /></Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const currency = order.currency || "BDT";
  const address = order.deliveryAddress;

  return (
    <section className="bg-mist/45 py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[920px]">
          <div className="rounded-2xl border border-line bg-white px-7 py-9 text-center shadow-[0_14px_42px_rgba(0,51,78,0.07)] max-[600px]:px-5">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check size={31} strokeWidth={3} aria-hidden="true" /></span>
            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">Order received</p>
            <h1 className="mt-2 text-[clamp(30px,4vw,42px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">Thank you for your order</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/65">Your order has been sent to Enviroshield. We’ll use the account email on file to send updates.</p>
            <div className="mx-auto mt-6 inline-flex flex-col rounded-xl border border-line bg-mist/60 px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink/55">Order number</span>
              <span className="mt-1 font-mono text-lg font-bold text-navy">{order.orderNumber}</span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs font-bold">
              <span className="rounded-full bg-blue/10 px-3 py-2 text-blue">Order: {pretty(order.status)}</span>
              <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-800">Payment: {pretty(order.paymentStatus)}</span>
              {order.paymentMethod === "cod" && <span className="rounded-full bg-mist px-3 py-2 text-navy">Cash on Delivery</span>}
            </div>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
            <section className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-lg font-extrabold text-navy">Order summary</h2>
              <ul className="mt-3 divide-y divide-line">
                {order.items.map((item, index) => {
                  const image = getProductImageUrl(item.primaryImage?.url ?? "");
                  return <li key={`${item.productId}-${index}`} className="flex items-center gap-4 py-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-mist">{image ? <Image src={image} alt={item.primaryImage?.alt || item.name} fill sizes="64px" className="object-cover" /> : <span className="grid h-full place-items-center text-[10px] text-ink/50">No image</span>}</div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-bold text-navy">{item.name}</p><p className="mt-1 text-xs text-ink/55">Qty {item.quantity}{item.sku ? ` · SKU ${item.sku}` : ""}</p></div>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-navy">{money(item.lineTotal, currency)}</span>
                  </li>;
                })}
              </ul>
              <div className="space-y-3 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-4"><span className="text-ink/65">Subtotal</span><span className="font-semibold tabular-nums text-navy">{money(order.subtotal, currency)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-ink/65">Delivery · {pretty(order.deliveryZone)}</span><span className="font-semibold tabular-nums text-navy">{money(order.deliveryFee, currency)}</span></div>
                <div className="flex justify-between gap-4 border-t border-line pt-3 text-base"><span className="font-bold text-navy">Total</span><span className="font-extrabold tabular-nums text-navy">{money(order.totalAmount, currency)}</span></div>
              </div>
            </section>

            <aside className="rounded-2xl border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-navy"><MapPin size={17} className="text-blue" aria-hidden="true" /> Delivery details</h2>
              {address ? <address className="mt-4 not-italic text-sm leading-6 text-ink/70">{address.addressLine}<br />{address.area}, {address.city}<br />{address.district}{address.postalCode ? ` ${address.postalCode}` : ""}</address> : <p className="mt-4 text-sm leading-6 text-ink/65">Delivery address is available in your account order details.</p>}
              <p className="mt-5 border-t border-line pt-4 text-xs leading-5 text-ink/60">Payment is due in cash when the order is delivered. Payment status: {pretty(order.paymentStatus)}.</p>
            </aside>
          </div>

          <div className="mt-7 text-center"><Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Continue shopping <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </Container>
    </section>
  );
}
