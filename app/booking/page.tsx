"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Mail, Music, Phone, User, Wallet, Globe, MapPin, Mic, UserPlus, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BookingAuthorization } from "@/components/booking-authorization"
import { MicSelection } from "@/components/mic-selection"
import { ReferralDropdown } from "@/components/referral-dropdown"

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

const onlineServices = [
  { value: "Online Mixing", description: "Professional mixing for international artists" },
  { value: "Online Mastering", description: "Mastering services delivered remotely" },
]

const inPersonServices = [
  { value: "Recording", description: "Track vocals, instruments, or full band sessions." },
  { value: "Mixing", description: "In-studio mixing session." },
  { value: "Mastering", description: "Prepare final mixes for distribution and streaming." },
  { value: "Podcast", description: "Capture and edit spoken word or interview sessions." },
  { value: "Voiceover", description: "Record commercial, narration, or ADR voice work." },
  { value: "Production", description: "Beat making and production session." },
]

const paymentOptions = [
  { value: "Full payment", description: "Pay the full session total today." },
  { value: "50% deposit", description: "Reserve the booking with a 50% deposit." },
  { value: "Pay in studio", description: "Pay in person on the day of the session." },
]

const studioOptions = [
  { value: "Studio A", description: "Main recording studio with SSL console", rate: 200 },
  { value: "Studio B", description: "Production suite with writing room", rate: 150 },
  { value: "Studio C", description: "Mixing and mastering suite", rate: 175 },
]

const engineerOptions = [
  "No preference",
  "Alex Morgan",
  "Jamie Lee",
  "Taylor Rivera",
  "Jordan Blake",
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

// Convert time string to 24-hour format
const to24Hour = (timeStr: string): string => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return timeStr
  let hours = parseInt(match[1])
  const minutes = match[2]
  const meridiem = match[3].toUpperCase()
  
  if (meridiem === "PM" && hours !== 12) hours += 12
  if (meridiem === "AM" && hours === 12) hours = 0
  
  return `${hours.toString().padStart(2, "0")}:${minutes}`
}

