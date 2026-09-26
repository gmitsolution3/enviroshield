"use client";

import {
  ArrowLeft,
  CircleAlert,
  Home,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import Logo from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-5 py-12"
      aria-labelledby="error-title"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[820px]">
        {/* Main card */}
        <section
          className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          aria-labelledby="error-title"
        >
          {/* Card accent */}
          <div className="h-1.5 bg-blue" aria-hidden="true" />

          {/* Brand */}
          <header className="mt-7 flex justify-center">
            <Link href="/" aria-label="Enviroshield home">
              <Logo />
            </Link>
          </header>

          <div className="px-10 py-12 text-center max-[600px]:px-6 max-[600px]:py-9">
            {/* Eyebrow */}
            <p className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-blue" aria-hidden="true" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue">
                Something went wrong
              </span>
              <span className="h-px w-8 bg-blue" aria-hidden="true" />
            </p>

            {/* Error icon */}
            <div
              className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 w-24 h-24"
              aria-hidden="true"
            >
              <CircleAlert
                size={40}
                strokeWidth={1.8}
                className="text-red-500"
              />
            </div>

            {/* Main heading */}
            <h1
              id="error-title"
              className="text-[clamp(42px,7vw,68px)] font-extrabold leading-[0.95] tracking-[-0.055em] text-navy"
            >
              We hit a rough patch.
            </h1>

            <div className="mx-auto mt-6 max-w-[520px]">
              <p className="text-[18px] leading-[1.75] text-ink">
                {`Something unexpected happened while loading this page.
                Please try again, or head back to the Enviroshield
                homepage.`}
              </p>
            </div>

            {/* Primary actions */}
            <nav
              className="mt-9 flex items-center justify-center gap-3 max-[600px]:flex-col"
              aria-label="Error page navigation"
            >
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full bg-blue px-6 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep max-[600px]:max-w-none"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>

              <Link
                href="/"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full border border-line px-6 text-[13px] font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue max-[600px]:max-w-none"
              >
                <Home size={16} aria-hidden="true" />
                Back home
              </Link>
            </nav>

            {/* Secondary navigation */}
            <nav
              className="mt-8 border-t border-line pt-7"
              aria-label="Return navigation"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[12px] font-bold text-ink transition-[gap,color] duration-200 hover:gap-3 hover:text-blue"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Return to Enviroshield
              </Link>
            </nav>
          </div>
        </section>

        {/* Bottom brand text */}
        <footer className="mt-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
            Painting · Wall Finishing · Transformation
          </p>
        </footer>
      </div>
    </main>
  );
}
