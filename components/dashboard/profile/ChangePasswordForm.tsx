"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Please enter your current password."),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: PasswordFormValues) {
    setServerError(null);
    setSuccessMessage(null);

    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setServerError(
        error.message || "Unable to change your password.",
      );
      return;
    }

    reset();

    setSuccessMessage("Your password has been changed successfully.");
  }

  return (
    <Card className="rounded-2xl border-border/70 bg-background shadow-none">
      <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
            <LockKeyhole className="h-4 w-4" />
          </div>

          <div>
            <CardTitle className="font-display text-base font-bold tracking-tight">
              Security
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your password and account security.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-7 sm:px-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm font-medium"
            >
              Current password
            </Label>

            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              className="h-11 rounded-xl"
              {...register("currentPassword")}
            />

            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium"
            >
              New password
            </Label>

            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="h-11 rounded-xl"
              {...register("newPassword")}
            />

            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium"
            >
              Confirm new password
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your new password again"
              className="h-11 rounded-xl"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
            <p className="text-sm font-medium">
              Other sessions will be signed out
            </p>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Changing your password will sign you out of other
              devices and browsers where your account is currently
              active.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive"
            >
              {serverError}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="rounded-xl border border-teal/20 bg-teal/[0.05] p-4 text-sm leading-relaxed text-teal"
            >
              {successMessage}
            </div>
          )}

          <div className="flex justify-end border-t border-border/60 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-full px-6"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}