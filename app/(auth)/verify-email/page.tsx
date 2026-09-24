import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold">
          Verify your email
        </h1>

        <p className="mt-4 text-muted-foreground">
          We sent a verification link to your email
          address.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please check your inbox and click the link
          to activate your account.
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="font-medium underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}