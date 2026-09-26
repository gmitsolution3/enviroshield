"use client";

import Logo from "@/components/Logo";

export default function Loading() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-5 py-12"
      aria-label="Loading page"
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

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center text-center">
        {/* Brand */}
        <div className="mb-12">
          <Logo light />
        </div>

        {/* Loading visual */}
        <div
          className="relative flex h-[150px] w-[150px] items-center justify-center"
          aria-hidden="true"
        >
          {/* Soft outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10" />

          {/* Rotating outer arc */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue border-r-blue/30" />

          {/* Secondary rotating arc */}
          <div className="absolute inset-[18px] animate-[spin_2.4s_linear_infinite_reverse] rounded-full border border-transparent border-b-white/40 border-l-white/20" />

          {/* Inner ring */}
          <div className="absolute inset-[38px] rounded-full border border-white/10" />

          {/* Center pulse */}
          <div className="relative flex h-5 w-5 items-center justify-center">
            <div className="absolute h-5 w-5 animate-ping rounded-full bg-blue/20" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-blue shadow-[0_0_20px_rgba(1,110,220,0.7)]" />
          </div>
        </div>

        {/* Loading copy */}
        <div className="mt-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
            Preparing your experience
          </p>

          <p className="mx-auto mt-3 max-w-[300px] text-[13px] leading-[1.7] text-white/50">
            We&apos;re getting everything ready for you.
          </p>
        </div>

        {/* Progress line */}
        <div
          className="mt-8 h-px w-[180px] overflow-hidden bg-white/10"
          aria-hidden="true"
        >
          <div className="h-full w-1/2 animate-[loading_1.6s_ease-in-out_infinite] bg-blue" />
        </div>

        {/* Brand statement */}
        <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
          Painting · Wall Finishing · Transformation
        </p>
      </div>

      {/* Screen-reader status */}
      <p className="sr-only" role="status" aria-live="polite">
        Loading page, please wait.
      </p>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </main>
  );
}
