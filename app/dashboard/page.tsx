"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { DashboardSkeleton } from "@/components/skeletons"
import { StatCard } from "@/components/stat-card"
import { formatCurrency } from "@/lib/utils"
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardData {
  stats: {
    totalRevenue: number
    revenueChange: number
    activeClients: number
    clientsChange: number
    activeBookings: number
    bookingsChange: number
    pendingInvoices: number
    pendingAmount: number
  }
  todaySessions: Array<{ id: string; client: { name: string }; studio: string; startTime: string; engineer: string }>
  upcomingBookings: Array<{ id: string; client: { name: string }; date: string; startTime: string; studio: string }>
}

const defaultStats = { totalRevenue: 0, revenueChange: 0, activeClients: 0, clientsChange: 0, activeBookings: 0, bookingsChange: 0, pendingInvoices: 0, pendingAmount: 0 }

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardSkeleton />
  const stats = data?.stats ?? defaultStats

  return (
    <DashboardPageShell className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} change={stats.revenueChange} />
        <StatCard title="Active Clients" value={String(stats.activeClients)} icon={Users} change={stats.clientsChange} />
        <StatCard title="Active Bookings" value={String(stats.activeBookings)} icon={Calendar} change={stats.bookingsChange} />
        <StatCard title="Pending Invoices" value={String(stats.pendingInvoices)} description={`${formatCurrency(stats.pendingAmount)} pending`} icon={TrendingUp} />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Today's Sessions</h2>
        {(data?.todaySessions?.length ?? 0) === 0 ? <p className="text-muted-foreground">No sessions today.</p> : data?.todaySessions.map(s => <p key={s.id}>{s.client.name} • {s.studio} • {s.startTime}</p>)}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Upcoming Bookings</h2>
        {(data?.upcomingBookings?.length ?? 0) === 0 ? <p className="text-muted-foreground">No upcoming bookings.</p> : data?.upcomingBookings.map(b => <p key={b.id}>{b.client.name} • {new Date(b.date).toLocaleDateString()} • {b.startTime}</p>)}
      </div>
    </DashboardPageShell>
  )
}
