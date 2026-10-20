"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Container from "@/components/Container";
import CartItemRow from "@/components/cart/CartItemRow";
import { useCart } from "@/components/cart/CartProvider";

const money = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

export default function CartPageContent() {
  const { items, subtotal, hydrated } = useCart();

  return (
    <section className="py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1180px]">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">Shopping cart</p>
          <h1 className="text-[clamp(32px,4vw,48px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">Your cart</h1>
          {!hydrated ? (
            <div className="mt-8 rounded-2xl border border-line bg-white p-8 text-sm text-ink/60" role="status">Loading your cart…</div>
          ) : items.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,51,78,0.04)]">
              <span className="grid size-[72px] place-items-center rounded-full bg-mist text-blue"><ShoppingBag size={32} aria-hidden="true" /></span>
              <h2 className="mt-5 text-xl font-bold text-navy">Nothing in your cart yet</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">Browse the catalogue and add products for your next project.</p>
              <Link href="/products" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Browse products <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          ) : (
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-2xl border border-line bg-white px-6 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:px-4">
                <div className="flex items-center justify-between border-b border-line py-4 text-sm text-ink/60"><span>{items.length} {items.length === 1 ? "product" : "products"}</span><Link href="/products" className="font-semibold text-blue hover:text-deep">Continue shopping</Link></div>
                {items.map((item) => <CartItemRow key={item.productId} item={item} />)}
              </div>
              <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,51,78,0.06)] lg:sticky lg:top-28">
                <h2 className="text-lg font-extrabold text-navy">Order summary</h2>
                <div className="mt-5 flex items-center justify-between border-b border-line pb-4 text-sm"><span className="text-ink/65">Subtotal</span><span className="font-bold tabular-nums text-navy">{money(subtotal)}</span></div>
                <div className="flex justify-between border-b border-line py-4 text-sm"><span className="text-ink/65">Delivery</span><span className="text-right text-xs leading-5 text-ink/60">Calculated at checkout</span></div>
                <div className="flex items-center justify-between py-4"><span className="text-sm font-bold text-navy">Total</span><span className="text-right text-xs text-ink/60">Confirmed by the server<br />after delivery zone selection</span></div>
                <Link href="/checkout" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Proceed to checkout <ArrowRight size={16} aria-hidden="true" /></Link>
                <p className="mt-3 text-center text-xs leading-5 text-ink/55">Product prices and stock are confirmed when your order is placed.</p>
              </aside>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
