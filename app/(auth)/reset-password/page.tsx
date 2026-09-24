import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create a new password
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Choose a new password for your Enviroshield account.
          </p>
        </div>

        <ResetPasswordForm
          token={params.token}
          initialError={
            params.error === "INVALID_TOKEN"
              ? "This password reset link is invalid or has expired."
              : null
          }
        />

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}