"use client";
import { getInitials } from "@/lib/utils";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminDashboardUser } from "@/types/admin/user.type";
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Fingerprint,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import RoleBadge from "./RoleBadge";

interface UserDetailsDialogProps {
  user: AdminDashboardUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 break-words text-sm font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string | null, includeTime = false) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

function formatBanExpiry(value: string | null) {
  if (!value) return "No expiration date recorded";
  const expiry = new Date(value);
  if (!Number.isFinite(expiry.getTime())) return "Not available";

  const formattedDate = formatDate(value, true);
  const remainingMs = expiry.getTime() - Date.now();
  if (remainingMs <= 0) return `${formattedDate} (expired)`;

  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));
  const totalHours = Math.ceil(totalMinutes / 60);
  const totalDays = Math.ceil(totalHours / 24);
  const remaining =
    totalDays >= 1
      ? `${totalDays} ${totalDays === 1 ? "day" : "days"}`
      : totalHours >= 1
        ? `${totalHours} ${totalHours === 1 ? "hour" : "hours"}`
        : `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;

  return `${formattedDate} (in ${remaining})`;
}

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const name = user.name.trim() || "Unnamed user";
  const initials = getInitials(user.name, user.email);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl p-0 sm:max-w-2xl">
        <div className="border-b bg-muted/30 px-5 py-6 sm:px-7">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              User details
            </DialogTitle>
            <DialogDescription>
              Profile and account information for this user.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex min-w-0 items-center gap-4 pr-7">
            <Avatar className="h-16 w-16 shrink-0 rounded-2xl border">
              <AvatarImage src={user.image || undefined} alt={name} />
              <AvatarFallback className="rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold text-foreground">
                {name}
              </h3>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user.email}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                ID: {user.id}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                <Badge
                  variant="outline"
                  className={
                    user.banned
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }
                >
                  {user.banned ? "Banned" : "Active"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user.emailVerified
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {user.emailVerified
                    ? "Email verified"
                    : "Email not verified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <section
          className="px-5 py-5 sm:px-7"
          aria-labelledby="user-account-heading"
        >
          <h4
            id="user-account-heading"
            className="text-sm font-semibold text-foreground"
          >
            Account information
          </h4>
          <div className="mt-2 grid divide-y sm:grid-cols-2 sm:gap-x-6">
            <DetailRow
              icon={<UserRound className="h-4 w-4" />}
              label="Name"
            >
              {user.name || "Not provided"}
            </DetailRow>
            <DetailRow
              icon={<Mail className="h-4 w-4" />}
              label="Email address"
            >
              {user.email || "Not available"}
            </DetailRow>
            <DetailRow
              icon={
                user.emailVerified ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )
              }
              label="Email verification"
            >
              {user.emailVerified ? "Verified" : "Not verified"}
            </DetailRow>
            <DetailRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone number"
            >
              {user.phone?.trim() || "Not provided"}
            </DetailRow>
            <DetailRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Role"
            >
              <span className="capitalize">
                {user.role || "Not available"}
              </span>
            </DetailRow>
            <DetailRow
              icon={<Ban className="h-4 w-4" />}
              label="Account status"
            >
              <span
                className={
                  user.banned ? "text-red-700" : "text-emerald-700"
                }
              >
                {user.banned ? "Banned" : "Active"}
              </span>
            </DetailRow>
            <DetailRow
              icon={<Fingerprint className="h-4 w-4" />}
              label="User ID"
            >
              <span className="select-all font-mono text-xs">
                {user.id}
              </span>
            </DetailRow>
            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Registration date"
            >
              {formatDate(user.createdAt)}
            </DetailRow>
            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Last updated"
            >
              {formatDate(user.updatedAt)}
            </DetailRow>
          </div>
        </section>

        {user.banned && (
          <section
            aria-labelledby="user-ban-heading"
            className="mx-5 mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-950 sm:mx-7 sm:p-5"
          >
            <h4
              id="user-ban-heading"
              className="flex items-center gap-2 font-semibold"
            >
              <Ban className="h-4 w-4 shrink-0" aria-hidden="true" />
              Ban information
            </h4>
            <dl className="mt-3 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-red-900/70">
                  Status
                </dt>
                <dd className="mt-1 font-semibold">Banned</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-red-900/70">
                  Expires
                </dt>
                <dd className="mt-1 font-semibold">
                  {formatBanExpiry(user.banExpires)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-red-900/70">
                  Reason
                </dt>
                <dd className="mt-1 whitespace-pre-wrap font-medium">
                  {user.banReason?.trim() || "No reason provided"}
                </dd>
              </div>
            </dl>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}
