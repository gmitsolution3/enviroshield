import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <section className="container mx-auto px-5 py-8 lg:px-0">
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />

        <div className="h-4 w-96 animate-pulse rounded bg-muted" />

        <Card className="mt-8 overflow-hidden p-0">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
