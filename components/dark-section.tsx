"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface DarkSectionProps {
  children: ReactNode
  className?: string
}

export function DarkSection({ children, className }: DarkSectionProps) {
  return (
    <div className={cn("rounded-xl bg-gray-900 text-white p-8", className)}>
      {children}
    </div>
  )
}
