"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronLeft, ChevronRight, Clock, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useToast } from "@/hooks/use-toast"

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

export default function BookingPage() {
  const [clientName, setClientName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const router = useRouter()
  const { toast } = useToast()

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
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dayOfWeek = date.getDay()
    return dayOfWeek !== 0 && dayOfWeek !== 6
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    toast({
      title: "Booking Request Submitted!",
      description: "A member of our team will reach out to you shortly.",
    })
    
    // Reset form
    setClientName("")
    setSelectedDate(null)
    setSelectedStudio(null)
    setSelectedTime(null)
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      router.push("/")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/Platinum Sound logo with 3D effect.png"
                alt="Platinum Sound Logo"
                width={360}
                height={80}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Enter CRM</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Book a Session</h1>
            <p className="text-muted-foreground text-lg">
              Schedule your recording session at Platinum Sound Studios
            </p>
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
                  placeholder="Enter your name or artist name"
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
                      p-6 rounded-lg border-2 transition-all text-left
                      ${selectedStudio === "Studio A"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <div className="font-semibold text-lg">Studio A</div>
                    <div className="text-sm text-muted-foreground mt-1">Neve 88R Console</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Our flagship room featuring a legendary Neve 88R console, perfect for tracking, mixing, and immersive audio experiences.
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-green-500">Available</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudio("Studio B")}
                    className={`
                      p-6 rounded-lg border-2 transition-all text-left
                      ${selectedStudio === "Studio B"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <div className="font-semibold text-lg">Studio B</div>
                    <div className="text-sm text-muted-foreground mt-1">SSL 9000K Console</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      A mixing powerhouse with the iconic SSL 9000K, delivering the punch and clarity that defined countless hit records.
                    </div>
                    <div className="flex items-center gap-2 mt-3">
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
                <div className="grid grid-cols-3 gap-2">
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

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full text-lg">
              Submit Booking Request
            </Button>

            {/* Contact Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Need assistance? Contact us directly:</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a href="tel:212-265-6060" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                  212-265-6060
                </a>
                <a href="mailto:info@platinumsoundny.com" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  info@platinumsoundny.com
                </a>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>Platinum Sound Studios | 122 W. 26th St., New York, NY 10001</p>
          <p className="mt-1">Open 24/7 for Sessions</p>
        </div>
      </footer>
    </div>
  )
}
