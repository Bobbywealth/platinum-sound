"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { DashboardSkeleton } from "@/components/skeletons"
import { formatCurrency, formatDate, getRelativeTime, cn } from "@/lib/utils"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import {
    Calendar,
    Clock,
    DollarSign,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react"
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
        // Use mock data as fallback
        setData({
          stats: {
            totalRevenue: 12450,
            revenueChange: 12.5,
            activeClients: 48,
            clientsChange: 8.2,
            activeBookings: 15,
            bookingsChange: -3.4,
            pendingInvoices: 7,
            pendingAmount: 3450,
          },
          recentActivity: [
            {
              id: "1",
              type: "booking",
              title: "New Booking",
              description: "John Doe booked Studio A for tomorrow at 2 PM",
              timestamp: new Date(Date.now() - 300000).toISOString(),
            },
            {
              id: "2",
              type: "payment",
              title: "Payment Received",
              description: "Acme Corp paid invoice #1234 ($500)",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "3",
              type: "client",
              title: "New Client",
              description: "Sarah Wilson registered as a new client",
              timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              id: "4",
              type: "invoice",
              title: "Invoice Sent",
              description: "Invoice #1235 sent to TechStart Inc.",
              timestamp: new Date(Date.now() - 10800000).toISOString(),
            },
            {
              id: "5",
              type: "booking",
              title: "Session Completed",
              description: "Recording session in Studio B completed successfully",
              timestamp: new Date(Date.now() - 14400000).toISOString(),
            },
          ],
          revenueChart: [
            { name: "Mon", revenue: 1200, bookings: 4 },
            { name: "Tue", revenue: 1800, bookings: 6 },
            { name: "Wed", revenue: 2400, bookings: 8 },
            { name: "Thu", revenue: 1600, bookings: 5 },
            { name: "Fri", revenue: 3200, bookings: 10 },
            { name: "Sat", revenue: 2800, bookings: 9 },
            { name: "Sun", revenue: 1450, bookings: 4 },
          ],
        })
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
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/bookings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </Link>
          <Link href="/dashboard/clients">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>
      </div>

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
          description={`${formatCurrency(data.stats.pendingAmount)} pending`}
          icon={Clock}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueChart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(43, 76%, 56%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(43, 76%, 56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(240, 3.8%, 46.1%)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(240, 3.8%, 46.1%)" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240, 10%, 3.9%)",
                      border: "1px solid hsl(240, 5.9%, 90%)",
                      borderRadius: "8px",
                      color: "hsl(0, 0%, 98%)",
                    }}
                    formatter={(value: number) => [`$${value}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(43, 76%, 56%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <Link
              href="/dashboard/activity"
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              View all activity
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const getActivityIcon = () => {
    switch (activity.type) {
      case "booking":
        return <Calendar className="h-4 w-4" />
      case "client":
        return <Users className="h-4 w-4" />
      case "invoice":
        return <DollarSign className="h-4 w-4" />
      case "payment":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActivityColor = () => {
    switch (activity.type) {
      case "booking":
        return "bg-blue-500/10 text-blue-500"
      case "client":
        return "bg-green-500/10 text-green-500"
      case "invoice":
        return "bg-yellow-500/10 text-yellow-500"
      case "payment":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className={cn("p-2 rounded-full", getActivityColor())}>
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-sm text-muted-foreground truncate">
          {activity.description}
        </p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {getRelativeTime(activity.timestamp)}
      </span>
    </div>
  )
}
