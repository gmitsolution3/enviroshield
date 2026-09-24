import { requireAuth } from "@/lib/auth-guards";

export default async function UserDashboardPage() {
  const session = await requireAuth();

  return (
    <div className="mx-auto w-full max-w-[1440px] p-6 sm:p-8 lg:p-10">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
          Workspace
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome back, {session.user.name}.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your Enviroshield workspace is ready.
        </p>
      </section>
    </div>
  );
}
