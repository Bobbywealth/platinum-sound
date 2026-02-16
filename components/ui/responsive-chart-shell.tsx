import { cn } from "@/lib/utils"
import * as React from "react"

interface ResponsiveChartShellProps {
  children: React.ReactNode
  legend?: React.ReactNode
  className?: string
  chartClassName?: string
  legendClassName?: string
}

export function ResponsiveChartShell({
  children,
  legend,
  className,
  chartClassName,
  legendClassName,
}: ResponsiveChartShellProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("h-56 sm:h-64 lg:h-72", chartClassName)}>{children}</div>
      {legend ? (
        <div className={cn("flex flex-wrap items-center gap-2 text-xs text-muted-foreground", legendClassName)}>
          {legend}
        </div>
      ) : null}
    </div>
  )
}
