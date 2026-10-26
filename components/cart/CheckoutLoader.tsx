
export default function CheckoutLoader() {
  return (
    <div
      className="mt-8 grid animate-pulse items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      role="status"
      aria-label="Loading checkout"
    >
      {/* Checkout form Loader */}
      <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_10px_30px_rgba(0,51,78,0.04)] max-[600px]:p-5">
        <div className="h-6 w-48 rounded-md bg-mist" />
        <div className="mt-3 h-4 w-64 max-w-full rounded-md bg-mist" />

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div>
            <div className="h-4 w-28 rounded bg-mist" />
            <div className="mt-2 h-12 rounded-xl bg-mist" />
          </div>

          <div>
            <div className="h-4 w-28 rounded bg-mist" />
            <div className="mt-2 h-12 rounded-xl bg-mist" />
          </div>

          <div className="sm:col-span-2">
            <div className="h-4 w-32 rounded bg-mist" />
            <div className="mt-2 h-12 rounded-xl bg-mist" />
          </div>

          {["Area", "City", "District", "Postal code"].map(
            (field) => (
              <div key={field}>
                <div className="h-4 w-24 rounded bg-mist" />
                <div className="mt-2 h-12 rounded-xl bg-mist" />
              </div>
            ),
          )}

          <div className="sm:col-span-2">
            <div className="h-4 w-32 rounded bg-mist" />
            <div className="mt-2 h-12 rounded-xl bg-mist" />
          </div>

          <div className="sm:col-span-2">
            <div className="h-4 w-36 rounded bg-mist" />
            <div className="mt-2 h-24 rounded-xl bg-mist" />
          </div>
        </div>

        <div className="mt-7 h-12 rounded-full bg-mist" />
        <div className="mx-auto mt-4 h-3 w-64 max-w-full rounded bg-mist" />
      </div>

      {/* Order summary skeleton */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_rgba(0,51,78,0.06)]">
        <div className="h-6 w-40 rounded-md bg-mist" />

        <div className="mt-6 space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-4"
            >
              <div className="h-4 w-36 max-w-[65%] rounded bg-mist" />
              <div className="h-4 w-16 rounded bg-mist" />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <div className="flex justify-between">
            <div className="h-4 w-28 rounded bg-mist" />
            <div className="h-4 w-20 rounded bg-mist" />
          </div>

          <div className="mt-5 h-12 rounded-xl bg-mist" />
        </div>
      </div>

      <span className="sr-only">Loading checkout details…</span>
    </div>
  );
}