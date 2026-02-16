"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Ban, CheckCircle, AlertCircle } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface AvailabilityEntry {
  id: string
  engineerId: string
  date: Date
  status: 'AVAILABLE' | 'BLOCKED' | 'VACATION' | 'SICK'
  blockedReason?: string
}

interface Engineer {
  id: string
  name: string
  email: string
}

const statusConfig = {
  AVAILABLE: { label: 'Available', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  BLOCKED: { label: 'Blocked', color: 'bg-red-100 text-red-800 border-red-200', icon: Ban },
  VACATION: { label: 'Vacation', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CalendarIcon },
  SICK: { label: 'Sick Leave', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertCircle },
}

export default function AvailabilityPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>('')
  const [availability, setAvailability] = useState<AvailabilityEntry[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await fetch('/api/engineers')
        if (res.ok) {
          const data = await res.json()
          setEngineers(data)
          if (data.length > 0) {
            setSelectedEngineerId(data[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching engineers:', error)
      }
    }

    fetchEngineers()
  }, [])

  useEffect(() => {
    if (!selectedEngineerId) return

    const fetchAvailability = async () => {
      setIsLoading(true)
      try {
        const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
        const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')
        
        const res = await fetch(`/api/availability?engineerId=${selectedEngineerId}&startDate=${start}&endDate=${end}`)
        if (res.ok) {
          const data = await res.json()
          setAvailability(data.map((a: any) => ({
            ...a,
            date: new Date(a.date)
          })))
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [selectedEngineerId, currentDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    
    const isAlreadySelected = selectedDates.some(d => isSameDay(d, date))
    if (isAlreadySelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)))
    } else {
      setSelectedDates([...selectedDates, date])
    }
  }

  const updateAvailability = async (status: 'AVAILABLE' | 'BLOCKED' | 'VACATION' | 'SICK', reason?: string) => {
    if (selectedDates.length === 0) {
      toast({
        title: 'No dates selected',
        description: 'Please select one or more dates to update.',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engineerId: selectedEngineerId,
          dates: selectedDates.map(d => format(d, 'yyyy-MM-dd')),
          status,
          blockedReason: reason,
        }),
      })

      if (res.ok) {
        toast({
          title: 'Availability updated',
          description: `Updated ${selectedDates.length} date(s) to ${statusConfig[status].label}.`,
        })
        
        // Refresh availability
        const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
        const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')
        const availRes = await fetch(`/api/availability?engineerId=${selectedEngineerId}&startDate=${start}&endDate=${end}`)
        if (availRes.ok) {
          const data = await availRes.json()
          setAvailability(data.map((a: any) => ({
            ...a,
            date: new Date(a.date)
          })))
        }
        
        setSelectedDates([])
      } else {
        throw new Error('Failed to update availability')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getAvailabilityForDate = (date: Date) => {
    return availability.find(a => isSameDay(new Date(a.date), date))
  }

  // Generate calendar days
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const selectedEngineer = engineers.find(e => e.id === selectedEngineerId)

  return (
    <div className="space-y-6 bg-[#FAFAF8] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Engineer Availability
          </h1>
          <p className="text-muted-foreground">
            Manage your availability and block off dates
          </p>
        </div>
      </div>

      {/* Engineer Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Engineer</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedEngineerId} onValueChange={setSelectedEngineerId}>
            <SelectTrigger className="w-full sm:w-56 md:w-72">
              <SelectValue placeholder="Select an engineer" />
            </SelectTrigger>
            <SelectContent>
              {engineers.map(engineer => (
                <SelectItem key={engineer.id} value={engineer.id}>
                  {engineer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedEngineer && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{selectedEngineer.name}'s Calendar</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(currentDate, 'MMMM yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Week Day Headers */}
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isTodayDate = isToday(day)
                  const avail = getAvailabilityForDate(day)
                  const isSelected = selectedDates.some(d => isSameDay(d, day))
                  
                  return (
                    <div
                      key={index}
                      onClick={() => isCurrentMonth && handleDateSelect(day)}
                      className={`
                        min-h-[60px] p-1 border rounded cursor-pointer transition-colors
                        ${!isCurrentMonth ? 'opacity-30' : ''}
                        ${isTodayDate ? 'border-primary border-2' : ''}
                        ${isSelected ? 'bg-primary/20 border-primary' : ''}
                        ${avail ? statusConfig[avail.status].color : 'bg-background hover:bg-muted'}
                      `}
                    >
                      <div className="text-xs font-medium">{format(day, 'd')}</div>
                      {avail && (
                        <div className="text-[10px] mt-0.5 truncate">
                          {statusConfig[avail.status].label}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Status:</span>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Badge key={key} variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Update Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDates.length > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{selectedDates.length} date(s) selected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedDates.map(d => format(d, 'MMM d')).join(', ')}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Set status for selected dates:
                </p>
                
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => updateAvailability('AVAILABLE')}
                  disabled={selectedDates.length === 0}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Mark as Available
                </Button>
                
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => updateAvailability('BLOCKED', 'Personal')}
                  disabled={selectedDates.length === 0}
                >
                  <Ban className="h-4 w-4 mr-2 text-red-600" />
                  Block Off
                </Button>
                
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => updateAvailability('VACATION')}
                  disabled={selectedDates.length === 0}
                >
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                  Vacation
                </Button>
                
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => updateAvailability('SICK')}
                  disabled={selectedDates.length === 0}
                >
                  <AlertCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Sick Leave
                </Button>
              </div>
              
              <div className="pt-4 border-t text-sm text-muted-foreground">
                <p>Tip: Click on dates to select them, then choose an action above.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
