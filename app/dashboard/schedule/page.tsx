"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { bookings } from "@/lib/data"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // Mock current date

  const studioABookings = bookings.filter((b) => b.studio === "Studio A")
  const studioBBookings = bookings.filter((b) => b.studio === "Studio B")

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Studio Schedule</h2>
          <p className="text-muted-foreground">Manage studio bookings and sessions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigateDay(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold min-w-[300px] text-center">
          {formatDate(currentDate)}
        </h3>
        <Button variant="outline" size="icon" onClick={() => navigateDay(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Studio Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Studio A */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary">Studio A (Neve 88R)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {studioABookings.length > 0 ? (
              studioABookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border-l-4 bg-muted/50 ${
                    booking.isVip ? "border-l-primary" : "border-l-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold ${booking.isVip ? "text-primary" : ""}`}>
                      {booking.clientName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {booking.sessionType}
                  </div>
                  <div className="text-sm">
                    Engineer: {booking.engineer}
                  </div>
                  {booking.notes && (
                    <div className="text-xs text-muted-foreground mt-2 italic">
                      {booking.notes}
                    </div>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "in-progress"
                          ? "bg-green-500/10 text-green-500"
                          : booking.status === "confirmed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      <span className="status-dot status-active mr-2" />
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No bookings for Studio A today
              </div>
            )}
          </CardContent>
        </Card>

        {/* Studio B */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary">Studio B (SSL 9000K)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {studioBBookings.length > 0 ? (
              studioBBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border-l-4 bg-muted/50 ${
                    booking.isVip ? "border-l-primary" : "border-l-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold ${booking.isVip ? "text-primary" : ""}`}>
                      {booking.clientName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {booking.sessionType}
                  </div>
                  <div className="text-sm">
                    Engineer: {booking.engineer}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "in-progress"
                          ? "bg-green-500/10 text-green-500"
                          : booking.status === "confirmed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No bookings for Studio B today
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-primary">{booking.date}</div>
                  <div>
                    <div className="font-medium">{booking.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.studio} | {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{booking.engineer}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-blue-500/10 text-blue-500"
                        : booking.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
