"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import {
    Activity,
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react"
import { useEffect, useState } from "react"

interface AnalyticsData {
  revenueByMonth: Array<{ month: string; revenue: number }>
  bookingsByStudio: Array<{ studio: string; count: number }>
  clientAcquisition: Array<{ month: string; clients: number }>
  revenueBySessionType: Array<{ type: string; amount: number }>
  occupancyRate: number
  averageSessionValue: number
  totalRevenue: number
  revenueGrowth: number
  activeClients: number
  clientGrowth: number
  totalBookings: number
  bookingGrowth: number
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockData: AnalyticsData = {
          revenueByMonth: [
            { month: "Jan", revenue: 85000 },
            { month: "Feb", revenue: 92000 },
            { month: "Mar", revenue: 78000 },
            { month: "Apr", revenue: 105000 },
            { month: "May", revenue: 118000 },
            { month: "Jun", revenue: 125000 },
          ],
          bookingsByStudio: [
            { studio: "Studio A", count: 45 },
            { studio: "Studio B", count: 38 },
          ],
          clientAcquisition: [
            { month: "Jan", clients: 3 },
            { month: "Feb", clients: 5 },
            { month: "Mar", clients: 4 },
            { month: "Apr", clients: 7 },
            { month: "May", clients: 6 },
            { month: "Jun", clients: 8 },
          ],
          revenueBySessionType: [
            { type: "Recording", amount: 320000 },
            { type: "Mixing", amount: 185000 },
            { type: "Mastering", amount: 75000 },
            { type: "Production", amount: 120000 },
          ],
          occupancyRate: 78,
          averageSessionValue: 4500,
          totalRevenue: 700000,
          revenueGrowth: 12.5,
          activeClients: 24,
          clientGrowth: 8.3,
          totalBookings: 156,
          bookingGrowth: 15.2,
        }

        setData(mockData)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track studio performance and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          change={data.revenueGrowth}
          icon={DollarSign}
        />
        <MetricCard
          title="Active Clients"
          value={data.activeClients.toString()}
          change={data.clientGrowth}
          icon={Users}
        />
        <MetricCard
          title="Total Bookings"
          value={data.totalBookings.toString()}
          change={data.bookingGrowth}
          icon={Calendar}
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${data.occupancyRate}%`}
          subtitle={formatCurrency(data.averageSessionValue)}
          icon={Activity}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end gap-2">
              {data.revenueByMonth.map((item, index) => {
                const maxRevenue = Math.max(...data.revenueByMonth.map((m) => m.revenue))
                const height = (item.revenue / maxRevenue) * 100
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Session Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Revenue by Session Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenueBySessionType.map((item, index) => {
                const total = data.revenueBySessionType.reduce((sum, i) => sum + i.amount, 0)
                const percentage = (item.amount / total) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Studio Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Studio Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.bookingsByStudio.map((studio, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{studio.studio}</span>
                  <span className="text-sm font-medium">
                    {studio.count} bookings
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(studio.count / data.totalBookings) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-1">
              {data.clientAcquisition.map((item, index) => {
                const maxClients = Math.max(
                  ...data.clientAcquisition.map((m) => m.clients)
                )
                const height = (item.clients / maxClients) * 100
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-green-500/80 rounded-t"
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {data.clientAcquisition.map((item, index) => (
                <span key={index}>{item.month}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg. Session Duration</span>
              <span className="font-medium">4.5 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Peak Hours</span>
              <span className="font-medium">2PM - 10PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">VIP Clients</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Repeat Clients</span>
              <span className="font-medium">75%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
}: {
  title: string
  value: string
  change?: number
  subtitle?: string
  icon: React.ElementType
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
                className={`text-xs font-medium flex items-center gap-1 ${
                  change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(change)}%
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

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
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
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
