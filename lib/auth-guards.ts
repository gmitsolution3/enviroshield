import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AppRole = "user" | "admin";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getRequestSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function requireAuth(returnTo?: string) {
  const session = await getCurrentSession();

  if (!session) {
    const params = new URLSearchParams({
      notice: "login-required",
    });

    if (
      returnTo &&
      returnTo.startsWith("/") &&
      !returnTo.startsWith("//")
    ) {
      params.set("callbackUrl", returnTo);
    }

    redirect(`/login?${params.toString()}`);
  }

  return session;
}

export async function requireRole(role: AppRole) {
  const session = await requireAuth();

  const userRole = session.user.role ?? "user";

  if (userRole !== role) {
    redirect("/dashboard?notice=access-denied");
  }

  return session;
}