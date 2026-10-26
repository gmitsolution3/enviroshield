export default function UsersDashboardLoader() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-xl border bg-background p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}