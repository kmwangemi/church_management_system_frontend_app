export default function SpiritualJourneyLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...new Array(4)].map((_, i) => (
          <div className="rounded-lg border bg-background p-6" key={i}>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-secondary" />
              <div>
                <div className="h-6 w-12 animate-pulse rounded bg-secondary" />
                <div className="mt-1 h-4 w-20 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex w-96 space-x-1 rounded-lg bg-muted p-1">
        <div className="h-8 w-20 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-28 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-20 animate-pulse rounded bg-secondary" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
          <div className="h-9 w-24 animate-pulse rounded bg-secondary" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...new Array(4)].map((_, i) => (
            <div className="space-y-4 rounded-lg border bg-background p-6" key={i}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-5 w-32 animate-pulse rounded bg-secondary" />
                  <div className="mt-2 h-4 w-16 animate-pulse rounded bg-secondary" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded bg-secondary" />
              </div>
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              <div>
                <div className="h-2 w-full animate-pulse rounded bg-secondary" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 animate-pulse rounded bg-secondary" />
                <div className="h-8 w-16 animate-pulse rounded bg-secondary" />
                <div className="h-8 w-24 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
