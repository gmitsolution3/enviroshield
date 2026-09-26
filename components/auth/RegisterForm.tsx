"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name is too long."),
    email: z.string().email("Please enter a valid email address."),
    phone: z
      .string()
      .min(7, "Please enter a valid phone number.")
      .max(30, "Phone number is too long."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
    });

    if (error) {
      const message =
        error.message ||
        "Unable to create your account. Please try again.";

      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Account created successfully.");
    router.push("/verify-email");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-mist">
      <section
        aria-labelledby="register-heading"
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
                  JOIN ENVIROSHIELD
                </div>

                <h1
                  id="register-heading"
                  className="max-w-[440px] text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.03] tracking-[-0.05em]"
                >
                  Create an account and bring your project to life.
                </h1>

                <p className="mt-6 max-w-[400px] text-[15px] leading-[1.8] text-white/75">
                  Create your Enviroshield account to manage your
                  projects and continue your journey with us.
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
                CREATE ACCOUNT
              </div>

              <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy">
                Get started with Enviroshield
              </h2>

              <p className="mt-3 text-[14px] leading-[1.7] text-ink">
                Enter your details below to create your account.
              </p>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
              aria-describedby={
                serverError ? "register-server-error" : undefined
              }
              aria-busy={isSubmitting}
            >
              <fieldset disabled={isSubmitting} className="space-y-6">
                <legend className="sr-only">
                  Account information
                </legend>

                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-name"
                    className="text-[12px] font-bold text-navy"
                  >
                    Full name
                  </Label>

                  <Input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "register-name-error" : undefined
                    }
                    {...register("name")}
                    className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                  />

                  {errors.name && (
                    <p
                      id="register-name-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-email"
                    className="text-[12px] font-bold text-navy"
                  >
                    Email address
                  </Label>

                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email
                        ? "register-email-error"
                        : undefined
                    }
                    {...register("email")}
                    className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                  />

                  {errors.email && (
                    <p
                      id="register-email-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-phone"
                    className="text-[12px] font-bold text-navy"
                  >
                    Phone number
                  </Label>

                  <Input
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1XXX XXXXXX"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone
                        ? "register-phone-error"
                        : undefined
                    }
                    {...register("phone")}
                    className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                  />

                  {errors.phone && (
                    <p
                      id="register-phone-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-password"
                    className="text-[12px] font-bold text-navy"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password
                          ? "register-password-error"
                          : undefined
                      }
                      {...register("password")}
                      className="h-[48px] rounded-[9px] border-[#e0e5ea] bg-[#fafbfd] px-[14px] pr-12 text-[13px] text-ink transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="register-password-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="register-confirm-password"
                    className="text-[12px] font-bold text-navy"
                  >
                    Confirm password
                  </Label>

                  <div className="relative">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "register-confirm-password-error"
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

                  {errors.confirmPassword && (
                    <p
                      id="register-confirm-password-error"
                      role="alert"
                      className="text-[12px] text-destructive"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <div
                    id="register-server-error"
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
                  {isSubmitting ? "Registering..." : "Create account"}
                </Button>
              </fieldset>

              <p className="text-center text-[13px] text-ink">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-extrabold text-navy transition-colors hover:text-blue hover:underline"
                >
                  Sign in
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
