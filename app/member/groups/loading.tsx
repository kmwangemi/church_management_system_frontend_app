export default function SmallGroupsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex w-96 space-x-1 rounded-lg bg-muted p-1">
        <div className="h-8 w-32 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-32 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-32 animate-pulse rounded bg-secondary" />
      </div>

      {/* Search and filters skeleton */}
      <div className="rounded-lg border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-10 w-full animate-pulse rounded bg-secondary" />
          </div>
          <div>
            <div className="mb-2 h-4 w-16 animate-pulse rounded bg-secondary" />
            <div className="h-10 w-full animate-pulse rounded bg-secondary" />
          </div>
          <div>
            <div className="mb-2 h-4 w-20 animate-pulse rounded bg-secondary" />
            <div className="h-10 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>

      {/* Groups grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...new Array(6)].map((_, i) => (
          <div className="space-y-4 rounded-lg border bg-background p-6" key={i}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
                <div className="mt-2 h-5 w-20 animate-pulse rounded bg-secondary" />
              </div>
              <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-secondary" />
              <div>
                <div className="h-4 w-20 animate-pulse rounded bg-secondary" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-secondary" />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 flex-1 animate-pulse rounded bg-secondary" />
              <div className="h-8 w-8 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
