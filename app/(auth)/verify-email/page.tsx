import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { VerifyEmailCard } from "@/components/auth/VerifyEmailCard";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description:
    "Verify your email address to activate your Enviroshield account.",
  robots: {
    index: false,
    follow: false,
  },
};

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
    callbackUrl?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-mist">
      <section
        aria-labelledby="verify-email-heading"
        className="relative flex min-h-screen items-center overflow-hidden bg-deep px-5 py-10 max-[600px]:px-4"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(1,110,220,0.18),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(157,204,249,0.1),transparent_30%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] min-[901px]:grid-cols-[0.85fr_1.15fr]">
          {/* Brand panel */}
          <aside className="relative overflow-hidden bg-navy px-[50px] py-[55px] text-white max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6">
            <div
              className="absolute -right-24 -top-24 size-[240px] rounded-full border border-white/10"
              aria-hidden="true"
            />

            <div
              className="absolute -bottom-32 -left-24 size-[280px] rounded-full border border-paste/10"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-8">
                  <Logo light />
                </div>

                <div className="mb-[18px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                  ALMOST THERE
                </div>

                <h1
                  id="verify-email-heading"
                  className="max-w-[440px] text-[clamp(28px,3vw,42px)] font-extrabold leading-[1.1] tracking-[-0.04em]"
                >
                  One small step before you get started.
                </h1>

                <p className="mt-4 max-w-[400px] text-[14px] leading-[1.7] text-white/75">
                  Verify your email address to activate your
                  Enviroshield account and continue.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-paste transition-colors hover:text-white"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back to Enviroshield
                </Link>
              </div>
            </div>
          </aside>

          {/* Verification panel */}
          <div className="flex items-center px-[55px] py-[55px] max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6 max-[600px]:py-8">
            <VerifyEmailCard
              email={params.email}
              callbackUrl={params.callbackUrl}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
