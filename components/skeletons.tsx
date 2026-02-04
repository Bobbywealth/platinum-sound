"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-4 w-4 rounded-full" />
              </div>
              <div className="mt-4">
                <Shimmer className="h-8 w-32" />
                <Shimmer className="h-3 w-16 mt-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className="rounded-lg border bg-card p-6">
              <Shimmer className="h-5 w-32 mb-4" />
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <Shimmer key={j} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Shimmer className="h-10 w-64" />
        <Shimmer className="h-10 w-32 ml-auto" />
      </div>
      <div className="rounded-md border">
        <div className="h-12 border-b flex items-center px-4">
          <Shimmer className="h-4 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="h-16 border-b last:border-0 flex items-center px-4"
          >
            <Shimmer className="h-4 w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <Shimmer className="h-5 w-32 mb-4" />
      <div className="space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-24 w-full" />
      </div>
      <Shimmer className="h-10 w-32" />
    </div>
  )
}

// Waveform-shaped shimmer for studio-related loading
export function WaveformSkeleton({ bars = 20 }: { bars?: number }) {
  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary/30 rounded-full"
          animate={{
            height: [8, 24, 12, 32, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          style={{ minHeight: 8 }}
        />
      ))}
    </div>
  )
}

// Pulse circle for recording status loading
export function RecordingSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-3 h-3 bg-red-500 rounded-full"
        animate={{
          opacity: [1, 0.4, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="text-sm font-medium text-red-500"
        animate={{
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        REC
      </motion.span>
    </div>
  )
}

// Shimmer component with animation
function Shimmer({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded bg-muted", className)}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />
    </motion.div>
  )
}

// Circular progress skeleton
export function CircularProgressSkeleton({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted"
        />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
          strokeDasharray="80, 120"
          animate={{
            strokeDasharray: ["0, 120", "80, 40", "0, 120"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      </svg>
    </motion.div>
  )
}

// Activity feed skeleton
export function ActivityFeedSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-4 w-16" />
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: items }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 flex items-start gap-3"
          >
            <Shimmer className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Sidebar skeleton for navigation loading states
export function SidebarSkeleton() {
  const sections = [
    { title: "DASHBOARD", items: 1 },
    { title: "OPERATIONS", items: 4 },
    { title: "FINANCE", items: 3 },
    { title: "MARKETING", items: 1 },
    { title: "PEOPLE", items: 2 },
    { title: "SYSTEM", items: 1 },
  ]

  return (
    <div className="flex flex-col h-full bg-white w-64 border-r">
      {/* Logo skeleton */}
      <div className="p-6 pb-6">
        <div className="flex items-center justify-center">
          <Shimmer className="h-12 w-36" />
        </div>
      </div>

      {/* Navigation skeleton */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="px-3 mb-2">
                <Shimmer className="h-3 w-16" />
              </h3>
              <div className="space-y-1">
                {Array.from({ length: section.items }).map((_, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    <Shimmer className="h-5 w-5 rounded" />
                    <Shimmer className="h-4 w-20" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  )
}
