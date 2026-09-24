"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function DashboardHeader({
  user,
}: DashboardHeaderProps) {
  const router = useRouter();

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      {/* Left */}
      <div className="flex h-full items-center gap-3">
        <SidebarTrigger className="h-9 w-9 rounded-xl" />

        <Separator
          orientation="vertical"
          className="h-5"
        />

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Dashboard
          </p>

          <p className="hidden text-xs text-muted-foreground sm:block">
            Enviroshield workspace
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />

          <span className="sr-only">
            Notifications
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              variant="ghost"
              className="ml-1 h-9 rounded-full p-0 hover:bg-transparent"
            >
              <Avatar className="h-9 w-9 border border-border/80">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name}
                />

                <AvatarFallback className="bg-ink text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-2xl p-1.5"
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-medium">
                {user.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="rounded-xl"
            >
              <Link href="/dashboard/profile">
                <User />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="rounded-xl"
            >
              <Link href="/dashboard/settings">
                <Settings />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl text-destructive focus:text-destructive"
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}