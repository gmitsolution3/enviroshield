import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your Enviroshield account.",
  robots: {
    index: false,
    follow: false,
  },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-mist">
      <section
        aria-labelledby="reset-password-heading"
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
                  id="reset-password-heading"
                  className="max-w-[440px] text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.03] tracking-[-0.05em]"
                >
                  Choose a new password and get back in.
                </h1>

                <p className="mt-6 max-w-[400px] text-[15px] leading-[1.8] text-white/75">
                  Create a new secure password for your Enviroshield account
                  and continue using your account.
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
                Create a new password
              </h2>

              <p className="mt-4 max-w-[430px] text-[15px] leading-[1.8] text-ink">
                Choose a new password for your Enviroshield account.
              </p>

              <div className="mt-8">
                <ResetPasswordForm
                  token={params.token}
                  initialError={
                    params.error === "INVALID_TOKEN"
                      ? "This password reset link is invalid or has expired."
                      : null
                  }
                />
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