export default function BookingPage() {
  // Form state
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sessionMode, setSessionMode] = useState<"Online" | "In-Person">("In-Person")
  const [sessionType, setSessionType] = useState<string | null>(null)
  const [engineer, setEngineer] = useState<string | null>(null)
  const [paymentOption, setPaymentOption] = useState<string | null>(null)
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentStep, setCurrentStep] = useState(1)
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1])
  
  // New state for enhanced features
  const [authorization, setAuthorization] = useState<{
    signatureType: 'DIGITAL_SIGNATURE' | 'CHECKBOX_ACKNOWLEDGMENT'
    signatureData?: string | null
    acknowledged: boolean
  } | null>(null)
  const [micSelection, setMicSelection] = useState<{ micId: string; quantity: number; price: number }[]>([])
  const [referral, setReferral] = useState<{ referrerType: string; referrerId: string; referrerName: string } | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()

  // Updated steps with new flow
  const steps = [
    { number: 1, label: "Your Info", icon: User },
    { number: 2, label: "Date", icon: Calendar },
    { number: 3, label: "Session Mode", icon: Globe },
    { number: 4, label: "Session Type", icon: Music },
    { number: 5, label: "Room(s)", icon: MapPin },
    { number: 6, label: "Time", icon: Clock },
    { number: 7, label: "Add-Ons", icon: Mic },
    { number: 8, label: "Authorization", icon: Check },
    { number: 9, label: "Review", icon: Wallet },
  ]

  const totalSteps = steps.length
  const progressPercent = Math.round((currentStep / totalSteps) * 100)
  
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not set"
    
  const formattedTime = selectedTimeSlots.length > 0 ? getFormattedTimeRange(selectedTimeSlots) : "Not set"
  
  // Calculate pricing
  const studioRate = selectedStudio ? studioOptions.find(s => s.value === selectedStudio)?.rate || 150 : 150
  const duration = getDuration(selectedTimeSlots)
  const basePrice = studioRate * duration
  const micAddOnPrice = micSelection.reduce((sum, m) => sum + m.price, 0)
  const totalPrice = basePrice + micAddOnPrice
  const depositAmount = paymentOption === "50% deposit" ? totalPrice * 0.5 : paymentOption === "Full payment" ? totalPrice : 0

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      if (!visitedSteps.includes(nextStep)) {
        setVisitedSteps([...visitedSteps, nextStep])
      }
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        return clientName.trim().length > 0 && 
               clientEmail.trim().length > 0 && 
               clientPhone.trim().length > 0 &&
               !phoneError
      case 2: 
        return selectedDate !== null
      case 3:
        return sessionMode !== null
      case 4:
        return sessionType !== null && paymentOption !== null
      case 5:
        return selectedStudio !== null || sessionMode === "Online"
      case 6:
        return selectedTimeSlots.length > 0 && areSlotsConsecutive(selectedTimeSlots)
      case 7:
        return true // Add-ons are optional
      case 8:
        return authorization !== null && authorization.acknowledged
      default:
        return true
    }
  }

  // Validate phone against staff
  useEffect(() => {
    if (clientPhone.trim().length > 0) {
      // This would normally be an API call
      const staffPhones = ["+1 (212) 265-6060", "+1 (212) 265-6061", "+1 (212) 265-6062"]
      const normalizedPhone = clientPhone.replace(/\D/g, "")
      const isStaffPhone = staffPhones.some(sp => sp.replace(/\D/g, "") === normalizedPhone)
      
      if (isStaffPhone) {
        setPhoneError("This phone number matches a staff member. Please use a different number.")
      } else {
        setPhoneError(null)
      }
    } else {
      setPhoneError(null)
    }
  }, [clientPhone])

  // Auto-advance from Step 1
  useEffect(() => {
    if (currentStep === 1 && visitedSteps.includes(1) && canProceed()) {
      const timer = setTimeout(() => goToNextStep(), 500)
      return () => clearTimeout(timer)
    }
  }, [clientName, clientEmail, clientPhone, phoneError, currentStep, visitedSteps])

  // Auto-advance from Step 2 (Date)
  useEffect(() => {
    if (currentStep === 2 && visitedSteps.includes(2) && selectedDate !== null) {
      const timer = setTimeout(() => goToNextStep(), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedDate, currentStep, visitedSteps])

  // Auto-advance from Step 3 (Session Mode)
  useEffect(() => {
    if (currentStep === 3 && visitedSteps.includes(3)) {
      const timer = setTimeout(() => goToNextStep(), 500)
      return () => clearTimeout(timer)
    }
  }, [sessionMode, currentStep, visitedSteps])

  // Auto-advance from Step 5 (Studio)
  useEffect(() => {
    if (currentStep === 5 && visitedSteps.includes(5) && (selectedStudio !== null || sessionMode === "Online")) {
      const timer = setTimeout(() => goToNextStep(), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedStudio, sessionMode, currentStep, visitedSteps])

  // Auto-advance from Step 6 (Time)
  useEffect(() => {
    if (currentStep === 6 && visitedSteps.includes(6) && selectedTimeSlots.length > 0 && areSlotsConsecutive(selectedTimeSlots)) {
      const timer = setTimeout(() => goToNextStep(), 500)
      return () => clearTimeout(timer)
    }
  }, [selectedTimeSlots, currentStep, visitedSteps])

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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dayOfWeek !== 0 && dayOfWeek !== 6 && date >= today
  }

  const handleAuthorizationComplete = (auth: typeof authorization) => {
    setAuthorization(auth)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorization) {
      toast({
        title: "Authorization Required",
        description: "Please complete the authorization before submitting.",
        variant: "destructive",
      })
      return
    }

    const timeRange = getFormattedTimeRange(selectedTimeSlots)
    const [startTimeDisplay, endTimeDisplay] = timeRange.split(" - ")
    
    const bookingData = {
      clientName,
      clientEmail,
      clientPhone,
      date: selectedDate?.toISOString(),
      sessionMode,
      sessionType,
      engineer,
      paymentOption,
      studio: selectedStudio,
      startTime: to24Hour(startTimeDisplay),
      endTime: to24Hour(endTimeDisplay),
      duration,
      roomIds: selectedStudio ? [selectedStudio] : [],
      referral,
      micAddOns: micSelection,
      authorization: {
        signatureType: authorization.signatureType,
        signatureData: authorization.signatureData,
        acknowledged: authorization.acknowledged,
      },
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
        
        // Reset form
        setClientName("")
        setClientEmail("")
        setClientPhone("")
        setSelectedDate(null)
        setSessionMode("In-Person")
        setSessionType(null)
        setEngineer(null)
        setPaymentOption(null)
        setSelectedStudio(null)
        setSelectedTimeSlots([])
        setMicSelection([])
        setReferral(null)
        setAuthorization(null)
        setCurrentStep(1)
        setVisitedSteps([1])

        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to submit booking. Please try again.",
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
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Let's get to know you</h2>
              <p className="text-muted-foreground">Enter your contact information to get started</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="text-lg py-6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="pl-10 py-6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className={`pl-10 py-6 ${phoneError ? 'border-red-500' : ''}`}
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {phoneError}
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <ReferralDropdown onSelectionChange={setReferral} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select a Date</h2>
              <p className="text-muted-foreground">Choose your preferred session date</p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-medium">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-xs text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  {days.map((day) => {
                    const isSelected =
                      selectedDate &&
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth.getMonth() &&
                      selectedDate.getFullYear() === currentMonth.getFullYear()
                    const isAvailable = isDateAvailable(day)

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                          }
                        }}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors
                          ${isSelected ? "bg-primary text-primary-foreground" : ""}
                          ${!isSelected && isAvailable ? "hover:bg-muted cursor-pointer" : ""}
                          ${!isAvailable ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                        `}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Session Mode</h2>
              <p className="text-muted-foreground">Will this be an online or in-person session?</p>
            </div>

            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setSessionMode("In-Person")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  sessionMode === "In-Person"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${sessionMode === "In-Person" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">In-Person Session</h3>
                    <p className="text-muted-foreground text-sm">
                      Visit our studio for a hands-on recording experience
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode("Online")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  sessionMode === "Online"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${sessionMode === "Online" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Online Session</h3>
                    <p className="text-muted-foreground text-sm">
                      Remote mixing and mastering for international artists
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )

      case 4:
        const services = sessionMode === "Online" ? onlineServices : inPersonServices
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Session Details</h2>
              <p className="text-muted-foreground">Select your service type and payment preference</p>
            </div>

            <div className="space-y-8 max-w-lg mx-auto">
              <div className="space-y-3">
                <Label className="text-base font-medium">Service Type</Label>
                {services.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => setSessionType(service.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      sessionType === service.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="font-medium">{service.value}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Payment Option</Label>
                {paymentOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentOption(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      paymentOption === option.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="font-medium">{option.value}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Engineer Preference (Optional)</Label>
                <Select value={engineer || ""} onValueChange={setEngineer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineerOptions.map((eng) => (
                      <SelectItem key={eng} value={eng}>
                        {eng}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 5:
        if (sessionMode === "Online") {
          return (
            <div className="space-y-6 text-center">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Online Session</h2>
                <p className="text-muted-foreground">No studio selection needed for online sessions</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">
                    Your session will be conducted remotely. We'll contact you with details after your booking is confirmed.
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Studio</h2>
              <p className="text-muted-foreground">Choose your preferred recording space</p>
            </div>

            <div className="grid gap-4 max-w-2xl mx-auto">
              {studioOptions.map((studio) => (
                <button
                  key={studio.value}
                  type="button"
                  onClick={() => setSelectedStudio(studio.value)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    selectedStudio === studio.value
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{studio.value}</h3>
                      <p className="text-muted-foreground text-sm">{studio.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${studio.rate}/hr</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Rooms may be swapped at any time. Pricing will reflect assigned room.
            </p>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Time</h2>
              <p className="text-muted-foreground">Choose your session time slot(s)</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlots.includes(slot)
                  const selectedIndex = selectedTimeSlots.indexOf(slot)
                  const slotIndex = timeSlots.indexOf(slot)
                  
                  // Check if selecting this slot would break consecutiveness
                  let wouldBreakConsecutive = false
                  if (selectedTimeSlots.length > 0 && !isSelected) {
                    const newSlots = [...selectedTimeSlots, slot].sort(
                      (a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b)
                    )
                    wouldBreakConsecutive = !areSlotsConsecutive(newSlots)
                  }

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={wouldBreakConsecutive}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTimeSlots(selectedTimeSlots.filter((s) => s !== slot))
                        } else {
                          const newSlots = [...selectedTimeSlots, slot].sort(
                            (a, b) => timeSlots.indexOf(a) - timeSlots.indexOf(b)
                          )
                          setSelectedTimeSlots(newSlots)
                        }
                      }}
                      className={`p-3 rounded-lg text-sm transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : wouldBreakConsecutive
                          ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>

              {selectedTimeSlots.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected Time:</span>
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Duration:</span>
                    <span>{duration} hour(s)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Add-Ons</h2>
              <p className="text-muted-foreground">Enhance your session with premium options</p>
            </div>

            <div className="max-w-lg mx-auto">
              <MicSelection
                onSelectionChange={setMicSelection}
                quantity={1}
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Authorization</h2>
              <p className="text-muted-foreground">Please review and authorize your booking</p>
            </div>

            <div className="max-w-lg mx-auto">
              <BookingAuthorization
                bookingSummary={{
                  totalAmount: totalPrice,
                  depositAmount,
                  rooms: selectedStudio ? [selectedStudio] : ["Online Session"],
                  date: formattedDate,
                  time: formattedTime,
                }}
                onAuthorizationComplete={handleAuthorizationComplete}
              />
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
              <p className="text-muted-foreground">Please confirm all details before submitting</p>
            </div>

            <Card className="max-w-lg mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Name</span>
                    <p className="font-medium">{clientName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Email</span>
                    <p className="font-medium">{clientEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <p className="font-medium">{clientPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Session Mode</span>
                    <p className="font-medium">{sessionMode}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Date</span>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Time</span>
                    <p className="font-medium">{formattedTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Session Type</span>
                    <p className="font-medium">{sessionType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Studio</span>
                    <p className="font-medium">{selectedStudio || "Online"}</p>
                  </div>
                  {engineer && engineer !== "No preference" && (
                    <div>
                      <span className="text-sm text-muted-foreground">Engineer</span>
                      <p className="font-medium">{engineer}</p>
                    </div>
                  )}
                  {referral && (
                    <div>
                      <span className="text-sm text-muted-foreground">Referred By</span>
                      <p className="font-medium">{referral.referrerName}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Rate ({duration} hr × ${studioRate})</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  {micAddOnPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Mic Add-On</span>
                      <span>${micAddOnPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  {depositAmount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Due Now ({paymentOption})</span>
                      <span className="font-bold">${depositAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Authorization completed
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/platinum_sound_transparent.png"
              alt="Platinum Sound"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl hidden sm:inline">Platinum Sound</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-background">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium">{progressPercent}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="border-b bg-background/95 backdrop-blur overflow-x-auto">
        <div className="container py-4">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = visitedSteps.includes(step.number) && currentStep > step.number
              const isVisited = visitedSteps.includes(step.number)

              return (
                <div key={step.number} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isVisited && setCurrentStep(step.number)}
                    disabled={!isVisited}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/10 text-primary"
                        : isVisited
                        ? "bg-muted hover:bg-muted/80 cursor-pointer"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 max-w-lg mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={goToNextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Submit Booking
              </Button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Platinum Sound Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
