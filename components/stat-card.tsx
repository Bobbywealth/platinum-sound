"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ElementType } from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  description?: string
  icon: ElementType
  className?: string
  index?: number
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  className,
  index = 0,
  onClick,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight text-gray-900">
              {value}
            </p>
            {(change !== undefined || description) && (
              <div className="flex items-center gap-2 mt-1">
                {change !== undefined && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change >= 0 ? "text-[#C4A77D]" : "text-red-500"
                    )}
                  >
                    {change >= 0 ? "+" : ""}{change}%
                  </span>
                )}
                {description && (
                  <span className="text-sm text-gray-500">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className="h-14 w-14 rounded-full bg-[#E8DCC8] flex items-center justify-center">
            <Icon className="h-6 w-6 text-[#8B7355]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
