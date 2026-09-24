"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Password updated
          </h2>

          <p className="mt-3 text-sm text-muted-foreground">
            Your password has been changed successfully.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...register("password")}
        />

        {errors.password ? (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          Confirm password
        </Label>

        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive">
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}