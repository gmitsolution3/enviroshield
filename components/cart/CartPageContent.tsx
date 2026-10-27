"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import Container from "@/components/Container";
import CartItemRow from "@/components/cart/CartItemRow";
import { useCart } from "@/components/cart/CartProvider";
import { getProductImageUrl } from "@/lib/products/images";

import CartLoader from "@/components/cart/CartLoader";

const money = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

export default function CartPageContent() {
  const { items, subtotal, hydrated } = useCart();

  return (
    <section className="py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1180px]">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
            Shopping cart
          </p>

          <h1 className="text-[clamp(32px,4vw,48px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">
            Your cart
          </h1>

          {!hydrated ? (
            <CartLoader />
          ) : items.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-line bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(0,51,78,0.04)]">
              <span className="grid size-[72px] place-items-center rounded-full bg-mist text-blue">
                <ShoppingBag size={32} aria-hidden="true" />
              </span>

              <h2 className="mt-5 text-xl font-bold text-navy">
                Nothing in your cart yet
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">
                Browse the catalogue and add products for your next
                project.
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                Browse products
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
              {/* Cart items */}
              <div className="rounded-3xl border border-line bg-white px-6 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:px-4">
                <div className="flex items-center justify-between gap-4 border-b border-line py-4 text-sm">
                  <span className="text-ink/60">
                    {items.length}{" "}
                    {items.length === 1 ? "product" : "products"}
                  </span>

                  <Link
                    href="/products"
                    className="font-semibold text-blue transition-colors hover:text-deep"
                  >
                    Continue shopping
                  </Link>
                </div>

                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                  />
                ))}
              </div>

              {/* Upgraded order summary */}
              <aside className="rounded-3xl border border-line bg-white p-5 shadow-[0_8px_28px_rgba(0,51,78,0.06)] sm:p-7 lg:sticky lg:top-28">
                {/* Summary header */}
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue/10 text-blue">
                      <ShoppingBag
                        size={21}
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h2 className="text-lg font-extrabold text-navy">
                        Order summary
                      </h2>

                      <p className="mt-0.5 text-xs text-ink/55">
                        A quick look at your purchase
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-mist px-3 py-1.5 text-xs font-bold text-navy">
                    {items.length}{" "}
                    {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Products */}
                <ul className="divide-y divide-line">
                  {items.map((item) => {
                    const image = getProductImageUrl(item.image);

                    return (
                      <li
                        key={item.productId}
                        className="flex items-center gap-3 py-4 sm:gap-4"
                      >
                        <div className="relative size-[68px] shrink-0 overflow-hidden rounded-2xl border border-line bg-mist/60">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.name}
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
                            {money(item.price)} × {item.quantity}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-extrabold tabular-nums text-navy">
                          {money(item.price * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Price breakdown */}
                <div className="space-y-3 border-t border-line pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink/65">
                      Estimated subtotal
                    </span>

                    <span className="font-semibold tabular-nums text-navy">
                      {money(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-ink/65">
                      Delivery
                    </span>

                    <span className="max-w-[165px] text-right text-xs leading-5 text-ink/60">
                      Calculated at checkout based on your delivery
                      location
                    </span>
                  </div>

                  {/* Final total */}
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-blue/5 px-4 py-4">
                    <span className="font-extrabold text-navy">
                      Final total
                    </span>

                    <span className="max-w-[170px] text-right text-xs leading-5 text-ink/60">
                      Confirmed with server-verified prices and
                      delivery
                    </span>
                  </div>

                  {/* Trust message */}
                  <div className="flex items-start gap-2 pt-1 text-xs leading-5 text-ink/55">
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-blue"
                      aria-hidden="true"
                    />

                    <p>
                      Cart prices are estimates. Stock, item prices,
                      and delivery charges are verified when you
                      place your order.
                    </p>
                  </div>
                </div>

                {/* Checkout action */}
                <Link
                  href="/checkout"
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  Proceed to checkout
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </aside>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}