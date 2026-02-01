"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

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
