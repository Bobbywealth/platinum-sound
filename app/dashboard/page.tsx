"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { DashboardSkeleton } from "@/components/skeletons"
import { StatCard } from "@/components/stat-card"
import { formatCurrency } from "@/lib/utils"
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
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
  recentActivity: ActivityItem[]
  revenueChart: ChartData[]
}

interface ActivityItem {
  id: string
  type: "booking" | "client" | "invoice" | "payment"
  title: string
  description: string
  timestamp: string
}

interface ChartData {
  name: string
  revenue: number
  bookings: number
}

interface Session {
  id: string
  artist: string
  studio: string
  studioType: string
  time: string
  engineer: string
  status: "active" | "upcoming" | "completed"
}

const defaultStats: DashboardData["stats"] = {
  totalRevenue: 0,
  revenueChange: 0,
  activeClients: 0,
  clientsChange: 0,
  activeBookings: 0,
  bookingsChange: 0,
  pendingInvoices: 0,
  pendingAmount: 0,
}

// Mock sessions data - in production, fetch from API
const todaysSessions: Session[] = [
  {
    id: "1",
    artist: "Drake",
    studio: "Studio A",
    studioType: "Neve",
    time: "10:00 AM",
    engineer: "Noel Cadastre",
    status: "active",
  },
  {
    id: "2",
    artist: "Rihanna",
    studio: "Studio B",
    studioType: "SSL",
    time: "02:00 PM",
    engineer: "Young Guru",
    status: "upcoming",
  },
  {
    id: "3",
    artist: "External Client",
    studio: "Studio B",
    studioType: "SSL",
    time: "09:00 PM",
    engineer: "TBD",
    status: "upcoming",
  },
]

const upcomingSessions: Session[] = [
  {
    id: "4",
    artist: "Beyonce",
    studio: "Studio A",
    studioType: "Neve",
    time: "Tomorrow, 11:00 AM",
    engineer: "Young Guru",
    status: "upcoming",
  },
  {
    id: "5",
    artist: "Jay-Z",
    studio: "Studio C",
    studioType: "API",
    time: "Tomorrow, 03:00 PM",
    engineer: "Noel Cadastre",
    status: "upcoming",
  },
]

function Waveform() {
  return (
    <div className="flex items-center gap-[2px] h-8 flex-1 mx-4">
      {Array.from({ length: 60 }).map((_, i) => {
        const height = Math.random() * 100
        return (
          <div
            key={i}
            className="w-px bg-[#C4A77D]/40 rounded-full"
            style={{ height: `${Math.max(15, height)}%` }}
          />
        )
      })}
    </div>
  )
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-[#FAFAF8] rounded-xl hover:bg-[#F5F3EF] transition-colors sm:flex-nowrap">
      <div className={`w-2.5 h-2.5 rounded-full ${session.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />

      <div className="min-w-[120px] sm:min-w-[140px]">
        <p className="font-semibold text-gray-900">{session.artist}</p>
        <p className="text-sm text-gray-500">
          {session.studio} ({session.studioType})
        </p>
      </div>

      <Waveform />

      <div className="text-right min-w-[100px] sm:min-w-[120px]">
        <p className="font-semibold text-gray-900">{session.time}</p>
        <p className="text-sm text-gray-500">{session.engineer}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) {
          throw new Error(`Dashboard request failed with status ${res.status}`)
        }

        const dashboardData: DashboardData = await res.json()
        setData(dashboardData)
      } catch (error) {
        setHasError(true)
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const stats = data?.stats ?? defaultStats

  return (
    <DashboardPageShell className="space-y-4 sm:space-y-8 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">Track your studio&apos;s performance at a glance</p>
        {hasError ? <p className="text-sm text-amber-600 mt-2">Some data could not be loaded. Showing defaults.</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue ?? 0)} change={stats.revenueChange ?? 0} icon={DollarSign} />
        <StatCard title="Active Clients" value={(stats.activeClients ?? 0).toString()} change={stats.clientsChange ?? 0} icon={Users} />
        <StatCard title="Active Bookings" value={(stats.activeBookings ?? 0).toString()} change={stats.bookingsChange ?? 0} icon={Calendar} />
        <StatCard
          title="Pending Invoices"
          value={(stats.pendingInvoices ?? 0).toString()}
          description={`${formatCurrency(stats.pendingAmount ?? 0)} pending`}
          icon={TrendingUp}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Sessions</h2>
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {todaysSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <Link
            href="/dashboard/bookings"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </DashboardPageShell>
  )
}
