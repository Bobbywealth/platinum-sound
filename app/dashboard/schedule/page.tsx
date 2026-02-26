"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { bookings } from "@/lib/data"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SchedulePage() {
  // BUG #15 fixed: default to today's date instead of a hardcoded Jan 2024 date
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Studio Schedule</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage studio bookings and sessions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Booking</DialogTitle>
              <DialogDescription>
                Book a studio session
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduleClient">Client Name</Label>
                <Input id="scheduleClient" placeholder="Enter client name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleStudio">Studio</Label>
                <Input id="scheduleStudio" placeholder="Studio A or Studio B" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleDate">Date</Label>
                <Input id="scheduleDate" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleStart">Start Time</Label>
                <Input id="scheduleStart" type="time" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleEnd">End Time</Label>
                <Input id="scheduleEnd" type="time" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Schedule Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4">
        <Button variant="outline" size="icon" onClick={() => navigateDay(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm sm:text-lg font-semibold text-center flex-1 sm:flex-none sm:min-w-[300px]">
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
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-primary flex items-center gap-2">
              Studio A (Neve 88R)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {studioABookings.length > 0 ? (
              studioABookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border bg-card ${
                    booking.isVip ? "border-l-4 border-l-primary" : "border-l-4 border-l-blue-500"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <span className={`font-semibold text-base sm:text-lg ${booking.isVip ? "text-primary" : ""}`}>
                        {booking.clientName}
                      </span>
                      {booking.isVip && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full self-start">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-20">Session</span>
                      <span>{booking.sessionType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-20">Engineer</span>
                      <span>{booking.engineer}</span>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground italic">
                      {booking.notes}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "in-progress"
                          ? "bg-green-500/10 text-green-500"
                          : booking.status === "confirmed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        booking.status === "in-progress" ? "bg-green-500 animate-pulse" :
                        booking.status === "confirmed" ? "bg-blue-500" : "bg-yellow-500"
                      }`} />
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
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-primary flex items-center gap-2">
              Studio B (SSL 9000K)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {studioBBookings.length > 0 ? (
              studioBBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border bg-card ${
                    booking.isVip ? "border-l-4 border-l-primary" : "border-l-4 border-l-royal"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <span className={`font-semibold text-base sm:text-lg ${booking.isVip ? "text-primary" : ""}`}>
                        {booking.clientName}
                      </span>
                      {booking.isVip && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full self-start">
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-20">Session</span>
                      <span>{booking.sessionType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-20">Engineer</span>
                      <span>{booking.engineer}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "in-progress"
                          ? "bg-green-500/10 text-green-500"
                          : booking.status === "confirmed"
                          ? "bg-royal/10 text-royal"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        booking.status === "in-progress" ? "bg-green-500 animate-pulse" :
                        booking.status === "confirmed" ? "bg-royal" : "bg-yellow-500"
                      }`} />
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
        <CardHeader className="border-b">
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
                  <div className="text-sm font-medium text-primary">{booking.date}</div>
                  <div>
                    <div className="font-medium">{booking.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {booking.studio} | {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
                  <span className="text-sm text-muted-foreground">{booking.engineer}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-royal/10 text-royal"
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
