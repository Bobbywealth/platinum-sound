import { cn } from "@/lib/utils"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </div>
            <div className="mt-4">
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded mt-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-6 animate-pulse"
          >
            <div className="h-5 w-32 bg-muted rounded mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-16 bg-muted rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded ml-auto" />
      </div>
      <div className="rounded-md border">
        <div className="h-12 border-b bg-muted/50 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b last:border-0 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 animate-pulse">
      <div className="h-5 w-32 bg-muted rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-24 w-full bg-muted rounded" />
      </div>
      <div className="h-10 w-32 bg-muted rounded" />
    </div>
  )
}
