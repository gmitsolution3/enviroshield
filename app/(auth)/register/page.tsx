import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create your Enviroshield account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen">
      <RegisterForm callbackUrl={params.callbackUrl} />
    </main>
  );
}
