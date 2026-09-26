import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-5 py-12"
      aria-labelledby="not-found-title"
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
        {/* Main error content */}
        <section
          className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          aria-labelledby="not-found-title"
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
                Page not found
              </span>

              <span className="h-px w-8 bg-blue" aria-hidden="true" />
            </p>

            {/* Error heading */}
            <h1
              id="not-found-title"
              className="text-[clamp(88px,16vw,148px)] font-extrabold leading-[0.78] text-navy"
            >
              404
            </h1>

            <div className="mx-auto mt-10 max-w-[470px]">
              <h2 className="mb-4 text-[clamp(27px,4vw,38px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-navy">
                This page needs a fresh finish.
              </h2>

              <p className="text-[15px] leading-[1.75] text-ink">
                The page you&apos;re looking for may have moved, been removed,
                or never existed. Let&apos;s get you back to somewhere useful.
              </p>
            </div>

            {/* Primary navigation */}
            <nav
              className="mt-9 flex items-center justify-center gap-3 max-[600px]:flex-col"
              aria-label="Error page navigation"
            >
              <Link
                href="/"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full bg-blue px-6 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep max-[600px]:max-w-none"
              >
                <Home size={16} aria-hidden="true" />
                Back home
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center rounded-full border border-line px-6 text-[13px] font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue max-[600px]:max-w-none"
              >
                Contact us
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

        {/* Brand descriptor */}
        <footer className="mt-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
            Painting · Wall Finishing · Transformation
          </p>
        </footer>
      </div>
    </main>
  );
}
