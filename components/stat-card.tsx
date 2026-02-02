"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ElementType } from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  description?: string
  icon: ElementType
  className?: string
  index?: number
}

export function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  className,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(212, 175, 55, 0.3)" }}
    >
      <Card className={cn("relative overflow-hidden card-hover", className)}>
        {/* Subtle gold gradient border on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            background: `linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.1) 50%, transparent 100%)`,
            padding: "1px",
            borderRadius: "inherit",
          }}
        >
          <div className="h-full w-full rounded-lg bg-background" />
        </motion.div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <motion.p
                className="text-sm font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {title}
              </motion.p>
              <motion.p
                className="text-3xl font-bold tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                {value}
              </motion.p>
              {(change !== undefined || description) && (
                <motion.div
                  className="flex items-center gap-2 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
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
                </motion.div>
              )}
            </div>
            <motion.div
              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
