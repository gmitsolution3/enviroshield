import Container from "@/components/Container";

export default function ServiceBookingSuccessLoading() {
  return (
    <section className="min-h-[80vh] bg-mist/35 py-14 max-[600px]:py-9">
      <Container>
        <div
          role="status"
          aria-label="Loading your service booking confirmation"
          aria-busy="true"
          className="mx-auto max-w-[1080px]"
        >
          {/* Top breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="size-4 animate-pulse rounded bg-blue/20 motion-reduce:animate-none" />
            <div className="h-4 w-44 animate-pulse rounded bg-blue/15 motion-reduce:animate-none" />
          </div>

          {/* Hero Banner Card Skeleton */}
          <div className="overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_12px_36px_rgba(0,51,78,0.06)] sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                {/* Status pill skeleton */}
                <div className="h-7 w-36 animate-pulse rounded-full bg-emerald-100/70 motion-reduce:animate-none" />

                {/* Big heading skeleton */}
                <div className="mt-5 space-y-2.5">
                  <div className="h-10 w-3/4 max-w-md animate-pulse rounded-lg bg-navy/10 motion-reduce:animate-none" />
                  <div className="h-10 w-1/2 max-w-xs animate-pulse rounded-lg bg-blue/15 motion-reduce:animate-none" />
                </div>

                {/* Description skeleton */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full max-w-lg animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                  <div className="h-4 w-4/5 max-w-md animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                </div>

                {/* Action buttons skeleton */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="h-12 w-48 animate-pulse rounded-full bg-blue/20 motion-reduce:animate-none" />
                  <div className="h-12 w-40 animate-pulse rounded-full bg-ink/[0.08] motion-reduce:animate-none" />
                </div>
              </div>

              {/* Graphic icon skeleton */}
              <div className="flex flex-col items-center py-2">
                <div className="size-36 animate-pulse rounded-full border border-emerald-200/50 bg-emerald-50/70 p-6 sm:size-40 motion-reduce:animate-none">
                  <div className="size-full rounded-full bg-emerald-100/80" />
                </div>

                <div className="mt-5 h-16 w-full max-w-[320px] animate-pulse rounded-2xl border border-line bg-white motion-reduce:animate-none" />
              </div>
            </div>
          </div>

          {/* Details 2-Column Grid Skeleton */}
          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Booking Information Skeleton */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <div className="size-10 animate-pulse rounded-2xl bg-blue/10 motion-reduce:animate-none" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                    <div className="h-3 w-56 animate-pulse rounded bg-ink/[0.06] motion-reduce:animate-none" />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-line bg-[#fbfcfe] p-4"
                    >
                      <div className="h-3 w-24 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                      <div className="mt-2.5 h-6 w-32 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-mist/60 p-3.5">
                  <div className="h-4 w-48 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                  <div className="mt-1.5 h-3 w-36 animate-pulse rounded bg-ink/[0.06] motion-reduce:animate-none" />
                </div>
              </div>

              {/* Project Site Details Skeleton */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <div className="size-10 animate-pulse rounded-2xl bg-blue/10 motion-reduce:animate-none" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-44 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                    <div className="h-3 w-48 animate-pulse rounded bg-ink/[0.06] motion-reduce:animate-none" />
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Service Card Skeleton */}
              <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_8px_24px_rgba(0,51,78,0.03)]">
                <div className="h-44 w-full animate-pulse bg-mist/70 motion-reduce:animate-none" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-28 animate-pulse rounded bg-blue/15 motion-reduce:animate-none" />
                  <div className="h-5 w-48 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                  <div className="h-4 w-32 animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />
                </div>
              </div>

              {/* Next steps skeleton */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <div className="size-10 animate-pulse rounded-2xl bg-blue/10 motion-reduce:animate-none" />
                  <div className="h-4 w-36 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                </div>

                <div className="mt-5 space-y-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex gap-3">
                      <div className="size-6 shrink-0 animate-pulse rounded-full bg-blue/15 motion-reduce:animate-none" />
                      <div className="flex-1 space-y-1.5 pt-0.5">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                        <div className="h-3 w-full animate-pulse rounded bg-ink/[0.06] motion-reduce:animate-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subtle loading indicator */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
            <span className="size-1.5 animate-pulse rounded-full bg-blue/70 motion-reduce:animate-none" />
            <span className="text-xs text-ink/50">
              Loading service booking details...
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

