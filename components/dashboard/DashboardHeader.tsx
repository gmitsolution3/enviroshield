"use client";

import {
  ArrowUpRight,
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
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

  const initials = getInitials(user.name, user.email);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-line/80 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-6">
      {/* Left: Dashboard identity and public-site navigation */}
      <div className="flex h-full min-w-0 items-center gap-3">
        <SidebarTrigger
          className={cn(
            "h-9 w-9 rounded-lg",
            "text-ink/60",
            "transition-colors duration-200",
            "hover:bg-blue/[0.08] hover:text-blue",
          )}
        />

        <Separator orientation="vertical" className="h-5 bg-line" />

        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-sm font-semibold tracking-tight text-navy">
            Dashboard
          </p>

          <p className="hidden text-xs font-medium text-ink/45 sm:block">
            Enviroshield workspace
          </p>
        </div>

        <Separator
          orientation="vertical"
          className="mx-0.5 hidden h-5 bg-line sm:block"
        />
      </div>

      {/* Right: Notifications and user menu */}
      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href="/"
          aria-label="Visit the Enviroshield public website"
          className={cn(
            "group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2",
            "text-xs font-medium text-ink/55 sm:text-sm",
            "transition-colors duration-200",
            "hover:bg-blue/[0.06] hover:text-blue",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40",
          )}
        >
          <span>Visit website</span>

          <ArrowUpRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className={cn(
            "h-9 w-9 rounded-lg",
            "text-ink/55",
            "transition-colors duration-200",
            "hover:bg-blue/[0.08] hover:text-blue",
          )}
        >
          <Bell className="h-[16px] w-[16px]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              type="button"
              variant="ghost"
              aria-label="Open user menu"
              className="ml-1 h-10 w-10 rounded-full p-0 hover:bg-blue/[0.06]"
            >
              <Avatar className="h-9 w-9 border border-line">
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
                className="flex h-7 w-full items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-lg text-ink/70 focus:bg-blue/[0.08] focus:text-blue">
              <Link
                href="/dashboard/settings"
                className="flex h-7 w-full items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="h-8 rounded-lg text-destructive focus:text-destructive"
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
