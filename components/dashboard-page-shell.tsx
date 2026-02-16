import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DashboardPageShellProps {
  children: ReactNode
  className?: string
}

export function DashboardPageShell({ children, className }: DashboardPageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#FAFAF8] space-y-6 px-4 py-4 sm:px-6 sm:py-6",
        className,
      )}
    >
      {children}
    </div>
  )
}
