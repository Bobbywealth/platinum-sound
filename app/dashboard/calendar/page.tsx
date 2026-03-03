"use client"

import { useEffect, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Booking = { id: string; date: string; startTime: string; endTime: string; studio: string; engineer: string; client: { name: string } }

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    fetch('/api/bookings').then(r => (r.ok ? r.json() : [])).then(setBookings)
  }, [])

  return (
    <DashboardPageShell className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Live booking schedule from the database.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Bookings</CardTitle></CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <p key={b.id}>{new Date(b.date).toLocaleDateString()} • {b.client?.name ?? 'Unknown'} • {b.studio} • {b.startTime}-{b.endTime} • {b.engineer}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
