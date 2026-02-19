import { cn } from "@/lib/utils"
import * as React from "react"

type CalendarGridMode = "compact" | "scroll"

interface ResponsiveCalendarGridProps {
  weekdayHeader: React.ReactNode
  children: React.ReactNode
  className?: string
  mode?: CalendarGridMode
}

export function ResponsiveCalendarGrid({
  weekdayHeader,
  children,
  className,
  mode = "scroll",
}: ResponsiveCalendarGridProps) {
  const baseGrid = mode === "compact" ? "grid-cols-4 sm:grid-cols-7" : "grid-cols-7"

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn(mode === "scroll" && "overflow-x-auto")}>
        <div className={cn("min-w-[640px]", mode === "compact" && "min-w-0")}>
          <div className={cn("grid gap-1", baseGrid)}>{weekdayHeader}</div>
          <div className={cn("grid gap-1", baseGrid)}>{children}</div>
        </div>
      </div>
    </div>
  )
}
