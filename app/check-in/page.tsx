"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Music, Clock, User, MapPin, QrCode, MessageSquare, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CheckInBooking {
  id: string
  bookingCode: string
  studio: string
  date: string
  startTime: string
  endTime: string
  sessionType: string
  isVip: boolean
  client: {
    name: string
  }
}

export default function CheckInPage() {
  const [bookingCode, setBookingCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [foundBooking, setFoundBooking] = useState<CheckInBooking | null>(null)

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFoundBooking(null)

    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingCode: bookingCode.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Booking not found. Please check your booking code.")
      } else {
        setFoundBooking(data.booking)
      }
    } catch {
      setError("Unable to check in right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Client Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckIn} className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Enter booking code" value={bookingCode} onChange={(e) => setBookingCode(e.target.value)} />
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check In"}</Button>
          </form>

          {error && <div className="mt-4 p-3 rounded bg-destructive/10 text-destructive">{error}</div>}

          {foundBooking && (
            <div className="mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="success">Check-In Successful!</Badge>
                {foundBooking.isVip && <Badge variant="warning">VIP Client</Badge>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><User className="h-4 w-4" /><p>{foundBooking.client.name}</p></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><p>{foundBooking.studio}</p></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><p>{new Date(foundBooking.date).toLocaleDateString()} • {foundBooking.startTime}-{foundBooking.endTime}</p></div>
                <div className="flex items-center gap-2"><Music className="h-4 w-4" /><p>{foundBooking.sessionType}</p></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-6 my-8">
        <Card><CardContent className="pt-6 text-center"><QrCode className="h-8 w-8 mx-auto mb-2" />Scan QR Code</CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><MessageSquare className="h-8 w-8 mx-auto mb-2" />Text Check-In</CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><User className="h-8 w-8 mx-auto mb-2" />Front Desk</CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <p className="flex items-center gap-2"><Mail className="h-4 w-4" />support@platinumsound.com</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4" />(212) 265-6060</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />122 W. 26th St., New York, NY</p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/dashboard" className="underline">Staff Login</Link>
      </div>
    </div>
  )
}
