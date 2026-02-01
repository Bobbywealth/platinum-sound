"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, QrCode, MessageSquare, User, Clock, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { bookings } from "@/lib/data"

export default function CheckInPage() {
  const [bookingCode, setBookingCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [foundBooking, setFoundBooking] = useState<typeof bookings[0] | null>(null)
  const [error, setError] = useState("")

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFoundBooking(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const booking = bookings.find((b) => b.id === bookingCode.toUpperCase())

    if (booking) {
      setFoundBooking(booking)
    } else {
      setError("Booking not found. Please check your booking code.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Platinum Sound Studios</span>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Staff Login
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Check In for Your Session</h1>
          <p className="text-muted-foreground text-lg">
            Enter your booking code below to check in for your studio session
          </p>
        </div>

        {/* Check-In Form */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <form onSubmit={handleCheckIn} className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="bookingCode"
                  placeholder="e.g., B001"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  className="text-lg py-6"
                />
              </div>
              <Button type="submit" size="lg" className="px-8" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check In"
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}

            {foundBooking && (
              <div className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="success">Check-In Successful!</Badge>
                  {foundBooking.isVip && (
                    <Badge variant="warning">VIP Client</Badge>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">Your Session Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Client Name</p>
                      <p className="font-medium">{foundBooking.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Studio</p>
                      <p className="font-medium">{foundBooking.studio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Session Time</p>
                      <p className="font-medium">
                        {foundBooking.date} • {foundBooking.startTime} - {foundBooking.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Session Type</p>
                      <p className="font-medium">{foundBooking.sessionType}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alternative Check-In Methods */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <QrCode className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Scan the QR code on your confirmation email
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageSquare className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Text Check-In</h3>
              <p className="text-sm text-muted-foreground">
                Reply to your confirmation SMS
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <User className="h-10 w-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Front Desk</h3>
              <p className="text-sm text-muted-foreground">
                Check in with our front desk staff
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">support@platinumsound.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">(212) 265-6060</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">122 W. 26th St., New York, NY</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Link for Staff */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="ghost">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
