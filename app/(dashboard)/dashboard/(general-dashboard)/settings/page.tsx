import { requireAuth } from "@/lib/auth-guards";
import { AdminSettingsManager } from "@/components/dashboard/admin/settings/AdminSettingsManager";

export default async function SettingsPage() {
  const session = await requireAuth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo">
          {isAdmin ? "Administration" : "Account"}
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {isAdmin
            ? "Configure website search engine optimization, analytics measurement, conversion advertising, and visitor tracking consent."
            : "Manage your account preferences and application settings."}
        </p>
      </section>

      <AdminSettingsManager isAdmin={isAdmin} />
    </div>
  );
}
