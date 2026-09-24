import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AppRole = "user" | "admin";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(role: AppRole) {
  const session = await requireAuth();

  const userRole = session.user.role ?? "user";

  if (userRole !== role) {
    redirect("/dashboard");
  }

  return session;
}
