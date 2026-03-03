"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Booking = { id: string; date: string; sessionType: string; client: { name: string } }
type Invoice = { id: string; amount: number; status: "PAID" | "PENDING" | "OVERDUE"; issuedDate: string }
type Expense = { id: string; category: string; amount: number }
type Client = { id: string; status: string }

export default function AnalyticsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then(r => (r.ok ? r.json() : [])),
      fetch('/api/invoices').then(r => (r.ok ? r.json() : [])),
      fetch('/api/expenses').then(r => (r.ok ? r.json() : [])),
      fetch('/api/clients').then(r => (r.ok ? r.json() : [])),
    ]).then(([b, i, e, c]) => {
      setBookings(b)
      setInvoices(i)
      setExpenses(e)
      setClients(c)
    })
  }, [])

  const totalRevenue = useMemo(() => invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0), [invoices])
  const activeClients = useMemo(() => clients.filter(c => c.status === 'ACTIVE').length, [clients])

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>()
    expenses.forEach(e => map.set(e.category, (map.get(e.category) ?? 0) + e.amount))
    return Array.from(map.entries()).map(([category, amount]) => ({ category, amount }))
  }, [expenses])

  return (
    <DashboardPageShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">All analytics are sourced from live database records.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader><CardContent>${totalRevenue.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>Active Clients</CardTitle></CardHeader><CardContent>{activeClients}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Sessions</CardTitle></CardHeader><CardContent>{bookings.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent>${expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>{expenseByCategory.length === 0 ? 'No expense data yet.' : 'From database expenses table.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
