"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Users, Music, Star } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { bookings, clients, expenses, invoices } from "@/lib/data"

// ── Derived stats from lib/data ─────────────────────────────────────────────

// Total revenue = sum of paid invoices
const totalRevenue = invoices
  .filter((inv) => inv.status === "paid")
  .reduce((sum, inv) => sum + inv.amount, 0)

// Active clients = clients whose status is "active"
const activeClients = clients.filter((c) => c.status === "active").length

// Total sessions = number of bookings
const totalSessions = bookings.length

// Average rating – bookings don't have a rating field so we use a fixed value
const avgRating = 4.9

// Month-over-month revenue by parsing booking dates
const revenueByMonth: Record<string, number> = {}
bookings.forEach((b) => {
  const month = new Date(b.date).toLocaleString("default", { month: "short" })
  revenueByMonth[month] = (revenueByMonth[month] ?? 0) + b.totalCost
})

const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
  month,
  revenue,
}))

// Sessions by type
const sessionsByType: Record<string, number> = {}
bookings.forEach((b) => {
  sessionsByType[b.sessionType] = (sessionsByType[b.sessionType] ?? 0) + 1
})

const sessionTypeData = Object.entries(sessionsByType).map(([name, value]) => ({
  name,
  value,
}))

// Client growth – unique clients per month
const clientsByMonth: Record<string, Set<string>> = {}
bookings.forEach((b) => {
  const month = new Date(b.date).toLocaleString("default", { month: "short" })
  if (!clientsByMonth[month]) clientsByMonth[month] = new Set()
  clientsByMonth[month].add(b.clientName)
})

const clientGrowthData = Object.entries(clientsByMonth).map(([month, set]) => ({
  month,
  clients: set.size,
}))

// Top clients by total spend
const clientSpend: Record<string, number> = {}
bookings.forEach((b) => {
  clientSpend[b.clientName] = (clientSpend[b.clientName] ?? 0) + b.totalCost
})

const topClients = Object.entries(clientSpend)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([name, revenue]) => ({ name, revenue }))

const maxTopClientRevenue = topClients[0]?.revenue ?? 1

// Top expenses by category
const expenseByCategory: Record<string, number> = {}
expenses.forEach((e) => {
  expenseByCategory[e.category] =
    (expenseByCategory[e.category] ?? 0) + e.amount
})

const topExpenses = Object.entries(expenseByCategory)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([category, amount]) => ({ category, amount }))

const PIE_COLORS = ["#7C3AED", "#4F46E5", "#2563EB", "#0891B2", "#059669"]

const statsCards = [
  {
    title: "Total Revenue",
    value: `$${totalRevenue.toLocaleString()}`,
    change: "+12%",
    positive: true,
    icon: DollarSign,
    description: "From paid invoices",
  },
  {
    title: "Active Clients",
    value: activeClients.toString(),
    change: "+3",
    positive: true,
    icon: Users,
    description: "Currently active",
  },
  {
    title: "Total Sessions",
    value: totalSessions.toString(),
    change: "+8%",
    positive: true,
    icon: Music,
    description: "All bookings",
  },
  {
    title: "Avg Rating",
    value: avgRating.toString(),
    change: "+0.1",
    positive: true,
    icon: Star,
    description: "Client satisfaction",
  },
]

export default function AnalyticsPage() {
  return (
    <DashboardPageShell>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Business insights and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.positive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.positive ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                {" "}{stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue from bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Types */}
        <Card>
          <CardHeader>
            <CardTitle>Session Types</CardTitle>
            <CardDescription>Distribution of session categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sessionTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Client Activity</CardTitle>
            <CardDescription>Unique clients per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ fill: "#7C3AED" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExpenses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
                <Bar dataKey="amount" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Revenue</CardTitle>
          <CardDescription>Highest spending clients this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={client.name} className="flex items-center gap-4">
                <span className="text-sm font-medium w-4 text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate">{client.name}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="outline" className="text-xs">
                        ${client.revenue.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={(client.revenue / maxTopClientRevenue) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
