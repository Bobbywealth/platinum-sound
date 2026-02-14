"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Clock, Plus, AlertCircle } from 'lucide-react'

interface SessionExtensionDialogProps {
  bookingId: string
  currentEndTime: string
  roomRate: number
  onExtend: (extension: { additionalHours: number; additionalCost: number }) => Promise<void>
  trigger?: React.ReactNode
}

export function SessionExtensionDialog({
  bookingId,
  currentEndTime,
  roomRate,
  onExtend,
  trigger,
}: SessionExtensionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [additionalHours, setAdditionalHours] = useState(1)

  // Calculate new end time
  const calculateNewEndTime = () => {
    const [hours, minutes] = currentEndTime.split(':').map(Number)
    const newHours = hours + additionalHours
    return `${newHours.toString().padStart(2, '0')}:${(minutes || 0).toString().padStart(2, '0')}`
  }

  const additionalCost = roomRate * additionalHours

  const handleExtend = async () => {
    setIsLoading(true)
    try {
      await onExtend({ additionalHours, additionalCost })
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to extend session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Extend Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Extend Session
          </DialogTitle>
          <DialogDescription>
            Add more time to your current booking session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Current End Time */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Current End Time</span>
            <span className="font-medium">{currentEndTime}</span>
          </div>
          
          {/* Additional Hours */}
          <div className="space-y-2">
            <Label>Additional Hours</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAdditionalHours(Math.max(1, additionalHours - 1))}
                disabled={additionalHours <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                value={additionalHours}
                onChange={(e) => setAdditionalHours(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={8}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAdditionalHours(Math.min(8, additionalHours + 1))}
                disabled={additionalHours >= 8}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Summary */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New End Time</span>
                <span className="font-medium">{calculateNewEndTime()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room Rate</span>
                <span>${roomRate.toFixed(2)}/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Additional Hours</span>
                <span>{additionalHours}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Additional Cost</span>
                <span className="font-bold text-primary">${additionalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p>Extension is subject to room availability. If the room is already booked 
                 after your current session, the extension cannot be processed.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExtend} disabled={isLoading}>
            {isLoading ? 'Processing...' : `Extend by ${additionalHours} Hour${additionalHours > 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
