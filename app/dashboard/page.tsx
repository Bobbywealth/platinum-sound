"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatTime, getRelativeTime } from "@/lib/utils"
import { SectionHeader } from "@/components/section-header"
import { StatCard } from "@/components/stat-card"
import { DarkSection } from "@/components/dark-section"
import { CTASection } from "@/components/cta-section"
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
    <div className="space-y-12">
      {/* Stats Grid */}
      <SectionHeader
        title="Overview"
        description="Track your studio's performance at a glance"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          description={`${formatCurrency(data.stats.pendingAmount)} pending`}
          icon={Activity}
        />
      </div>

      {/* Today's Sessions */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <CardTitle className="text-2xl">Today's Sessions</CardTitle>
            <Button variant="outline" size="lg">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6">
              {data.todaySessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        session.status === "active"
                          ? "bg-green-500 animate-pulse"
                          : session.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-xl font-medium">{session.artist}</p>
                      <p className="text-lg text-muted-foreground">
                        {session.studio}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium">{session.time}</p>
                    <p className="text-lg text-muted-foreground">
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
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <CardTitle className="text-2xl">Upcoming Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="outline" size="lg">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6">
              {data.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-6 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-6">
                    {booking.isVip && (
                      <Badge variant="warning" className="text-lg px-4 py-1">VIP</Badge>
                    )}
                    <div>
                      <p className="text-xl font-medium">{booking.clientName}</p>
                      <p className="text-lg text-muted-foreground">
                        {booking.studio} • {formatTime(booking.startTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "success"
                          : booking.status === "pending"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-lg px-4 py-1"
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
      <DarkSection>
        <SectionHeader
          title="Studio Status"
          description="Real-time overview of your recording studios"
          action={
            <Link href="/dashboard/studios">
              <Button variant="secondary" size="lg">
                Manage Studios
              </Button>
            </Link>
          }
        />
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <div className="space-y-6 p-8 rounded-lg bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Current Session</span>
              <span className="text-xl font-medium">Drake - Recording</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Engineer</span>
              <span className="text-xl font-medium">Noel Cadastre</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Next Available</span>
              <span className="text-xl font-medium">10:00 PM</span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-5 h-5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg text-green-500 font-medium">
                In Session
              </span>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-lg bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Current Session</span>
              <span className="text-xl font-medium">Rihanna - Recording</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Engineer</span>
              <span className="text-xl font-medium">Young Guru</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-400">Next Available</span>
              <span className="text-xl font-medium">8:00 PM</span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-5 h-5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg text-green-500 font-medium">
                In Session
              </span>
            </div>
          </div>
        </div>
      </DarkSection>

      {/* CTA Section */}
      <CTASection
        title="Ready to book a session?"
        description="Schedule your next recording session in just a few clicks"
        buttonText="Book Now"
        buttonHref="/dashboard/bookings"
      />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
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
