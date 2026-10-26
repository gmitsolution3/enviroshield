"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="relative mt-8 overflow-hidden rounded-3xl border border-line bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(0,51,78,0.05)] sm:px-12 sm:py-20">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-mist/80 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-blue/5 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        {/* Shopping bag icon */}
        <div
          className="relative flex size-24 items-center justify-center rounded-full border border-blue/10 bg-mist shadow-sm"
          aria-hidden="true"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,51,78,0.08)]">
            <ShoppingBag
              size={30}
              strokeWidth={1.6}
              className="text-blue"
            />
          </div>

          <span className="absolute right-1 top-2 size-3 rounded-full border-2 border-white bg-blue/50" />
        </div>

        {/* Message */}
        <span className="mt-7 rounded-full border border-line bg-mist/60 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue">
          Nothing here yet
        </span>

        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          Your cart is taking a break
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-7 text-ink/65 sm:text-base">
          Looks like you haven&apos;t added anything yet. Explore our
          products and find the right solutions for your next project.
        </p>

        {/* Browse products button */}
        <Link
          href="/products"
          className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-blue px-7 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(0,51,78,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-deep hover:shadow-[0_10px_24px_rgba(0,51,78,0.22)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          Browse products
          <ArrowRight
            size={17}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        {/* Reassurance */}
        <p className="mt-5 text-xs font-medium text-ink/50">
          Discover quality solutions for your needs.
        </p>
      </div>
    </div>
  );
}
