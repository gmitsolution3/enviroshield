"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);

    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setServerError(
        error.message || "Unable to process your request.",
      );
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section
        aria-labelledby="password-reset-success-heading"
        className="text-center"
      >
        <div
          className="mx-auto mb-6 grid size-[64px] place-items-center rounded-full bg-[#e9f3fd] text-blue"
          aria-hidden="true"
        >
          <span className="text-[25px] font-extrabold">✓</span>
        </div>

        <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
          EMAIL SENT
        </div>

        <h2
          id="password-reset-success-heading"
          className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy"
        >
          Check your email
        </h2>

        <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-[1.8] text-ink">
          If an account exists for that email address, we&apos;ve sent
          instructions to reset your password.
        </p>

        <div className="mt-8 border-t border-line pt-7">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-[13px] font-extrabold text-white transition-colors hover:bg-[#005cb9]"
          >
            Return to login
          </Link>
        </div>

        <p className="mt-5 text-[12px] text-ink">
          Didn&apos;t receive the email? Check your spam or junk
          folder.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-describedby={
        serverError ? "forgot-password-server-error" : undefined
      }
    >
      <fieldset className="space-y-6">
        <legend className="sr-only">Password reset request</legend>

        <div className="space-y-2">
          <Label
            htmlFor="forgot-password-email"
            className="text-[12px] font-bold text-navy"
          >
            Email address
          </Label>

          <Input
            id="forgot-password-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "forgot-password-email-error" : undefined
            }
            {...register("email")}
            className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
          />

          {errors.email ? (
            <p
              id="forgot-password-email-error"
              className="text-[12px] text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : null}
        </div>

        {serverError ? (
          <p
            id="forgot-password-server-error"
            className="rounded-[8px] bg-red-50 px-3 py-2.5 text-[12px] text-destructive"
            role="alert"
          >
            {serverError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-[48px] w-full rounded-full bg-blue text-[13px] font-extrabold text-white transition-colors hover:bg-[#005cb9]"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </fieldset>

      <div className="text-center">
        <Link
          href="/login"
          className="text-[13px] font-bold text-navy transition-colors hover:text-blue"
        >
          ← Back to login
        </Link>
      </div>
    </form>
  );
}
