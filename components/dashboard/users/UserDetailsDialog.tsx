"use client";

import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Fingerprint,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

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

type UserDetails = {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  phone?: string | null;
  role?: string | null;
  banned?: boolean;
  createdAt?: Date | string | null;
};

interface UserDetailsDialogProps {
  user: UserDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
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

export default function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const name = user.name?.trim() || "Unnamed user";
  const initials =
    name === "Unnamed user"
      ? "U"
      : name
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

          console.log(user)

  const isVerified = user.emailVerified === true;
  const isBanned = Boolean(user.banned);
  const createdAt = user.createdAt
    ? new Date(user.createdAt)
    : null;

  const validCreatedAt =
    createdAt && Number.isFinite(createdAt.getTime())
      ? createdAt
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
        <div className="border-b bg-muted/30 px-6 py-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              User Details
            </DialogTitle>
            <DialogDescription>
              View this user's profile and account information.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-2xl border">
              <AvatarImage
                src={user.image || undefined}
                alt={name}
              />
              <AvatarFallback className="rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold">{name}</h3>
              <p className="mt-1 break-all text-sm text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    isBanned
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }
                >
                  {isBanned ? "Banned" : "Active"}
                </Badge>

                <Badge
                  variant="outline"
                  className={
                    isVerified
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {isVerified ? "Email verified" : "Email not verified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-2">
          <h4 className="pt-3 text-sm font-semibold">
            Account information
          </h4>

          <div className="divide-y">
            <DetailRow
              icon={<Fingerprint className="h-4 w-4" />}
              label="User ID"
            >
              <span className="select-all font-mono text-xs">
                {user.id}
              </span>
            </DetailRow>

            <DetailRow
              icon={<Mail className="h-4 w-4" />}
              label="Email address"
            >
              {user.email || "Not available"}
            </DetailRow>

            <DetailRow
              icon={<UserRound className="h-4 w-4" />}
              label="Role"
            >
              <span className="capitalize">
                {user.role || "user"}
              </span>
            </DetailRow>

            <DetailRow
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Account status"
            >
              {isBanned ? (
                <span className="text-red-700">Banned</span>
              ) : (
                <span className="text-emerald-700">Active</span>
              )}
            </DetailRow>

            <DetailRow
              icon={
                isVerified ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )
              }
              label="Email verification"
            >
              {isVerified ? (
                <span className="text-emerald-700">Verified</span>
              ) : (
                <span className="text-amber-700">Not verified</span>
              )}
            </DetailRow>

            <DetailRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone number"
            >
              {user.phone || "Not provided"}
            </DetailRow>

            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Registration date"
            >
              {validCreatedAt
                ? validCreatedAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not available"}
            </DetailRow>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}