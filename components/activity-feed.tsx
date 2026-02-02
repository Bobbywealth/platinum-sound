"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Music,
    UserPlus,
} from "lucide-react"
import { useEffect, useState } from "react"

export interface ActivityItem {
  id: string
  type: "booking" | "check_in" | "check_out" | "client_added" | "payment" | "reminder"
  title: string
  description: string
  time: string
  isRead?: boolean
  metadata?: {
    studio?: string
    client?: string
    amount?: string
  }
}

interface ActivityFeedProps {
  activities?: ActivityItem[]
  maxItems?: number
  showHeader?: boolean
}

const activityIcons = {
  booking: Calendar,
  check_in: CheckCircle,
  check_out: Clock,
  client_added: UserPlus,
  payment: Music,
  reminder: AlertCircle,
}

const activityColors = {
  booking: "bg-blue-500",
  check_in: "bg-green-500",
  check_out: "bg-gray-500",
  client_added: "bg-purple-500",
  payment: "bg-yellow-500",
  reminder: "bg-orange-500",
}

const activityBgColors = {
  booking: "bg-blue-500/10",
  check_in: "bg-green-500/10",
  check_out: "bg-gray-500/10",
  client_added: "bg-purple-500/10",
  payment: "bg-yellow-500/10",
  reminder: "bg-orange-500/10",
}

export function ActivityFeed({
  activities = [],
  maxItems = 5,
  showHeader = true,
}: ActivityFeedProps) {
  const [items, setItems] = useState<ActivityItem[]>(activities)
  const [isExpanded, setIsExpanded] = useState(false)

  // Demo activities if none provided
  useEffect(() => {
    if (activities.length === 0) {
      const demoActivities: ActivityItem[] = [
        {
          id: "1",
          type: "booking",
          title: "New Booking",
          description: "Drake booked Studio A for 6 hours",
          time: "2 minutes ago",
          metadata: { studio: "Studio A", client: "Drake" },
        },
        {
          id: "2",
          type: "check_in",
          title: "Client Check-in",
          description: "Rihanna has checked in for her session",
          time: "15 minutes ago",
          metadata: { studio: "Studio B", client: "Rihanna" },
        },
        {
          id: "3",
          type: "payment",
          title: "Payment Received",
          description: "Payment of $1,500 received for booking",
          time: "1 hour ago",
          metadata: { amount: "$1,500" },
        },
        {
          id: "4",
          type: "client_added",
          title: "New Client",
          description: "Kendrick Lamar added to your client list",
          time: "2 hours ago",
          metadata: { client: "Kendrick Lamar" },
        },
        {
          id: "5",
          type: "reminder",
          title: "Session Reminder",
          description: "Upcoming session in Studio A in 30 minutes",
          time: "30 minutes ago",
          metadata: { studio: "Studio A" },
        },
      ]
      setItems(demoActivities)
    }
  }, [activities])

  const displayedItems = isExpanded ? items : items.slice(0, maxItems)
  const unreadCount = items.filter((item) => !item.isRead).length

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Activity Feed</h3>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full"
              >
                {unreadCount} new
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? "Show less" : "Show all"}
          </button>
        </div>
      )}

      <div className="divide-y">
        <AnimatePresence mode="popLayout">
          {displayedItems.map((activity, index) => {
            const Icon = activityIcons[activity.type]
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ backgroundColor: "rgba(var(--muted), 0.5)" }}
                className={cn(
                  "p-4 cursor-pointer flex items-start gap-3",
                  !activity.isRead && "bg-muted/30"
                )}
              >
                <motion.div
                  className={cn(
                    "p-2 rounded-full shrink-0",
                    activityBgColors[activity.type]
                  )}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon
                    className={cn("h-4 w-4", `text-${activityColors[activity.type].replace("bg-", "")}`)}
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                  {activity.metadata && (
                    <div className="flex items-center gap-2 mt-1">
                      {activity.metadata.studio && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {activity.metadata.studio}
                        </span>
                      )}
                      {activity.metadata.client && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                          {activity.metadata.client}
                        </span>
                      )}
                      {activity.metadata.amount && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded">
                          {activity.metadata.amount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!activity.isRead && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"
                  />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {items.length > maxItems && !isExpanded && (
        <div className="p-3 border-t bg-muted/30">
          <p className="text-sm text-center text-muted-foreground">
            {items.length - maxItems} more activities...
          </p>
        </div>
      )}
    </div>
  )
}

// Compact activity notification for dashboard cards
export function ActivityNotification({
  activity,
  onDismiss,
}: {
  activity: ActivityItem
  onDismiss?: () => void
}) {
  const Icon = activityIcons[activity.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <div className="flex items-start gap-3 p-4 rounded-lg border bg-card shadow-lg">
        <motion.div
          className={cn("p-2 rounded-full", activityBgColors[activity.type])}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <Icon className="h-4 w-4" />
        </motion.div>

        <div className="flex-1">
          <p className="font-medium text-sm">{activity.title}</p>
          <p className="text-sm text-muted-foreground">
            {activity.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Animated timeline for session history
export function ActivityTimeline({
  activities,
}: {
  activities: ActivityItem[]
}) {
  return (
    <div className="relative pl-4 border-l-2 border-muted ml-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type]
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 relative"
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute -left-[25px] p-1.5 rounded-full border-2 border-background",
                activityBgColors[activity.type]
              )}
            >
              <Icon className="h-3 w-3" />
            </div>

            {/* Content */}
            <div className="ml-4">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
