"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

import DashboardButton from "@/components/dashboard/DashboardButton";
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your current password"
                className="h-11 rounded-xl pr-11"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                aria-pressed={showCurrentPassword}
                aria-controls="currentPassword"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

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

            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="h-11 rounded-xl pr-11"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                aria-pressed={showNewPassword}
                aria-controls="newPassword"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

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

            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your new password again"
                className="h-11 rounded-xl pr-11"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
                aria-controls="confirmPassword"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

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
            <DashboardButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </DashboardButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
