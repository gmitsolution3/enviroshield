import { LoginForm } from "@/components/auth/LoginForm";

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