"use client";

import { CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { getSafeRedirectUrl } from "@/lib/redirects";

type VerifyEmailCardProps = {
  email?: string;
  callbackUrl?: string;
};

export function VerifyEmailCard({ email, callbackUrl }: VerifyEmailCardProps) {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleResend = async () => {
    if (!email || countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      const targetRedirect = getSafeRedirectUrl(callbackUrl);
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: targetRedirect,
      });

      if (error) {
        toast.error(error.message || "Failed to resend verification email.");
        return;
      }

      toast.success("Verification email resent. Please check your inbox.");
      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Failed to resend verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  const loginUrl = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  return (
    <div className="w-full text-center">
      <div
        className="mx-auto mb-6 grid size-[64px] place-items-center rounded-full bg-[#e9f3fd] text-blue"
        aria-hidden="true"
      >
        <Mail size={30} />
      </div>

      <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
        EMAIL VERIFICATION
      </div>

      <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy">
        Verify your email
      </h2>

      <p className="mx-auto mt-4 max-w-[430px] text-[15px] leading-[1.8] text-ink">
        {email ? (
          <>
            We sent a verification link to{" "}
            <strong className="font-bold text-navy">{email}</strong>.
          </>
        ) : (
          "We sent a verification link to your email address."
        )}
      </p>

      <p className="mx-auto mt-2 max-w-[400px] text-[13px] leading-[1.7] text-ink/75">
        Click the link inside the email to activate your account. You will be
        automatically logged in and redirected to your destination.
      </p>

      {callbackUrl && (
        <div className="mx-auto mt-4 max-w-sm rounded-xl border border-blue/20 bg-blue/5 p-3 text-xs text-blue">
          <div className="flex items-center justify-center gap-1.5 font-semibold">
            <CheckCircle2 size={14} className="shrink-0" />
            <span>Redirect destination saved</span>
          </div>
          <p className="mt-0.5 text-[11px] text-ink/70">
            You will return directly to your intended page once verified.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row border-t border-line pt-7">
        <Link
          href={loginUrl}
          className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-blue px-7 text-[13px] font-extrabold text-white transition-colors hover:bg-[#005cb9]"
        >
          Back to login
        </Link>

        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || countdown > 0}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-[13px] font-bold text-navy transition hover:border-blue hover:text-blue disabled:opacity-60"
          >
            {isResending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Resending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw size={14} />
                Resend email
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-5 text-[12px] text-ink/65">
        Didn&apos;t receive the email? Check your spam or junk folder.
      </p>
    </div>
  );
}

