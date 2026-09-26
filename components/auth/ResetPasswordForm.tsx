"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token?: string;
  initialError?: string | null;
};

export function ResetPasswordForm({
  token,
  initialError = null,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(
    initialError,
  );
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    setServerError(null);

    if (!token) {
      setServerError(
        "This password reset link is invalid or has expired.",
      );
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      setServerError(
        error.message ||
          "Unable to reset your password. Please request a new reset link.",
      );
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  if (success) {
    return (
      <section
        aria-labelledby="password-updated-heading"
        className="text-center"
      >
        <div
          className="mx-auto mb-6 grid size-[64px] place-items-center rounded-full bg-[#e9f3fd] text-blue"
          aria-hidden="true"
        >
          <span className="text-[25px] font-extrabold">✓</span>
        </div>

        <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
          PASSWORD UPDATED
        </div>

        <h2
          id="password-updated-heading"
          className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy"
        >
          Password updated
        </h2>

        <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-[1.8] text-ink">
          Your password has been changed successfully.
        </p>

        <p
          className="mt-5 text-[12px] text-ink"
          aria-live="polite"
        >
          Redirecting you to login...
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-describedby={
        serverError ? "reset-password-server-error" : undefined
      }
    >
      <fieldset className="space-y-6">
        <legend className="sr-only">Create a new password</legend>

        <div className="space-y-2">
          <Label
            htmlFor="reset-password"
            className="text-[12px] font-bold text-navy"
          >
            New password
          </Label>

          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your new password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "reset-password-error" : undefined
              }
              {...register("password")}
              className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] pr-12 text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password ? (
            <p
              id="reset-password-error"
              className="text-[12px] text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="reset-confirm-password"
            className="text-[12px] font-bold text-navy"
          >
            Confirm password
          </Label>

          <div className="relative">
            <Input
              id="reset-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "reset-confirm-password-error"
                  : undefined
              }
              {...register("confirmPassword")}
              className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] pr-12 text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.confirmPassword ? (
            <p
              id="reset-confirm-password-error"
              className="text-[12px] text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {serverError ? (
          <p
            id="reset-password-server-error"
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
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
      </fieldset>
    </form>
  );
}