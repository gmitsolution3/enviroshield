import Container from "@/components/Container";

export default function CheckoutSuccessLoading() {
  return (
    <section className="min-h-[70vh] bg-mist/30 py-12 sm:py-16">
      <Container>
        <div
          role="status"
          aria-label="Loading your order confirmation"
          aria-busy="true"
          className="mx-auto max-w-5xl"
        >
          {/* Page heading */}
          <div className="mb-8 border-b border-line pb-7 sm:mb-10">
            <div className="mb-5 flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue/60" />
              <div className="h-2.5 w-24 animate-pulse rounded-full bg-blue/15 motion-reduce:animate-none" />
            </div>

            <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-navy/10 motion-reduce:animate-none sm:h-10 sm:w-80" />

            <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            {/* Main order details */}
            <div className="space-y-6">
              {/* Order information */}
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="flex items-center justify-between border-b border-line bg-[#f8faff] px-5 py-4 sm:px-6">
                  <div className="h-4 w-32 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-blue/[0.08] motion-reduce:animate-none" />
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                  <div>
                    <div className="mb-3 h-3 w-20 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                    <div className="h-5 w-36 animate-pulse rounded bg-blue/10 motion-reduce:animate-none" />
                  </div>

                  <div>
                    <div className="mb-3 h-3 w-24 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                    <div className="h-5 w-28 animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />
                  </div>
                </div>
              </div>

              {/* Delivery information */}
              <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="h-4 w-36 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                  <div className="size-8 animate-pulse rounded-xl bg-blue/[0.07] motion-reduce:animate-none" />
                </div>

                <div className="flex gap-4">
                  <div className="size-11 shrink-0 animate-pulse rounded-xl bg-blue/[0.08] motion-reduce:animate-none" />

                  <div className="min-w-0 flex-1 space-y-3 pt-1">
                    <div className="h-3.5 w-2/5 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />
                    <div className="h-3 w-3/5 animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />
                  </div>
                </div>
              </div>

              {/* Purchased items */}
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="border-b border-line bg-[#f8faff] px-5 py-4 sm:px-6">
                  <div className="h-4 w-28 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                </div>

                <div className="divide-y divide-line px-5 sm:px-6">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 py-5"
                    >
                      <div className="size-[76px] shrink-0 animate-pulse rounded-xl border border-line bg-mist/70 motion-reduce:animate-none" />

                      <div className="min-w-0 flex-1 py-1">
                        <div className="h-4 w-3/4 max-w-56 animate-pulse rounded bg-navy/[0.09] motion-reduce:animate-none" />

                        <div className="mt-3 h-3 w-24 animate-pulse rounded bg-ink/[0.07] motion-reduce:animate-none" />

                        <div className="mt-4 h-3 w-16 animate-pulse rounded bg-blue/10 motion-reduce:animate-none" />
                      </div>

                      <div className="hidden pt-1 sm:block">
                        <div className="h-4 w-20 animate-pulse rounded bg-ink/10 motion-reduce:animate-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <aside className="overflow-hidden rounded-2xl border border-line bg-white lg:sticky lg:top-24">
              <div className="border-b border-line bg-[#f8faff] px-5 py-4">
                <div className="h-4 w-32 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
              </div>

              <div className="space-y-5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                  <div className="h-3 w-16 animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                  <div className="h-3 w-12 animate-pulse rounded bg-ink/[0.08] motion-reduce:animate-none" />
                </div>

                <div className="border-t border-dashed border-line pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-navy/10 motion-reduce:animate-none" />
                    <div className="h-6 w-28 animate-pulse rounded bg-blue/15 motion-reduce:animate-none" />
                  </div>
                </div>

                <div className="h-12 w-full animate-pulse rounded-xl bg-blue/10 motion-reduce:animate-none" />

                <div className="mx-auto h-3 w-40 animate-pulse rounded bg-ink/[0.06] motion-reduce:animate-none" />
              </div>
            </aside>
          </div>

          {/* Subtle loading indicator */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
            <span className="size-1.5 animate-pulse rounded-full bg-blue/70 motion-reduce:animate-none" />
            <span className="text-xs text-ink/45">
              Loading order details…
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}