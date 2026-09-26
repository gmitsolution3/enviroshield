"use client";

import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

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
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-20">
      <div className="w-full max-w-[700px] text-center">
        {/* Decorative mark */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue/10">
          <div className="h-3 w-3 rounded-full bg-blue" />
        </div>

        {/* Error code */}
        <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.15em] text-blue">
          Something went wrong
        </p>

        <h1 className="mb-6 text-[clamp(48px,8vw,82px)] font-extrabold leading-none tracking-[-0.055em] text-navy">
          We hit a rough patch.
        </h1>

        <p className="mx-auto mb-10 max-w-[520px] text-[16px] leading-[1.7] text-ink">
          Something unexpected happened while loading this page.
          Please try again, or head back to the Enviroshield homepage.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 max-[600px]:flex-col">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-[13px] font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue"
          >
            <Home size={16} />
            Back home
          </Link>
        </div>

        {/* Secondary navigation */}
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-ink transition-[gap,color] duration-200 hover:gap-3 hover:text-blue"
          >
            <ArrowLeft size={15} />
            Return to Enviroshield
          </Link>
        </div>
      </div>
    </main>
  );
}
