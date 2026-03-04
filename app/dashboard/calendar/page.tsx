"use client"

import { useEffect, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { MasterCalendar } from "@/components/master-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Booking {
  id: string
  clientName: string
  date: string
  startTime: string
  endTime: string
  studio: string
  sessionType: string
  status: string
  engineer: string
}

interface Room {
  id: string
  name: string
  status: string
}

interface Engineer {
  id: string
  name: string
  isAvailable?: boolean
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then(r => r.ok ? r.json() : []),
      fetch('/api/rooms').then(r => r.ok ? r.json() : []),
      fetch('/api/engineers').then(r => r.ok ? r.json() : []),
    ]).then(([bookingsData, roomsData, engineersData]) => {
      setBookings(bookingsData)
      setRooms(roomsData)
      setEngineers(engineersData)
      setLoading(false)
    })
  }, [])

  const formattedBookings = bookings.map(b => ({
    ...b,
    date: new Date(b.date),
  }))

  if (loading) {
    return (
      <DashboardPageShell className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardPageShell>
    )
  }

  return (
    <DashboardPageShell className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Master calendar view of all bookings, rooms, and engineer schedules.</p>
      </div>
      
      <MasterCalendar
        bookings={formattedBookings}
        rooms={rooms}
        engineers={engineers}
      />

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings found.</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{b.clientName || 'Unknown Client'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.date).toLocaleDateString()} • {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{b.studio}</p>
                    <p className="text-xs text-muted-foreground">{b.engineer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
