"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, User, Music } from "lucide-react"

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
  const [view, setView] = useState<"studio" | "timeline">("studio")

  useEffect(() => {
    const start = new Date(currentDate)
    start.setHours(0, 0, 0, 0)
    const end = new Date(currentDate)
    end.setHours(23, 59, 59, 999)
    fetch(`/api/bookings?startDate=${start.toISOString()}&endDate=${end.toISOString()}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setBookings)
  }, [currentDate])

  const studios = useMemo(() => {
    const unique = [...new Set(bookings.map(b => b.studio))]
    return unique.length > 0 ? unique : ["STUDIO_A", "STUDIO_B"]
  }, [bookings])

  const bookingsByStudio = useMemo(() => {
    return studios.reduce((acc, studio) => {
      acc[studio] = bookings
        .filter(b => b.studio === studio)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
      return acc
    }, {} as Record<string, Booking[]>)
  }, [bookings, studios])

  const goToPrevDay = () => setCurrentDate(new Date(currentDate.getTime() - 86400000))
  const goToNextDay = () => setCurrentDate(new Date(currentDate.getTime() + 86400000))
  const goToToday = () => setCurrentDate(new Date())

  const isToday = currentDate.toDateString() === new Date().toDateString()

  return (
    <DashboardPageShell className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daily Schedule</h1>
          <p className="text-muted-foreground">View bookings by studio for each day</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} disabled={isToday}>
            Today
          </Button>
          <div className="flex items-center border rounded-lg">
            <Button variant="ghost" size="icon" onClick={goToPrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium min-w-[120px] text-center">
              {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <Button variant="ghost" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No bookings scheduled for this day.</p>
            <p className="text-sm text-muted-foreground mt-1">Select a different date or add new bookings.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {studios.map(studio => (
            <Card key={studio} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  {studio.replace('_', ' ')}
                  <Badge variant="outline" className="ml-auto">
                    {bookingsByStudio[studio]?.length || 0} sessions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingsByStudio[studio]?.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No bookings for this studio
                  </div>
                ) : (
                  <div className="divide-y">
                    {bookingsByStudio[studio]?.map(booking => (
                      <div key={booking.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {booking.startTime} - {booking.endTime}
                              </span>
                              {booking.isVip && (
                                <Badge variant="secondary" className="text-xs">VIP</Badge>
                              )}
                            </div>
                            <p className="font-semibold">{booking.client?.name || 'Unknown Client'}</p>
                            <p className="text-sm text-muted-foreground">{booking.sessionType || 'Recording Session'}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              {booking.engineer}
                            </div>
                            <Badge 
                              variant={booking.status === 'CONFIRMED' ? 'default' : 'outline'}
                              className="mt-1 text-xs"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
