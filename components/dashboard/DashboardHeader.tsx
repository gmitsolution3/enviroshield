"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

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

export function DashboardHeader({ user }: DashboardHeaderProps) {
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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-line/80 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6">
      {/* Left */}
      <div className="flex h-full items-center gap-3">
        <SidebarTrigger
          className={cn(
            "h-9 w-9 rounded-lg",
            "text-ink/60",
            "transition-colors duration-200",
            "hover:bg-blue/[0.08] hover:text-blue",
          )}
        />

        <Separator orientation="vertical" className="h-5 bg-line" />

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold tracking-tight text-navy">
            Dashboard
          </p>

          <p className="hidden text-xs font-medium text-ink/45 sm:block">
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
          className={cn(
            "h-9 w-9 rounded-lg",
            "text-ink/55",
            "transition-colors duration-200",
            "hover:bg-blue/[0.08] hover:text-blue",
          )}
        >
          <Bell className="h-[16px] w-[16px]" />

          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              variant="ghost"
              className="ml-1 h-9 rounded-full p-0 hover:bg-transparent"
            >
              <Avatar className="h-10 w-10 border border-line">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name}
                />

                <AvatarFallback className="bg-navy text-[12px] font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-xl border-line p-1.5"
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-ink">
                {user.name}
              </p>

              <p className="truncate text-xs text-ink/45">
                {user.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="rounded-lg text-ink/90 focus:bg-blue/[0.10] focus:text-blue hover:bg-blue/[0.10]">
              <Link
                href="/dashboard/profile"
                className="flex w-full items-center gap-2 h-7"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-lg text-ink/70 focus:bg-blue/[0.08] focus:text-blue">
              <Link
                href="/dashboard/settings"
                className="flex w-full items-center gap-2 h-7"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg text-destructive focus:text-destructive h-8"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
