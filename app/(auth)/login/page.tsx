import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Enviroshield account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen">
      <LoginForm callbackUrl={params.callbackUrl} />
    </main>
  );
}
