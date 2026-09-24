import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { dashboardNavigation } from "@/config/dashboard/navigation";
import { requireAuth } from "@/lib/auth-guards";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAuth();

  const role = session.user.role ?? "user";

  return (
    <DashboardShell
      role={role}
      user={session.user}
      navigation={dashboardNavigation[role]}
    >
      {children}
    </DashboardShell>
  );
}