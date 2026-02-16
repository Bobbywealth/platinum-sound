"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveCalendarGrid } from "@/components/ui/responsive-calendar-grid"
import { bookings } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
    Calendar,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    LayoutGrid,
    List,
    Mic2,
    Plus,
    User
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type ViewMode = "grid" | "list" | "calendar"

export default function BookingsPage() {
  const [filter, setFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)) // January 2024

  const filteredBookings = filter === "all"
    ? bookings
    : bookings.filter((b) => b.status === filter)

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getBookingsForDate = (date: number) => {
    const dateStr = `2024-01-${String(date).padStart(2, "0")}`
    return filteredBookings.filter((b) => b.date === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="space-y-6 bg-[#FAFAF8] min-h-screen p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">Manage studio session bookings</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dashboard/bookings/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New Booking</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("confirmed")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <div className="w-2 h-2 rounded-full bg-royal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal">{stats.confirmed}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("pending")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("in-progress")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.inProgress}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {["all", "confirmed", "pending", "in-progress", "completed"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
          </Button>
        ))}
      </div>

      {/* Content based on view mode */}
      {viewMode === "grid" && (
        /* Grid View */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className={cn(
                "hover:border-primary/50 transition-colors",
                booking.isVip && "border-primary/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className={booking.isVip ? "text-primary" : ""}>
                      {booking.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{booking.studio}</p>
                  </div>
                  {booking.isVip && (
                    <Badge variant="warning">VIP</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.engineer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mic2 className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.sessionType}</span>
                </div>
                {booking.notes && (
                  <p className="text-xs text-muted-foreground italic border-t pt-2">
                    {booking.notes}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "info"
                        : booking.status === "in-progress"
                        ? "success"
                        : booking.status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 overflow-x-auto">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {booking.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{booking.clientName}</p>
                        {booking.isVip && <Badge variant="warning" className="text-xs">VIP</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.studio} • {booking.sessionType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-end">
                    <div className="text-center">
                      <p className="text-sm font-medium">{booking.date}</p>
                      <p className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{booking.engineer}</p>
                      <p className="text-xs text-muted-foreground">Engineer</p>
                    </div>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "info"
                          : booking.status === "in-progress"
                          ? "success"
                          : booking.status === "pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "calendar" && (
        /* Calendar View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(2024, 0, 15))}>
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveCalendarGrid
              weekdayHeader={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2">
                  <span className="sm:hidden">{day[0]}</span>
                  <span className="hidden sm:inline">{day}</span>
                </div>
              ))}
            >
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-20 sm:h-24 p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayBookings = getBookingsForDate(day)
                const isToday = day === 15 // For demo, mark day 15 as today
                return (
                  <div
                    key={day}
                    className={cn(
                      "h-20 sm:h-24 p-1 border rounded-lg transition-colors",
                      isToday && "border-primary bg-primary/5",
                      dayBookings.length > 0 && "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "text-xs font-medium mb-1",
                      isToday && "text-primary"
                    )}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            "text-xs p-1 rounded truncate",
                            booking.status === "confirmed" && "bg-royal/10 text-royal",
                            booking.status === "in-progress" && "bg-green-500/10 text-green-600",
                            booking.status === "pending" && "bg-yellow-500/10 text-yellow-600"
                          )}
                        >
                          <span className="font-medium">{booking.startTime}</span> {booking.clientName}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </ResponsiveCalendarGrid>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-royal/20" />
                <span className="text-xs text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/20" />
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500/20" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
