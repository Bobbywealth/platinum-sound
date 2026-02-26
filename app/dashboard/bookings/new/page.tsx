"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Clock, User, Calendar } from "lucide-react"
import Link from "next/link"

const timeSlots = [
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
  "8:00 PM - 9:00 PM",
  "9:00 PM - 10:00 PM",
  "10:00 PM - 11:00 PM",
]

const engineers = [
  "Noel Cadastre",
  "Young Guru",
  "Manny Marroquin",
  "Chris Lord-Alge",
  "Tony Maserati",
]

export default function NewBookingPage() {
  const [clientName, setClientName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedEngineer, setSelectedEngineer] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0, 1)) // January 2024

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const lastDay = new Date(year, month + 1, 0)
    return lastDay.getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isDateAvailable = (day: number) => {
    // For demo, make weekends unavailable
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dayOfWeek = date.getDay()
    return dayOfWeek !== 0 && dayOfWeek !== 6
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", {
      clientName,
      selectedDate,
      selectedStudio,
      selectedTime,
      selectedEngineer,
    })
  }

  return (
    <DashboardPageShell className="max-w-4xl mx-auto space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/dashboard/bookings">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">New Booking</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Book a studio session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              id="clientName"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button type="button" variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <Button type="button" variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-10" />
              ))}
              {/* Days */}
              {days.map((day) => {
                const available = isDateAvailable(day)
                const isSelected = selectedDate?.getDate() === day &&
                  selectedDate?.getMonth() === currentMonth.getMonth()

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                    className={`
                      h-10 w-full rounded-lg text-sm font-medium transition-colors
                      ${!available && "text-muted-foreground/50 cursor-not-allowed"}
                      ${available && !isSelected && "hover:bg-muted"}
                      ${isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted/50" />
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Studio Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Studio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedStudio("Studio A")}
                className={`
                  p-4 sm:p-6 rounded-lg border-2 transition-all text-left
                  ${selectedStudio === "Studio A"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <div className="font-semibold text-lg">Studio A</div>
                <div className="text-sm text-muted-foreground mt-1">Neve 88R</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-500">Available</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudio("Studio B")}
                className={`
                  p-4 sm:p-6 rounded-lg border-2 transition-all text-left
                  ${selectedStudio === "Studio B"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <div className="font-semibold text-lg">Studio B</div>
                <div className="text-sm text-muted-foreground mt-1">SSL 9000K</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-500">Available</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-colors
                    ${selectedTime === time
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engineer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Engineer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {engineers.map((engineer) => (
                <button
                  key={engineer}
                  type="button"
                  onClick={() => setSelectedEngineer(engineer)}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-colors text-left
                    ${selectedEngineer === engineer
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  {engineer}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link href="/dashboard/bookings" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="flex-1">
            Book Session
          </Button>
        </div>
      </form>
    </DashboardPageShell>
  )
}
