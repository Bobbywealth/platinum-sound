"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useEffect, useState } from 'react'
import { MasterCalendar } from '@/components/master-calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Calendar, Users, DoorOpen, Music, Clock, ArrowRight } from 'lucide-react'

interface Booking {
  id: string
  clientName: string
  date: Date
  startTime: string
  endTime: string
  studio: string
  sessionType: string
  status: string
  engineer: string
}

interface Room {
  id: string
  name: string
  status: string
}

interface Engineer {
  id: string
  name: string
  isAvailable?: boolean
}

export default function MasterCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsRes = await fetch('/api/rooms')
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json()
          setRooms(roomsData)
        }

        // Fetch engineers
        const engineersRes = await fetch('/api/engineers')
        if (engineersRes.ok) {
          const engineersData = await engineersRes.json()
          setEngineers(engineersData)
        }

        // Fetch bookings
        const bookingsRes = await fetch('/api/bookings')
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData.map((b: any) => ({
            ...b,
            clientName: b.client?.name || 'Unknown',
            date: new Date(b.date),
          })))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date)
  }

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardPageShell>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Master Calendar
          </h1>
          <p className="text-muted-foreground">
            View all rooms, engineers, and bookings in one place
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
            <p className="text-xs text-muted-foreground">
              {rooms.filter(r => r.status === 'AVAILABLE').length} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engineers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engineers.length}</div>
            <p className="text-xs text-muted-foreground">
              {engineers.filter(e => e.isAvailable).length} available today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => format(new Date(b.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              sessions scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => {
                const bookingDate = new Date(b.date)
                const today = new Date()
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                return bookingDate >= today && bookingDate <= weekFromNow
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              bookings this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading calendar...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <div className="min-w-[760px]">
            <MasterCalendar
              bookings={bookings}
              rooms={rooms}
              engineers={engineers}
              onDateSelect={handleDateSelect}
              onBookingSelect={handleBookingSelect}
            />
          </div>
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Session information
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="font-medium text-lg">{selectedBooking.clientName}</span>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">{format(new Date(selectedBooking.date), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <p className="font-medium">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Room:</span>
                  <p className="font-medium">{selectedBooking.studio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Session Type:</span>
                  <p className="font-medium">{selectedBooking.sessionType}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Engineer:</span>
                  <p className="font-medium">{selectedBooking.engineer}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  View Full Details
                </Button>
                <Button className="flex-1">
                  Edit Booking
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  )
}
