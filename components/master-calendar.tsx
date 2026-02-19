"use client"

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, DoorOpen, Music } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'

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

interface MasterCalendarProps {
  bookings?: Booking[]
  rooms?: Room[]
  engineers?: Engineer[]
  onDateSelect?: (date: Date) => void
  onBookingSelect?: (booking: Booking) => void
}

export function MasterCalendar({
  bookings = [],
  rooms = [],
  engineers = [],
  onDateSelect,
  onBookingSelect,
}: MasterCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [filterRoom, setFilterRoom] = useState<string>('all')
  const [filterEngineer, setFilterEngineer] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (filterRoom !== 'all' && booking.studio !== filterRoom) return false
      if (filterEngineer !== 'all' && booking.engineer !== filterEngineer) return false
      if (filterStatus !== 'all' && booking.status !== filterStatus) return false
      return true
    })
  }, [bookings, filterRoom, filterEngineer, filterStatus])

  // Get bookings for a specific day
  const getBookingsForDay = (date: Date) => {
    return filteredBookings.filter(booking => isSameDay(new Date(booking.date), date))
  }

  // Navigation handlers
  const goToToday = () => setCurrentDate(new Date())
  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Master Calendar
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="rounded-none"
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-none"
              >
                Week
              </Button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4">
          <Select value={filterRoom} onValueChange={setFilterRoom}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <DoorOpen className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room.id} value={room.name}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterEngineer} onValueChange={setFilterEngineer}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Engineer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Engineers</SelectItem>
              {engineers.map(engineer => (
                <SelectItem key={engineer.id} value={engineer.name || engineer.id}>
                  {engineer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
        </div>
        
        {/* Calendar Grid (Desktop/Tablet) */}
        <div className="hidden md:grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Week Day Headers */}
          {weekDays.map(day => (
            <div
              key={day}
              className="bg-muted p-2 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)
            
            return (
              <div
                key={index}
                className={`min-h-[80px] md:min-h-[100px] p-1 bg-background cursor-pointer hover:bg-muted/50 transition-colors ${
                  !isCurrentMonth ? 'opacity-40' : ''
                }`}
                onClick={() => onDateSelect?.(day)}
              >
                <div className={`text-sm p-1 ${isTodayDate ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center font-bold' : ''}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1 mt-1">
                  {dayBookings.slice(0, 3).map(booking => (
                    <div
                      key={booking.id}
                      className={`text-xs p-1 rounded border cursor-pointer truncate ${getStatusColor(booking.status)}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onBookingSelect?.(booking)
                      }}
                    >
                      <div className="font-medium truncate">{booking.clientName}</div>
                      <div className="flex items-center gap-1 text-[10px] opacity-80">
                        <Music className="h-2 w-2" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-4">
          {calendarDays
            .filter(day => isSameMonth(day, currentDate))
            .map((day) => {
              const dayBookings = getBookingsForDay(day)
              if (dayBookings.length === 0) return null

              const isTodayDate = isToday(day)

              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div className={`flex items-center gap-2 pb-2 border-b ${isTodayDate ? 'border-primary' : 'border-border'}`}>
                    <div className={`text-sm font-semibold px-2 py-1 rounded ${isTodayDate ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {format(day, 'EEE, MMM d')}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dayBookings.length} {dayBookings.length === 1 ? 'session' : 'sessions'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {dayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(booking.status)}`}
                        onClick={() => onBookingSelect?.(booking)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{booking.clientName}</p>
                            <p className="text-sm opacity-80">{booking.studio}</p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-sm opacity-80">
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            <span>{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{booking.engineer}</span>
                          </div>
                        </div>

                        {booking.sessionType && (
                          <div className="mt-2 text-xs opacity-60">
                            {booking.sessionType}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

          {filteredBookings.filter(b => isSameMonth(new Date(b.date), currentDate)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No bookings this month</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Status:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
              { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
              { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
              { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
              { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
            ].map(status => (
              <Badge key={status.label} variant="outline" className={status.color}>
                {status.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
