"use client"

export interface ActivityItem {
  id: string
  type: "booking" | "check_in" | "check_out" | "client_added" | "payment" | "reminder"
  title: string
  description: string
  time: string
}

interface ActivityFeedProps {
  activities?: ActivityItem[]
  maxItems?: number
  showHeader?: boolean
}

export function ActivityFeed({ activities = [], maxItems = 5, showHeader = true }: ActivityFeedProps) {
  const displayedItems = activities.slice(0, maxItems)

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {showHeader && <div className="p-4 border-b"><h3 className="font-semibold">Activity Feed</h3></div>}
      <div className="p-4">
        {displayedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          displayedItems.map((activity) => <p key={activity.id} className="text-sm">{activity.title}: {activity.description}</p>)
        )}
      </div>
    </div>
  )
}
