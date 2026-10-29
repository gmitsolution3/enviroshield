"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

import DashboardButton from "@/components/dashboard/DashboardButton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileImageDialog } from "./ProfileImageDialog";

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

const cardClass =
  "group/card relative overflow-hidden rounded-2xl border-border/70 bg-background shadow-none transition-all duration-300 hover:border-blue/30 hover:shadow-[0_8px_30px_-12px_rgba(79,70,229,0.18)]";

const accentBar =
  "pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue via-blue/60 to-teal opacity-70";

const iconInputClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within/field:text-blue";

function formatDate(date?: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    null,
  );
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user.image ?? null,
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
      <Card className={cardClass}>
        <div className={accentBar} />
        {/* soft decorative glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-teal/[0.06] blur-3xl" />

        <CardHeader className="relative border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/[0.08] text-blue ring-1 ring-blue/10 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:-rotate-3">
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

        <CardContent className="relative px-6 py-7 sm:px-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="group/avatar relative shrink-0">
              {/* gradient ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue/50 via-blue/10 to-teal/50 opacity-70 blur-[2px] transition-opacity duration-300 group-hover/avatar:opacity-100" />

              <Avatar className="relative h-20 w-20 border-2 border-background">
                <AvatarImage
                  src={profileImage ?? undefined}
                  alt={`${user.name} profile photo`}
                />
                <AvatarFallback className="bg-blue/[0.08] text-lg font-semibold text-blue">
                  {user.name
                    .trim()
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => setIsPhotoDialogOpen(true)}
                aria-label="Change profile photo"
                className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-blue text-white shadow-sm transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-w-md">
              <p className="text-sm font-medium">Profile photo</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Choose a photo to personalize your Enviroshield
                account.
              </p>

              <p className="mt-3 inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground/80">
                JPG, PNG, WebP · Maximum 5 MB
              </p>
              <div className="mt-4">
                <DashboardButton
                  type="button"
                  onClick={() => setIsPhotoDialogOpen(true)}
                  icon={<Camera className="h-4 w-4" />}
                >
                  Change photo
                </DashboardButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal information */}
      <Card className={cardClass}>
        <div className={accentBar} />

        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/[0.08] text-blue ring-1 ring-blue/10 transition-transform duration-300 group-hover/card:scale-105 group-hover/card:rotate-3">
              <User className="h-4 w-4" />
            </div>

            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight">
                Personal information
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the information associated with your account.
              </p>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-7 px-6 py-7 sm:px-7">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="group/field space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full name
                </Label>

                <div className="relative">
                  <User className={iconInputClass} />

                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                    className="h-11 rounded-xl pl-10 transition-shadow focus-visible:ring-blue/30"
                    {...register("name")}
                  />
                </div>

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="group/field space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium"
                >
                  Phone
                </Label>

                <div className="relative">
                  <Phone className={iconInputClass} />

                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1XXX XXXXXX"
                    className="h-11 rounded-xl pl-10 transition-shadow focus-visible:ring-blue/30"
                    {...register("phone")}
                  />
                </div>

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
                  className="h-11 rounded-xl bg-muted/50 pl-10 pr-28"
                />

                {user.emailVerified && (
                  <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </span>
                )}
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
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue/70" />

                <Input
                  id="role"
                  value={user.role ?? "user"}
                  disabled
                  className="h-11 rounded-xl bg-blue/[0.04] pl-10 font-medium capitalize"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Your account role can only be changed by an
                administrator.
              </p>
            </div>

            <div className="border-t border-border/60 pt-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground/70">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                      Email status
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {user.emailVerified && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-50" />
                      )}
                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          user.emailVerified
                            ? "bg-teal"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                    </span>

                    <p className="text-sm font-medium">
                      {user.emailVerified
                        ? "Verified"
                        : "Not verified"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground/70">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                      Joined
                    </p>
                  </div>

                  <p className="mt-2.5 text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground/70">
                    <Clock className="h-3.5 w-3.5" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                      Last update
                    </p>
                  </div>

                  <p className="mt-2.5 text-sm font-medium">
                    {formatDate(user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-teal/20 bg-teal/[0.05] p-4 text-sm leading-relaxed text-teal"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            <div className="flex justify-end border-t border-border/60 pt-6">
              <DashboardButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </DashboardButton>
            </div>
          </CardContent>
        </form>
      </Card>

      <ProfileImageDialog
        open={isPhotoDialogOpen}
        onOpenChange={setIsPhotoDialogOpen}
        currentImage={profileImage}
        onSaved={(image) => setProfileImage(image)}
      />
    </div>
  );
}