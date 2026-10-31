"use client";

import {
  Ban,
  CheckCircle2,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserRound,
  Eye,
  Clock3,
} from "lucide-react";
import { useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserDetailsDialog from "./UserDetailsDialog";

import { toast } from "sonner";

import type { AdminDashboardUser } from "@/types/user.type";

type BanDuration =
  | "one-day"
  | "three-days"
  | "seven-days"
  | "fifteen-days"
  | "one-month";

interface UserActionsProps {
  user: AdminDashboardUser;
  currentUserId?: string;
  onSuccess: () => void | Promise<void>;
}

export default function UserActions({
  user,
  currentUserId,
  onSuccess,
}: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);
  const [isUnbanOpen, setIsUnbanOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banReasonError, setBanReasonError] = useState("");
  const [banDuration, setBanDuration] = useState<BanDuration>("seven-days");
  const submissionInProgress = useRef(false);

  const isAdmin = user.role === "admin";
  const isBanned = Boolean(user.banned);
  const isCurrentUser = user.id === currentUserId;

  async function handleRoleChange() {
    setIsLoading(true);

    const newRole = isAdmin ? "user" : "admin";

    const { error } = await authClient.admin.setRole({
      userId: user.id,
      role: newRole,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to update role", {
        description:
          error.message || "The user's role could not be updated.",
      });

      return;
    }

    toast.success("Role updated", {
      description: `${user.name || user.email} is now ${
        newRole === "admin" ? "an admin" : "a user"
      }.`,
    });

    onSuccess();
  }

  async function handleBanToggle() {
    if (!isBanned) {
      setBanReason("");
      setBanReasonError("");
      setBanDuration("seven-days");
      setIsBanOpen(true);
      return;
    }
    setIsUnbanOpen(true);
  }

  async function handleUnban() {
    if (submissionInProgress.current) return;
    submissionInProgress.current = true;
    setIsLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({
        userId: user.id,
      });
      if (error) {
        toast.error("Failed to unban user", {
          description: error.message || "The user could not be unbanned.",
        });
        return;
      }

      toast.success("User unbanned", {
        description: `${user.name || user.email} can access the account again.`,
      });
      setIsUnbanOpen(false);
      await onSuccess();
    } catch {
      toast.error("Failed to unban user", {
        description: "The user could not be unbanned. Please try again.",
      });
    } finally {
      submissionInProgress.current = false;
      setIsLoading(false);
    }
  }

  async function handleBan() {
    if (submissionInProgress.current) return;
    const reason = banReason.trim();
    if (!reason) {
      setBanReasonError("Enter a reason before confirming this ban.");
      return;
    }
    if (reason.length > 500) {
      setBanReasonError("The reason must be 500 characters or fewer.");
      return;
    }

    setIsLoading(true);
    submissionInProgress.current = true;
    setBanReasonError("");
    const expirationSeconds: Record<BanDuration, number> = {
      "one-day": 60 * 60 * 24,
      "three-days": 60 * 60 * 24 * 3,
      "seven-days": 60 * 60 * 24 * 7,
      "fifteen-days": 60 * 60 * 24 * 15,
      "one-month": 60 * 60 * 24 * 30,
    };

    try {
      const { error } = await authClient.admin.banUser({
        userId: user.id,
        banReason: reason,
        banExpiresIn: expirationSeconds[banDuration],
      });
      if (error) {
        toast.error("Failed to ban user", {
          description: error.message || "The user could not be banned.",
        });
        return;
      }

      setIsBanOpen(false);
      toast.success("User banned", {
        description: `${user.name || user.email} has been banned.`,
      });
      await onSuccess();
    } catch {
      toast.error("Failed to ban user", {
        description: "The user could not be banned. Please try again.",
      });
    } finally {
      submissionInProgress.current = false;
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);

    const { error } = await authClient.admin.removeUser({
      userId: user.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Failed to delete user", {
        description:
          error.message || "The user could not be deleted.",
      });

      return;
    }

    setIsDeleteOpen(false);

    toast.success("User deleted", {
      description: `${user.name || user.email} has been permanently deleted.`,
    });

    onSuccess();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isLoading}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setIsDetailsOpen(true)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isLoading || isCurrentUser}
          onClick={handleRoleChange}
        >
          {isAdmin ? (
            <>
              <UserRound className="mr-2 h-4 w-4" />
              Make user
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Make admin
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isLoading || isCurrentUser}
          onClick={handleBanToggle}
        >
          {isBanned ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Unban user
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Ban user
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isLoading || isCurrentUser}
          onClick={(event) => {
            event.preventDefault();
            setIsDeleteOpen(true);
          }}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete user
        </DropdownMenuItem>

        {isCurrentUser && (
          <p className="px-2 py-1.5 text-xs text-muted-foreground">
            You can&apos;t manage your own account
          </p>
        )}
      </DropdownMenuContent>

      <UserDetailsDialog
        user={user}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <AlertDialog
        open={isBanOpen}
        onOpenChange={(open) => {
          if (isLoading) return;
          setIsBanOpen(open);
          if (!open) setBanReasonError("");
        }}
      >
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Ban this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will prevent {user.name || user.email} from signing in and
              revoke their active sessions. Provide a reason for the account
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={`ban-reason-${user.id}`} className="text-sm font-medium">
                Ban reason
              </label>
              <Textarea
                id={`ban-reason-${user.id}`}
                value={banReason}
                onChange={(event) => {
                  setBanReason(event.target.value);
                  if (event.target.value.trim()) setBanReasonError("");
                }}
                placeholder="Enter the reason for banning this user..."
                maxLength={500}
                aria-invalid={Boolean(banReasonError)}
                aria-describedby={banReasonError ? `ban-reason-error-${user.id}` : undefined}
                disabled={isLoading}
              />
              {banReasonError && (
                <p
                  id={`ban-reason-error-${user.id}`}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {banReasonError}
                </p>
              )}
              <p className="text-right text-xs text-muted-foreground">
                {banReason.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`ban-duration-${user.id}`} className="flex items-center gap-2 text-sm font-medium">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                Ban duration
              </label>
              <Select
                value={banDuration}
                onValueChange={(value) => {
                  if (
                    value === "one-day" ||
                    value === "three-days" ||
                    value === "seven-days" ||
                    value === "fifteen-days" ||
                    value === "one-month"
                  ) setBanDuration(value);
                }}
                disabled={isLoading}
              >
                <SelectTrigger id={`ban-duration-${user.id}`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-day">1 day</SelectItem>
                  <SelectItem value="three-days">3 days</SelectItem>
                  <SelectItem value="seven-days">7 days</SelectItem>
                  <SelectItem value="fifteen-days">15 days</SelectItem>
                  <SelectItem value="one-month">1 month (30 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={handleBan}
            >
              {isLoading ? "Banning..." : "Confirm ban"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isUnbanOpen}
        onOpenChange={(open) => {
          if (!isLoading) setIsUnbanOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unban this user?</AlertDialogTitle>
            <AlertDialogDescription>
              Unbanning {user.name || user.email} will restore the account&apos;s
              ability to use the application, subject to other access
              restrictions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <Button type="button" disabled={isLoading} onClick={handleUnban}>
              {isLoading ? "Unbanning..." : "Confirm unban"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {user.name || user.email}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isLoading}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
