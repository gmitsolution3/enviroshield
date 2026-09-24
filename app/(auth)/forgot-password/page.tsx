import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Forgot your password?
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link to
            reset your password.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}