"use client"

import { ElementType } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  description?: string
  icon: ElementType
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {(change !== undefined || description) && (
              <div className="flex items-center gap-2 mt-1">
                {change !== undefined && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {change >= 0 ? "+" : ""}{change}%
                  </span>
                )}
                {description && (
                  <span className="text-sm text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
