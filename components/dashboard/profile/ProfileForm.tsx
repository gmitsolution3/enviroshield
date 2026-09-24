"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Mail, ShieldCheck } from "lucide-react";
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

import type { Session } from "@/lib/auth-client";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: Session["user"];
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    setSuccessMessage(null);

    const { error } = await authClient.updateUser({
      name: values.name,
      phone: values.phone,
    });

    if (error) {
      setServerError(
        error.message || "Unable to update your profile.",
      );
      return;
    }

    setSuccessMessage("Your profile has been updated.");
  }

  return (
    <div className="space-y-6">
      {/* Profile photo */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
              <Camera className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Profile photo
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your profile image across Enviroshield.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-7 sm:px-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-muted">
              <Camera className="h-7 w-7 text-muted-foreground" />
            </div>

            <div className="max-w-md">
              <p className="text-sm font-medium">Profile photo</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Profile image uploads will be connected once the
                Enviroshield image-upload infrastructure is added.
              </p>

              <p className="mt-3 text-xs text-muted-foreground/70">
                JPG, PNG, WebP · Maximum 5 MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal information */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <CardTitle className="font-display text-base font-bold tracking-tight">
            Personal information
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the information associated with your account.
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-7 px-6 py-7 sm:px-7">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full name
                </Label>

                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className="h-11 rounded-xl"
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium"
                >
                  Phone
                </Label>

                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+880 1XXX XXXXXX"
                  className="h-11 rounded-xl"
                  {...register("phone")}
                />

                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />

                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 rounded-xl bg-muted/50 pl-10"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Your email address is managed separately from your
                profile.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Account role
              </Label>

              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />

                <Input
                  id="role"
                  value={user.role ?? "user"}
                  disabled
                  className="h-11 rounded-xl bg-muted/50 pl-10 capitalize"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Your account role can only be changed by an
                administrator.
              </p>
            </div>

            <div className="border-t border-border/60 pt-7">
              <div className="grid gap-7 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Email status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.emailVerified
                          ? "bg-teal"
                          : "bg-muted-foreground/40"
                      }`}
                    />

                    <p className="text-sm font-medium">
                      {user.emailVerified
                        ? "Verified"
                        : "Not verified"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Joined
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {user.createdAt?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                    Last profile update
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    {user.updatedAt?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
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
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
