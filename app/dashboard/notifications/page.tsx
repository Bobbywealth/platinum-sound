"use client"

import { useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Notification { id: string; message: string; createdAt: string }

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([])

  return (
    <DashboardPageShell>
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent>
          {notifications.length === 0 ? <p className="text-muted-foreground">No notifications yet.</p> : notifications.map(n => <p key={n.id}>{n.message}</p>)}
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
