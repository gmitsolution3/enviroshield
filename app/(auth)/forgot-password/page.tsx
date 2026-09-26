import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Enviroshield account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-mist">
      <section
        aria-labelledby="forgot-password-heading"
        className="relative flex min-h-screen items-center overflow-hidden bg-deep px-5 py-10 max-[600px]:px-4"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(1,110,220,0.18),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(157,204,249,0.1),transparent_30%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1080px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] min-[901px]:grid-cols-[0.85fr_1.15fr]">
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
                <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                  <span
                    className="h-[2px] w-7 bg-current"
                    aria-hidden="true"
                  />
                  ACCOUNT RECOVERY
                </div>

                <h1
                  id="forgot-password-heading"
                  className="max-w-[440px] text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.03] tracking-[-0.05em]"
                >
                  Let&apos;s get you back in.
                </h1>

                <p className="mt-6 max-w-[400px] text-[15px] leading-[1.8] text-white/75">
                  Enter the email address connected to your
                  Enviroshield account and we&apos;ll help you reset
                  your password.
                </p>
              </div>

              <div className="mt-12 hidden max-[900px]:block">
                <Link
                  href="/login"
                  className="text-[13px] font-bold text-paste transition-colors hover:text-white"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </aside>

          <div className="flex items-center px-[55px] py-[55px] max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6 max-[600px]:py-8">
            <div className="w-full">
              <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                RESET PASSWORD
              </div>

              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy">
                Forgot your password?
              </h2>

              <p className="mt-4 max-w-[430px] text-[15px] leading-[1.8] text-ink">
                Enter your email and we&apos;ll send you a link to
                reset your password.
              </p>

              <div className="mt-8">
                <ForgotPasswordForm />
              </div>

              <div className="mt-7 border-t border-line pt-6 text-center">
                <Link
                  href="/login"
                  className="text-[13px] font-bold text-navy transition-colors hover:text-blue"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
