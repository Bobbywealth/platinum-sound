"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Mail, Music, Phone, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

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

// Helper function to check if selected slots are consecutive
const areSlotsConsecutive = (slots: string[]): boolean => {
  if (slots.length === 0 || slots.length === 1) return true
  const indices = slots.map((slot) => timeSlots.indexOf(slot))
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) return false
  }
  return true
}

// Helper function to get formatted time range from selected slots
const getFormattedTimeRange = (slots: string[]): string => {
  if (slots.length === 0) return ""
  if (slots.length === 1) return slots[0]
  const startTime = slots[0].split(" - ")[0]
  const endTime = slots[slots.length - 1].split(" - ")[1]
  return `${startTime} - ${endTime}`
}

// Helper function to get duration in hours
const getDuration = (slots: string[]): number => {
  return slots.length
}
// #endregion

export default function BookingPage() {
  const [clientName, setClientName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()
  const { toast } = useToast()

  const steps = [
    { number: 1, label: "Your Name", icon: User },
    { number: 2, label: "Date", icon: Calendar },
    { number: 3, label: "Studio", icon: Music },
    { number: 4, label: "Time", icon: Clock },
    { number: 5, label: "Review", icon: Check },
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 1: return clientName.trim().length > 0
      case 2: return selectedDate !== null
      case 3: return selectedStudio !== null
      case 4: return selectedTimeSlots.length > 0 && areSlotsConsecutive(selectedTimeSlots)
      default: return true
    }
  }

  // Auto-advance from Step 1 (Name)
  useEffect(() => {
    if (currentStep === 1 && clientName.trim().length > 0) {
      const timer = setTimeout(() => setCurrentStep(2), 500)
      return () => clearTimeout(timer)
    }
  }, [clientName, currentStep])

  // Auto-advance from Step 2 (Date)
  useEffect(() => {
    if (currentStep === 2 && selectedDate !== null) {
      const timer = setTimeout(() => setCurrentStep(3), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedDate, currentStep])

  // Auto-advance from Step 3 (Studio)
  useEffect(() => {
    if (currentStep === 3 && selectedStudio !== null) {
      const timer = setTimeout(() => setCurrentStep(4), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedStudio, currentStep])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const bookingData = {
      clientName,
      date: selectedDate?.toISOString(),
      studio: selectedStudio,
      startTime: selectedTimeSlots[0]?.split(" - ")[0],
      endTime: selectedTimeSlots[selectedTimeSlots.length - 1]?.split(" - ")[1],
      duration: selectedTimeSlots.length,
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        toast({
          title: "Booking Request Submitted!",
          description: "A member of our team will reach out to you shortly.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit booking. Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    }

    // Reset form
    setClientName("")
    setSelectedDate(null)
    setSelectedStudio(null)
    setSelectedTimeSlots([])

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

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = step.number === currentStep
                  const isCompleted = step.number < currentStep

                  return (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                            ${isActive
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : isCompleted
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <span
                          className={`
                            mt-2 text-xs font-medium hidden sm:block transition-colors duration-300
                            ${isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground"}
                          `}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-colors duration-300 ${
                            step.number < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 1: Client Name */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Step 1: Your Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    id="clientName"
                    placeholder="Enter your name or artist name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="max-w-md"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    This is how we&apos;ll address you in all communications.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date Selection */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Step 2: Select Date
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
                            h-10 w-full rounded-lg text-sm font-medium transition-all duration-200
                            ${!available && "text-muted-foreground/50 cursor-not-allowed"}
                            ${available && !isSelected && "hover:bg-muted"}
                            ${isSelected && "bg-primary text-primary-foreground hover:bg-primary/90 scale-105"}
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
            )}

            {/* Step 3: Studio Selection */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Step 3: Select Studio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedStudio("Studio A")}
                      className={`
                        p-6 rounded-lg border-2 transition-all text-left
                        ${selectedStudio === "Studio A"
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
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
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
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
            )}

            {/* Step 4: Time Selection */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Step 4: Select Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select consecutive time slots for your session. Click multiple slots to book a longer session.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isSelected = selectedTimeSlots.includes(time)
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot !== time))
                            } else {
                              const newSlots = [...selectedTimeSlots, time]
                              // Sort slots by their position in timeSlots
                              newSlots.sort((a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b))
                              setSelectedTimeSlots(newSlots)
                            }
                          }}
                          className={`
                            p-3 rounded-lg border text-sm font-medium transition-all duration-200
                            ${isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "border-border hover:border-primary/50"
                            }
                          `}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                  {selectedTimeSlots.length > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Selected Time</p>
                          <p className="text-lg font-bold">{getFormattedTimeRange(selectedTimeSlots)}</p>
                          <p className="text-sm text-muted-foreground">
                            ({getDuration(selectedTimeSlots)} hour{getDuration(selectedTimeSlots) > 1 ? "s" : ""})
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTimeSlots([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                  {!areSlotsConsecutive(selectedTimeSlots) && selectedTimeSlots.length > 1 && (
                    <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Please select consecutive time slots.</strong> Your selected slots must be next to each other without gaps.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Review Your Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Client Name</p>
                        <p className="font-medium">{clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {selectedDate?.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Studio</p>
                        <p className="font-medium">{selectedStudio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{getFormattedTimeRange(selectedTimeSlots)}</p>
                        <p className="text-sm text-muted-foreground">
                          {getDuration(selectedTimeSlots)} hour{getDuration(selectedTimeSlots) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By submitting, you agree that a member of our team will reach out to you shortly to confirm your booking.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4">
              {currentStep > 1 && currentStep < 5 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep === 4 && canProceed() && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center gap-2"
                >
                  Continue to Review
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {currentStep === 5 && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  size="lg"
                  className="text-lg px-8"
                >
                  Submit Booking Request
                </Button>
              )}
            </div>

            {/* Contact Info */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
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
