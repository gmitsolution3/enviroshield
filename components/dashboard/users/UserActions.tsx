"use client";

import {
  Ban,
  CheckCircle2,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import type { Session } from "@/lib/auth-client";

type DashboardUser = Session["user"] & {
  banned?: boolean;
};

interface UserActionsProps {
  user: DashboardUser;
  currentUserId?: string;
  onSuccess: () => void;
}

export default function UserActions({
  user,
  currentUserId,
  onSuccess,
}: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
    setIsLoading(true);

    if (isBanned) {
      const { error } = await authClient.admin.unbanUser({
        userId: user.id,
      });

      setIsLoading(false);

      if (error) {
        toast.error("Failed to unban user", {
          description:
            error.message || "The user could not be unbanned.",
        });

        return;
      }

      toast.success("User unbanned", {
        description: `${user.name || user.email} can access the account again.`,
      });
    } else {
      const { error } = await authClient.admin.banUser({
        userId: user.id,
        banReason: "Banned by administrator",
      });

      setIsLoading(false);

      if (error) {
        toast.error("Failed to ban user", {
          description:
            error.message || "The user could not be banned.",
        });

        return;
      }

      toast.success("User banned", {
        description: `${user.name || user.email} has been banned.`,
      });
    }

    onSuccess();
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
          onSelect={(event) => {
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
            You can't manage your own account
          </p>
        )}
      </DropdownMenuContent>

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
