import { cn } from "@/lib/utils"
import * as React from "react"

interface ResponsiveTableShellProps {
  children: React.ReactNode
  className?: string
  tableMinWidthClassName?: string
  stickyFirstColumn?: boolean
}

export function ResponsiveTableShell({
  children,
  className,
  tableMinWidthClassName = "min-w-[700px]",
  stickyFirstColumn = false,
}: ResponsiveTableShellProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-white", className)}>
      <div className="overflow-x-auto">
        <div
          className={cn(
            tableMinWidthClassName,
            stickyFirstColumn && "[&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-10 [&_td:first-child]:bg-white [&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-20 [&_th:first-child]:bg-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
