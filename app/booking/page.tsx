"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveCalendarGrid } from "@/components/ui/responsive-calendar-grid"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Lazy load heavy components to reduce initial bundle size
const BookingAuthorization = dynamic(() => import("@/components/booking-authorization").then(mod => mod.BookingAuthorization), {
  loading: () => <div className="animate-pulse h-48 bg-muted rounded-lg" />,
  ssr: false
})
const MicSelection = dynamic(() => import("@/components/mic-selection").then(mod => mod.MicSelection), {
  loading: () => <div className="animate-pulse h-32 bg-muted rounded-lg" />,
  ssr: false
})
const StripePaymentForm = dynamic(() => import("@/components/stripe-payment-form").then(mod => mod.StripePaymentForm), {
  loading: () => <div className="animate-pulse h-32 bg-muted rounded-lg" />,
  ssr: false
})
const ReferralDropdown = dynamic(() => import("@/components/referral-dropdown").then(mod => mod.ReferralDropdown), {
  loading: () => <div className="animate-pulse h-10 bg-muted rounded-lg" />,
  ssr: false
})

// Icons - only import what's needed
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Mail, Music, Phone, User, Wallet, Globe, MapPin, Mic, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react"

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
  const [engineerOptions, setEngineerOptions] = useState<string[]>(["No preference"])
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
  const [engineersLoading, setEngineersLoading] = useState(true)
  const [studios, setStudios] = useState<any[]>([])
  const [studiosLoading, setStudiosLoading] = useState(true)

  // Stripe payment state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState<string | null>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [isFetchingIntent, setIsFetchingIntent] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/engineers')
      .then((r) => {
        if (!r.ok) return []
        return r.json()
      })
      .then((rows) => {
        setEngineerOptions(["No preference", ...rows.map((e: any) => e.name)])
      })
      .finally(() => setEngineersLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/rooms')
      .then((r) => {
        if (!r.ok) return []
        return r.json()
      })
      .then((rows) => {
        setStudios(rows)
      })
      .finally(() => setStudiosLoading(false))
  }, [])

  // Updated steps with new flow
  const steps = [
    { number: 1, label: "Your Info", icon: User },
    { number: 2, label: "Session Type", shortLabel: "Type", icon: Globe },
    { number: 3, label: "Studio Room", shortLabel: "Room", icon: MapPin },
    { number: 4, label: "Date & Time", shortLabel: "Date", icon: Calendar },
    { number: 5, label: "Session Details", shortLabel: "Details", icon: Music },
    { number: 6, label: "Time Slots", shortLabel: "Time", icon: Clock },
    { number: 7, label: "Add-Ons", shortLabel: "Add-ons", icon: Mic },
    { number: 8, label: "Authorization", shortLabel: "Auth", icon: Check },
    { number: 9, label: "Review", shortLabel: "Review", icon: Wallet },
  ]

  const totalSteps = steps.length
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  // Memoize formatted date to avoid recalculating on every render
  const formattedDate = useMemo(() => {
    if (!selectedDate) return "Not set"
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [selectedDate])

  // Memoize formatted time range
  const formattedTime = useMemo(() => {
    if (selectedTimeSlots.length === 0) return "Not set"
    return getFormattedTimeRange(selectedTimeSlots)
  }, [selectedTimeSlots])

  // Memoize pricing calculations to avoid recalculating on every render
  const studioRate = useMemo(() => {
    if (!selectedStudio) return 150
    const studio = studios.find(s => s.name === selectedStudio)
    return studio?.baseRate || 150
  }, [selectedStudio, studios])

  const duration = useMemo(() => getDuration(selectedTimeSlots), [selectedTimeSlots])
  const basePrice = useMemo(() => studioRate * duration, [studioRate, duration])
  const micAddOnPrice = useMemo(() => micSelection.reduce((sum, m) => sum + m.price, 0), [micSelection])
  const totalPrice = useMemo(() => basePrice + micAddOnPrice, [basePrice, micAddOnPrice])
  const depositAmount = useMemo(() => {
    if (paymentOption === "50% deposit") return totalPrice * 0.5
    if (paymentOption === "Full payment") return totalPrice
    return 0
  }, [paymentOption, totalPrice])

  // Stripe is required for full payment and deposit (not for pay-in-studio)
  const requiresStripePayment = useMemo(() =>
    paymentOption === "Full payment" || paymentOption === "50% deposit",
    [paymentOption]
  )

  // Amount to charge via Stripe - memoized
  const stripeChargeAmount = useMemo(() => {
    if (paymentOption === "Full payment") return totalPrice
    if (paymentOption === "50% deposit") return totalPrice * 0.5
    return 0
  }, [paymentOption, totalPrice])

  // Create Stripe Payment Intent when reaching the review step with upfront payment
  useEffect(() => {
    if (currentStep !== 9 || !requiresStripePayment || stripeClientSecret || isFetchingIntent) {
      return
    }

    setIsFetchingIntent(true)
    setStripeError(null)

    fetch("/api/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: stripeChargeAmount,
        currency: "usd",
        description: `Platinum Sound Studios - ${sessionType} Session (${paymentOption})`,
        metadata: {
          clientEmail,
          clientName,
          sessionType: sessionType || "",
          studio: selectedStudio || "Online",
          paymentOption: paymentOption || "",
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setStripeClientSecret(data.clientSecret)
        } else {
          setStripeError(data.error || "Failed to initialize payment")
        }
      })
      .catch(() => setStripeError("Failed to connect to payment service"))
      .finally(() => setIsFetchingIntent(false))
  }, [
    currentStep,
    requiresStripePayment,
    stripeClientSecret,
    isFetchingIntent,
    stripeChargeAmount,
    sessionType,
    paymentOption,
    clientEmail,
    clientName,
    selectedStudio,
  ])

  const goToNextStep = useCallback(async () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1
      
      // Create lead when moving from step 1 to step 2
      if (currentStep === 1 && clientName && clientEmail) {
        try {
          await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: clientName,
              email: clientEmail,
              phone: clientPhone,
              sessionType: sessionType,
              studio: selectedStudio,
              date: selectedDate?.toISOString(),
              time: formattedTime,
            }),
          })
        } catch (e) {
          console.error('Failed to create lead:', e)
        }
      }
      
      setCurrentStep(nextStep)
      setVisitedSteps(prev => prev.includes(nextStep) ? prev : [...prev, nextStep])
    }
  }, [currentStep, totalSteps, clientName, clientEmail, clientPhone, sessionType, selectedStudio, selectedDate, formattedTime])

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return clientName.trim().length > 0 &&
               clientEmail.trim().length > 0 &&
               clientPhone.trim().length > 0 &&
               !phoneError
      case 2:
        return sessionMode !== null
      case 3:
        return selectedStudio !== null || sessionMode === "Online"
      case 4:
        return selectedDate !== null
      case 5:
        return sessionType !== null && paymentOption !== null
      case 6:
        return selectedTimeSlots.length > 0 && areSlotsConsecutive(selectedTimeSlots)
      case 7:
        return true // Add-ons are optional
      case 8:
        return authorization !== null && authorization.acknowledged
      case 9:
        // If payment is required via Stripe, payment must be completed first
        if (requiresStripePayment) return paymentComplete
        return true
      default:
        return true
    }
  }, [currentStep, clientName, clientEmail, clientPhone, phoneError, selectedDate, sessionMode, sessionType, paymentOption, selectedStudio, selectedTimeSlots, authorization, requiresStripePayment, paymentComplete])

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


  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Calendar helpers - memoized with useMemo
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const lastDay = new Date(year, month + 1, 0)
    return lastDay.getDate()
  }, [currentMonth])

  const firstDay = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    return new Date(year, month, 1).getDay()
  }, [currentMonth])

  const days = useMemo(() =>
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  )

  const prevMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const isDateAvailable = useCallback((day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dayOfWeek = date.getDay()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dayOfWeek !== 0 && dayOfWeek !== 6 && date >= today
  }, [currentMonth])

  const handleAuthorizationComplete = useCallback((auth: typeof authorization) => {
    setAuthorization(auth)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      stripePaymentIntentId: stripePaymentIntentId || undefined,
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
        setStripeClientSecret(null)
        setStripePaymentIntentId(null)
        setStripeError(null)
        setPaymentComplete(false)
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
  }, [authorization, selectedTimeSlots, clientName, clientEmail, clientPhone, selectedDate, sessionMode, sessionType, engineer, paymentOption, selectedStudio, duration, referral, micSelection, stripePaymentIntentId, toast, router])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name <span className="text-primary">*</span></Label>
              <Input
                id="name"
                placeholder="Your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="h-12 bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address <span className="text-primary">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-primary">*</span></Label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 h-12 rounded-md border border-border bg-background text-sm text-muted-foreground shrink-0">
                  <Phone className="h-4 w-4" />
                  <span>+1</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className={`h-12 bg-background border-border ${phoneError ? 'border-red-500' : ''}`}
                />
              </div>
              {phoneError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {phoneError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Referral Source <span className="text-muted-foreground font-normal">(optional dropdown)</span></Label>
              <ReferralDropdown onSelectionChange={setReferral} />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Session Mode</h2>
              <p className="text-sm text-muted-foreground">Will this be an online or in-person session?</p>
            </div>

            <div className="grid gap-4 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => setSessionMode("In-Person")}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  sessionMode === "In-Person"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${sessionMode === "In-Person" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">In-Person Session</h3>
                    <p className="text-muted-foreground text-sm">
                      Visit our studio for a hands-on recording experience
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionMode("Online")}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  sessionMode === "Online"
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${sessionMode === "Online" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Online Session</h3>
                    <p className="text-muted-foreground text-sm">
                      Remote mixing and mastering for international artists
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )

      case 3:
        if (sessionMode === "Online") {
          return (
            <div className="space-y-6 text-center">
              <div className="mb-2">
                <h2 className="text-xl font-semibold mb-1">Online Session</h2>
                <p className="text-sm text-muted-foreground">No studio selection needed for online sessions</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-8 max-w-md mx-auto">
                <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Your session will be conducted remotely. We&apos;ll contact you with details after your booking is confirmed.
                </p>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Select Studio</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred recording space</p>
            </div>

            {studiosLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : studios.length > 0 ? (
              <div className="grid gap-3">
                {studios.map((studio) => (
                  <button
                    key={studio.id}
                    type="button"
                    onClick={() => setSelectedStudio(studio.name)}
                    className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedStudio === studio.name
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{studio.name}</h3>
                        <p className="text-muted-foreground text-sm">{studio.description || 'Professional recording studio'}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${studio.baseRate}/hr</div>
                        {studio.rateWithEngineer && (
                          <div className="text-xs text-muted-foreground">${studio.rateWithEngineer}/hr w/ engineer</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No studios available. Please check back later.</p>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Rooms may be swapped at any time. Pricing will reflect assigned room.
            </p>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Select a Date</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred session date</p>
            </div>

            <div className="max-w-md mx-auto bg-muted/30 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-sm">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <ResponsiveCalendarGrid
                weekdayHeader={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs text-muted-foreground py-2 text-center font-medium">
                    <span className="sm:hidden">{day[0]}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </div>
                ))}
              >
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
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-md"
                          : isAvailable
                          ? "hover:bg-primary/10 cursor-pointer"
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </ResponsiveCalendarGrid>
            </div>
          </div>
        )

      case 5:
        const services = sessionMode === "Online" ? onlineServices : inPersonServices

        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Session Details</h2>
              <p className="text-sm text-muted-foreground">Select your service type and payment preference</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Type</Label>
                <div className="space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => setSessionType(service.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm ${
                        sessionType === service.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{service.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{service.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Option</Label>
                <div className="space-y-2">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentOption(option.value)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm ${
                        paymentOption === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="font-medium text-sm">{option.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Engineer Preference <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                <Select value={engineer || ""} onValueChange={setEngineer}>
                  <SelectTrigger className="h-12 bg-background">
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

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Select Time</h2>
              <p className="text-sm text-muted-foreground">Choose your session time slot(s)</p>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlots.includes(slot)

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
                          ? "bg-primary text-primary-foreground shadow-md"
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
                <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Selected Time:</span>
                    <span className="font-semibold">{formattedTime}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span className="font-medium">Duration:</span>
                    <span className="font-semibold">{duration} hour(s)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Add-Ons</h2>
              <p className="text-sm text-muted-foreground">Enhance your session with premium options</p>
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
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Authorization</h2>
              <p className="text-sm text-muted-foreground">Please review and authorize your booking</p>
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
            <div className="text-center mb-2">
              <h2 className="text-xl font-semibold mb-1">Review Your Booking</h2>
              <p className="text-sm text-muted-foreground">Please confirm all details before submitting</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Name</span>
                  <p className="font-medium">{clientName}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span>
                  <p className="font-medium">{clientEmail}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Phone</span>
                  <p className="font-medium">{clientPhone}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Session Mode</span>
                  <p className="font-medium">{sessionMode}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Date</span>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Time</span>
                  <p className="font-medium">{formattedTime}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Session Type</span>
                  <p className="font-medium">{sessionType}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Studio</span>
                  <p className="font-medium">{selectedStudio || "Online"}</p>
                </div>
                {engineer && engineer !== "No preference" && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Engineer</span>
                    <p className="font-medium">{engineer}</p>
                  </div>
                )}
                {referral && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Referred By</span>
                    <p className="font-medium">{referral.referrerName}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Rate ({duration} hr × ${studioRate})</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {micAddOnPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mic Add-On</span>
                    <span>${micAddOnPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {depositAmount > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Due Now ({paymentOption})</span>
                    <span>${depositAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-200">
                  Authorization completed
                </span>
              </div>
            </div>

            {/* Stripe Payment Section */}
            {requiresStripePayment && (
              <div className="mt-4 border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3">
                  {paymentComplete ? "Payment Complete" : `Pay ${paymentOption === "Full payment" ? "in Full" : "50% Deposit"}`}
                </h3>
                {paymentComplete ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <Check className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Payment Successful!</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ${stripeChargeAmount.toFixed(2)} charged. Click &quot;Submit Booking&quot; to complete your reservation.
                      </p>
                    </div>
                  </div>
                ) : stripeError ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{stripeError}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStripeError(null)
                        setStripeClientSecret(null)
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : isFetchingIntent ? (
                  <div className="flex items-center justify-center py-8 gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-sm text-muted-foreground">Initializing payment...</span>
                  </div>
                ) : stripeClientSecret ? (
                  <StripePaymentForm
                    clientSecret={stripeClientSecret}
                    amount={stripeChargeAmount}
                    onPaymentSuccess={(intentId) => {
                      setStripePaymentIntentId(intentId)
                      setPaymentComplete(true)
                      setStripeError(null)
                    }}
                    onPaymentError={(error) => {
                      setStripeError(error)
                    }}
                  />
                ) : null}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/Platinum Sound logo with 3D effect.png"
              alt="Platinum Sound Studios"
              width={150}
              height={100}
              className="h-20 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-neutral-900 dark:bg-neutral-950">
        <div className="absolute inset-0">
          <Image
            src="/studio-hero.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/80 to-neutral-900" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Book Your Studio Session
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto">
            Reserve your time at Platinum Sound Studios in just a few quick steps.
          </p>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-3xl px-4 py-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px]">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number
              const isCompleted = visitedSteps.includes(step.number) && currentStep > step.number
              const isVisited = visitedSteps.includes(step.number)

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => isVisited && setCurrentStep(step.number)}
                      disabled={!isVisited}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2 ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/50"
                      } ${isVisited ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.number
                      )}
                    </button>
                    <span className={`mt-1.5 text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/60"
                    }`}>
                      {step.shortLabel ?? step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mt-[-18px] rounded-full transition-colors ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Form Card */}
        <div className="bg-card rounded-2xl border shadow-sm">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Continue / Submit Button */}
              <div className="mt-8">
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={!canProceed()}
                    className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed()}
                    className="w-full h-12 text-base font-semibold gap-2 rounded-xl"
                  >
                    <Check className="h-4 w-4" />
                    {requiresStripePayment && !paymentComplete
                      ? "Complete Payment Above"
                      : "Submit Booking"}
                  </Button>
                )}
              </div>

              {/* Back Link */}
              {currentStep > 1 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Session Summary Card */}
        <div className="mt-6 bg-card rounded-2xl border shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Session Summary</h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session Type</span>
              <span className="font-medium">{sessionMode === "In-Person" ? "In Person" : "Online"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room</span>
              <span className="font-medium">{selectedStudio || "Not Selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{selectedTimeSlots.length > 0 ? formattedTime : "Not Selected"}</span>
            </div>
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
            )}
            {sessionType && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{sessionType}</span>
              </div>
            )}
            {clientName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium truncate ml-4">{clientName}</span>
              </div>
            )}
          </div>

          {totalPrice > 0 && (
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base ({duration} hr × ${studioRate})</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {micAddOnPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span>${micAddOnPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {depositAmount > 0 && (
                <div className="flex justify-between text-primary font-medium">
                  <span>Due Now</span>
                  <span>${depositAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Platinum Sound Studios. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
