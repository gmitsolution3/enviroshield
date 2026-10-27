export default function CartLoader() {
  return (
    <div
      className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]"
      role="status"
      aria-label="Loading your cart"
    >
      {/* Cart items skeleton */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white px-6 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:px-4">
        <div className="flex items-center justify-between border-b border-line py-4">
          <div className="h-4 w-24 animate-pulse rounded-md bg-mist" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-mist" />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-4 border-b border-line py-5 last:border-b-0"
          >
            <div className="size-20 shrink-0 animate-pulse rounded-xl bg-mist max-[600px]:size-16" />

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-mist" />
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-mist" />
              <div className="h-3 w-1/3 animate-pulse rounded-md bg-mist" />
            </div>

            <div className="flex flex-col items-end justify-center gap-3">
              <div className="h-4 w-16 animate-pulse rounded-md bg-mist" />
              <div className="h-8 w-20 animate-pulse rounded-full bg-mist" />
            </div>
          </div>
        ))}
      </div>

      {/* Order summary skeleton */}
      <aside className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,51,78,0.06)] lg:sticky lg:top-28">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 animate-pulse place-items-center rounded-xl bg-mist">
            <div className="size-5 rounded-md bg-line" />
          </div>

          <div className="h-5 w-36 animate-pulse rounded-md bg-mist" />
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="h-4 w-20 animate-pulse rounded-md bg-mist" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-mist" />
          </div>

          <div className="flex items-start justify-between border-b border-line pb-4">
            <div className="h-4 w-16 animate-pulse rounded-md bg-mist" />
            <div className="h-8 w-28 animate-pulse rounded-md bg-mist" />
          </div>

          <div className="rounded-xl bg-mist/70 p-4">
            <div className="h-4 w-24 animate-pulse rounded-md bg-line" />
            <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-line" />
            <div className="mt-2 h-3 w-3/4 animate-pulse rounded-md bg-line" />
          </div>

          <div className="h-12 w-full animate-pulse rounded-full bg-mist" />

          <div className="mx-auto h-3 w-4/5 animate-pulse rounded-md bg-mist" />
        </div>
      </aside>

      <span className="sr-only">
        Loading your cart items and order summary…
      </span>
    </div>
  );
}