"use client";

import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import type {
  DashboardNavItem,
  DashboardRole,
} from "@/config/dashboard/navigation";

import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: ReactNode;
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  navigation: DashboardNavItem[];
}

export function DashboardShell({
  children,
  role,
  user: initialUser,
  navigation,
}: DashboardShellProps) {
  const { data: session } = authClient.useSession();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }
    : initialUser;

  return (
    <SidebarProvider>
      <DashboardSidebar
        role={role}
        user={user}
        navigation={navigation}
      />

      <SidebarInset className="min-w-0 bg-mist">
        <DashboardHeader user={user} />

        <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-mist">
          {/* Subtle Enviroshield visual texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grain opacity-[0.018]"
          />

          {/* Very subtle Enviroshield brand ambience */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue/[0.025] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-paste/[0.02] blur-[120px]"
          />

          <div className="relative">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
