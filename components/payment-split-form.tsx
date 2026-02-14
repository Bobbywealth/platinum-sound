"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, DollarSign, CreditCard, Wallet } from 'lucide-react'

interface PaymentSplit {
  id?: string
  method: string
  amount: number
  reference?: string
  notes?: string
  recordedAt?: Date
  recordedBy?: string
}

interface PaymentSplitFormProps {
  totalAmount: number
  existingPayments?: PaymentSplit[]
  onPaymentsChange: (payments: PaymentSplit[]) => void
  readOnly?: boolean
}

const paymentMethods = [
  { value: 'CASH', label: 'Cash', icon: Wallet },
  { value: 'CASH_APP', label: 'Cash App', icon: DollarSign },
  { value: 'ZELLE', label: 'Zelle', icon: DollarSign },
  { value: 'SQUARE', label: 'Square', icon: CreditCard },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: DollarSign },
  { value: 'OTHER', label: 'Other', icon: DollarSign },
]

export function PaymentSplitForm({
  totalAmount,
  existingPayments = [],
  onPaymentsChange,
  readOnly = false,
}: PaymentSplitFormProps) {
  const [payments, setPayments] = useState<PaymentSplit[]>(existingPayments)
  const [newPayment, setNewPayment] = useState<PaymentSplit>({
    method: '',
    amount: 0,
    reference: '',
    notes: '',
  })

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = totalAmount - totalPaid

  const handleAddPayment = () => {
    if (!newPayment.method || newPayment.amount <= 0) return

    const updatedPayments = [...payments, { ...newPayment, recordedAt: new Date() }]
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
    
    // Reset form
    setNewPayment({
      method: '',
      amount: 0,
      reference: '',
      notes: '',
    })
  }

  const handleRemovePayment = (index: number) => {
    const updatedPayments = payments.filter((_, i) => i !== index)
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
  }

  const getMethodLabel = (value: string) => {
    return paymentMethods.find(m => m.value === value)?.label || value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Splits
          </span>
          <div className="text-sm font-normal">
            Total: <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-lg font-bold text-green-600">${totalPaid.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-lg font-bold ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              ${remaining.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Existing Payments */}
        {payments.length > 0 && (
          <div className="space-y-2">
            <Label>Recorded Payments</Label>
            {payments.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{getMethodLabel(payment.method)}</Badge>
                  <span className="font-medium">${payment.amount.toFixed(2)}</span>
                  {payment.reference && (
                    <span className="text-sm text-muted-foreground">
                      Ref: {payment.reference}
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePayment(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Payment */}
        {!readOnly && remaining > 0 && (
          <div className="space-y-4 p-4 border rounded-lg">
            <Label className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Payment
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
                    className="pl-8"
                    max={remaining}
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Reference (Optional)</Label>
              <Input
                placeholder="Transaction ID, confirmation number, etc."
                value={newPayment.reference}
                onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Additional notes about this payment"
                value={newPayment.notes}
                onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                rows={2}
              />
            </div>
            
            <Button
              onClick={handleAddPayment}
              disabled={!newPayment.method || newPayment.amount <= 0}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </div>
        )}

        {/* Fully Paid Message */}
        {remaining <= 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✓ Fully Paid
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
