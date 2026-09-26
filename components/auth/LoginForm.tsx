"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getSafeRedirectUrl(callbackUrl?: string) {
  if (!callbackUrl) {
    return "/dashboard";
  }

  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/dashboard";
  }

  return callbackUrl;
}

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      const message =
        error.status === 403
          ? "Please verify your email address before logging in."
          : error.message || "Invalid email or password.";

      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Logged in successfully.");
    router.push(getSafeRedirectUrl(callbackUrl));
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-mist">
      <section
        aria-labelledby="login-heading"
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
                <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                  <span
                    className="h-[2px] w-7 bg-current"
                    aria-hidden="true"
                  />
                  WELCOME BACK
                </div>

                <h1
                  id="login-heading"
                  className="max-w-[440px] text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.03] tracking-[-0.05em]"
                >
                  Beautiful spaces start with the right finish.
                </h1>

                <p className="mt-6 max-w-[400px] text-[15px] leading-[1.8] text-white/75">
                  Sign in to your Enviroshield account to continue
                  managing your projects and account details.
                </p>
              </div>

              <div className="mt-12 hidden max-[900px]:block">
                <Link
                  href="/"
                  className="text-[13px] font-bold text-paste transition-colors hover:text-white"
                >
                  ← Back to Enviroshield
                </Link>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <div className="px-[55px] py-[55px] max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6 max-[600px]:py-8">
            <header className="mb-8">
              <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                ACCOUNT LOGIN
              </div>

              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy">
                Sign in to your account
              </h2>

              <p className="mt-3 text-[14px] leading-[1.7] text-ink">
                Enter your details below to continue.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
              aria-describedby={
                serverError ? "login-server-error" : undefined
              }
              aria-busy={isSubmitting}
            >
              <fieldset disabled={isSubmitting} className="space-y-6">
                <legend className="sr-only">Login credentials</legend>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="text-[12px] font-bold text-navy"
                  >
                    Email address
                  </Label>

                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "login-email-error" : undefined
                    }
                    {...register("email")}
                    className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                  />

                  {errors.email && (
                    <p
                      id="login-email-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label
                      htmlFor="login-password"
                      className="text-[12px] font-bold text-navy"
                    >
                      Password
                    </Label>

                    <Link
                      href="/forgot-password"
                      className="text-[12px] font-medium text-ink transition-colors hover:text-blue"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "login-password-error"
                        : undefined
                    }
                    {...register("password")}
                    className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                  />

                  {errors.password && (
                    <p
                      id="login-password-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    id="login-server-error"
                    role="alert"
                    aria-live="polite"
                    className="rounded-[10px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-[13px] leading-[1.6] text-destructive"
                  >
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[48px] w-full rounded-full bg-blue text-[13px] font-extrabold text-white transition-colors hover:bg-[#005cb9]"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </fieldset>

              <p className="text-center text-[13px] text-ink">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-extrabold text-navy transition-colors hover:text-blue hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </form>

            <div className="mt-8 border-t border-line pt-6 text-center min-[901px]:hidden">
              <Link
                href="/"
                className="text-[12px] font-bold text-ink transition-colors hover:text-blue"
              >
                Back to Enviroshield
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
