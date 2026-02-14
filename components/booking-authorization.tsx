"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DigitalSignaturePad } from '@/components/digital-signature-pad'
import { AlertCircle, FileText, PenLine, CheckCircle2 } from 'lucide-react'

interface BookingAuthorizationProps {
  onAuthorizationComplete: (authorization: {
    signatureType: 'DIGITAL_SIGNATURE' | 'CHECKBOX_ACKNOWLEDGMENT'
    signatureData?: string | null
    acknowledged: boolean
  }) => void
  bookingSummary?: {
    totalAmount: number
    depositAmount: number
    rooms: string[]
    date: string
    time: string
  }
}

export function BookingAuthorization({
  onAuthorizationComplete,
  bookingSummary,
}: BookingAuthorizationProps) {
  const [signatureType, setSignatureType] = useState<'DIGITAL_SIGNATURE' | 'CHECKBOX_ACKNOWLEDGMENT'>('CHECKBOX_ACKNOWLEDGMENT')
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [checkboxAcknowledged, setCheckboxAcknowledged] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignatureChange = (data: string | null) => {
    setSignatureData(data)
  }

  const canProceed = () => {
    if (signatureType === 'DIGITAL_SIGNATURE') {
      return signatureData !== null
    }
    return checkboxAcknowledged
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setIsSubmitting(true)
    
    try {
      onAuthorizationComplete({
        signatureType,
        signatureData: signatureType === 'DIGITAL_SIGNATURE' ? signatureData : null,
        acknowledged: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Booking Authorization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review and authorize this booking before making a deposit.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Summary */}
        {bookingSummary && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Booking Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2">{bookingSummary.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <span className="ml-2">{bookingSummary.time}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Room(s):</span>
                <span className="ml-2">{bookingSummary.rooms.join(', ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>
                <span className="ml-2 font-medium">${bookingSummary.totalAmount.toFixed(2)}</span>
              </div>
              {bookingSummary.depositAmount > 0 && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Deposit Required:</span>
                  <span className="ml-2 font-bold text-primary">${bookingSummary.depositAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Authorization Method Selection */}
        <div className="space-y-3">
          <h4 className="font-medium">Choose Authorization Method</h4>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={signatureType === 'CHECKBOX_ACKNOWLEDGMENT' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSignatureType('CHECKBOX_ACKNOWLEDGMENT')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Checkbox
            </Button>
            <Button
              type="button"
              variant={signatureType === 'DIGITAL_SIGNATURE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSignatureType('DIGITAL_SIGNATURE')}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Digital Signature
            </Button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 max-h-48 overflow-y-auto text-sm">
          <h5 className="font-medium mb-2">Terms and Conditions</h5>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <strong>Deposit Policy:</strong> By authorizing this booking, you agree to pay the 
              specified deposit amount. The deposit is non-refundable but may be applied to 
              future bookings if cancellation is made at least 48 hours in advance.
            </p>
            <p>
              <strong>Room Assignment:</strong> Rooms may be swapped at any time. Pricing will 
              reflect the assigned room rate at the time of service.
            </p>
            <p>
              <strong>Cancellation Policy:</strong> Cancellations made less than 24 hours before 
              the scheduled session may result in forfeiture of the deposit.
            </p>
            <p>
              <strong>Session Extension:</strong> Additional time may be purchased subject to 
              availability. Extended time will be charged at the current room rate.
            </p>
            <p>
              <strong>Chargeback Policy:</strong> This authorization serves as proof of consent 
              for the specified charges. Any disputes or chargebacks will be contested using 
              this signed authorization.
            </p>
          </div>
        </div>

        {/* Authorization Input */}
        {signatureType === 'CHECKBOX_ACKNOWLEDGMENT' ? (
          <div className="flex items-start space-x-3">
            <Checkbox
              id="authorization-checkbox"
              checked={checkboxAcknowledged}
              onCheckedChange={(checked) => setCheckboxAcknowledged(checked as boolean)}
            />
            <label
              htmlFor="authorization-checkbox"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I have read and agree to the terms and conditions. I authorize Platinum Sound 
              Studios to charge the deposit amount to my selected payment method. I understand 
              this authorization will be used to contest any disputes or chargebacks.
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please sign below to authorize this booking and agree to the terms and conditions.
            </p>
            <DigitalSignaturePad
              onSignatureChange={handleSignatureChange}
              width={450}
              height={150}
            />
          </div>
        )}

        {/* Warning Notice */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> This authorization will be stored, timestamped, and 
            attached to your booking. It will be used as evidence in case of payment disputes.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          className="w-full"
          size="lg"
          disabled={!canProceed() || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Processing...' : 'Authorize & Continue to Payment'}
        </Button>
      </CardContent>
    </Card>
  )
}
