"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lock, Calendar, AlertTriangle } from 'lucide-react'
import { format, addDays, addWeeks, addMonths } from 'date-fns'

interface RoomLockoutDialogProps {
  roomId: string
  roomName: string
  onLockoutCreate: (lockout: {
    roomId: string
    startDate: Date
    endDate: Date
    reason: string
  }) => Promise<void>
  trigger?: React.ReactNode
}

export function RoomLockoutDialog({
  roomId,
  roomName,
  onLockoutCreate,
  trigger,
}: RoomLockoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('custom')

  const handleDurationChange = (value: string) => {
    setDuration(value)
    const start = new Date(startDate)
    
    switch (value) {
      case '1day':
        setEndDate(format(addDays(start, 1), 'yyyy-MM-dd'))
        break
      case '1week':
        setEndDate(format(addWeeks(start, 1), 'yyyy-MM-dd'))
        break
      case '2weeks':
        setEndDate(format(addWeeks(start, 2), 'yyyy-MM-dd'))
        break
      case '1month':
        setEndDate(format(addMonths(start, 1), 'yyyy-MM-dd'))
        break
      case '3months':
        setEndDate(format(addMonths(start, 3), 'yyyy-MM-dd'))
        break
      default:
        break
    }
  }

  const handleSubmit = async () => {
    if (!startDate || !endDate) return

    setIsLoading(true)
    try {
      await onLockoutCreate({
        roomId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      })
      setIsOpen(false)
      // Reset form
      setReason('')
      setDuration('custom')
    } catch (error) {
      console.error('Failed to create lockout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Lock className="h-4 w-4 mr-2" />
            Lock Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Lock Room: {roomName}
          </DialogTitle>
          <DialogDescription>
            Lock this room for a specific date range. This will prevent any new bookings 
            during the selected period.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Duration Preset */}
          <div className="space-y-2">
            <Label>Quick Select Duration</Label>
            <Select value={duration} onValueChange={handleDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="2weeks">2 Weeks</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>
          
          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Long-term artist booking, Professional studio takeover, Maintenance..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          
          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">Important:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Existing bookings in this date range will not be affected</li>
                <li>New bookings will be blocked during this period</li>
                <li>You can remove the lockout at any time</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !startDate || !endDate}
          >
            {isLoading ? 'Creating...' : 'Lock Room'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
