"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "recharts"
import { Download, TrendingUp, DollarSign, Calendar, Users } from "lucide-react"

const monthlyRevenue = [
  { month: "Jan", revenue: 18500, bookings: 24 },
  { month: "Feb", revenue: 22000, bookings: 28 },
  { month: "Mar", revenue: 19800, bookings: 25 },
  { month: "Apr", revenue: 25600, bookings: 32 },
  { month: "May", revenue: 28900, bookings: 36 },
  { month: "Jun", revenue: 32400, bookings: 41 },
  { month: "Jul", revenue: 29700, bookings: 38 },
  { month: "Aug", revenue: 35200, bookings: 44 },
  { month: "Sep", revenue: 31800, bookings: 40 },
  { month: "Oct", revenue: 38900, bookings: 49 },
]

const studioUtilization = [
  { name: "Studio A", value: 78 },
  { name: "Studio B", value: 65 },
  { name: "Studio C", value: 45 },
]

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "bookings", label: "Bookings" },
    { id: "engineers", label: "Engineers" },
  ]

  return (
    <DashboardPageShell className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
            Reports & Analytics
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Insights into studio performance and revenue
          </p>
        </div>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">$282.8K</p>
                <p className="text-xs text-green-600 mt-1">+12.5% vs last year</p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold">357</p>
                <p className="text-xs text-green-600 mt-1">+8.3% vs last year</p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Session Rate</p>
                <p className="text-xl sm:text-2xl font-bold">$792</p>
                <p className="text-xs text-green-600 mt-1">+3.8% vs last year</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Engineers</p>
                <p className="text-xl sm:text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground mt-1">2 on leave</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Studio Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={studioUtilization}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studioUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {studioUtilization.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Trend */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Bookings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
