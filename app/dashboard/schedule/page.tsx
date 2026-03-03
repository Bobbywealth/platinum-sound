"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Booking = {
  id: string
  studio: string
  startTime: string
  endTime: string
  sessionType: string
  engineer: string
  status: string
  isVip: boolean
  client: { name: string }
  date: string
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const start = new Date(currentDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(currentDate)
    end.setHours(23, 59, 59, 999)
    fetch(`/api/bookings?startDate=${start.toISOString()}&endDate=${end.toISOString()}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setBookings)
  }, [currentDate])

  const studioABookings = useMemo(() => bookings.filter((b) => b.studio === "STUDIO_A"), [bookings])
  const studioBBookings = useMemo(() => bookings.filter((b) => b.studio === "STUDIO_B"), [bookings])

  return (
    <DashboardPageShell className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Studio Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getTime() - 86400000))}><ChevronLeft className="h-4 w-4" /></Button>
          <span>{currentDate.toLocaleDateString()}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getTime() + 86400000))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Studio A</CardTitle></CardHeader><CardContent>{studioABookings.length === 0 ? 'No bookings for Studio A today' : studioABookings.map(b => <p key={b.id}>{b.client.name} • {b.startTime}-{b.endTime}</p>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Studio B</CardTitle></CardHeader><CardContent>{studioBBookings.length === 0 ? 'No bookings for Studio B today' : studioBBookings.map(b => <p key={b.id}>{b.client.name} • {b.startTime}-{b.endTime}</p>)}</CardContent></Card>
      </div>
    </DashboardPageShell>
  )
}
