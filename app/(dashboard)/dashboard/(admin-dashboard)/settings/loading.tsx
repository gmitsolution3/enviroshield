import { SettingsSkeleton } from "@/components/dashboard/admin/settings/SettingsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="space-y-3">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-9 w-48 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded" />
      </section>

      <SettingsSkeleton />
    </div>
  );
}

