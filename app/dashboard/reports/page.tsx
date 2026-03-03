"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Booking = { id: string; status: string }
type Invoice = { id: string; amount: number; status: string }

export default function ReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    fetch('/api/bookings').then(r => (r.ok ? r.json() : [])).then(setBookings)
    fetch('/api/invoices').then(r => (r.ok ? r.json() : [])).then(setInvoices)
  }, [])

  const paidRevenue = useMemo(() => invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0), [invoices])

  return (
    <DashboardPageShell className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <Card><CardHeader><CardTitle>Summary</CardTitle></CardHeader><CardContent className="space-y-2"><p>Total bookings: {bookings.length}</p><p>Paid revenue: ${paidRevenue.toLocaleString()}</p><p>Pending invoices: {invoices.filter(i => i.status === 'PENDING').length}</p></CardContent></Card>
    </DashboardPageShell>
  )
}
