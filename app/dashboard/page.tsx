"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatTime, getRelativeTime } from "@/lib/utils"
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react"
import Link from "next/link"

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
  todaySessions: Array<{
    time: string
    artist: string
    studio: string
    engineer: string
    status: "active" | "pending" | "booked"
  }>
  upcomingBookings: Array<{
    id: string
    clientName: string
    studio: string
    date: string
    startTime: string
    endTime: string
    status: string
    isVip?: boolean
  }>
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        const dashboardData = await res.json()
        setData(dashboardData)
      } catch (error) {
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

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.stats.totalRevenue)}
          change={data.stats.revenueChange}
          icon={DollarSign}
        />
        <StatCard
          title="Active Clients"
          value={data.stats.activeClients.toString()}
          change={data.stats.clientsChange}
          icon={Users}
        />
        <StatCard
          title="Active Bookings"
          value={data.stats.activeBookings.toString()}
          change={data.stats.bookingsChange}
          icon={Calendar}
        />
        <StatCard
          title="Pending Invoices"
          value={data.stats.pendingInvoices.toString()}
          subtitle={formatCurrency(data.stats.pendingAmount)}
          icon={Activity}
          variant="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Sessions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.todaySessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        session.status === "active"
                          ? "bg-green-500 animate-pulse"
                          : session.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{session.artist}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.studio}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{session.time}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.engineer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    {booking.isVip && (
                      <Badge variant="warning">VIP</Badge>
                    )}
                    <div>
                      <p className="font-medium">{booking.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.studio} • {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "success"
                          : booking.status === "pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Studio Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Studio A Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Session</span>
                <span className="font-medium">Drake - Recording</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engineer</span>
                <span className="font-medium">Noel Cadastre</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Available</span>
                <span className="font-medium">10:00 PM</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-500 font-medium">
                  In Session
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Studio B Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Session</span>
                <span className="font-medium">Rihanna - Recording</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engineer</span>
                <span className="font-medium">Young Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Available</span>
                <span className="font-medium">8:00 PM</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-500 font-medium">
                  In Session
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  variant,
}: {
  title: string
  value: string
  change?: number
  subtitle?: string
  icon: React.ElementType
  variant?: "default" | "warning"
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(change !== undefined || subtitle) && (
          <div className="flex items-center gap-2">
            {change !== undefined && (
              <span
                className={`text-xs font-medium ${
                  change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
