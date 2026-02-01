import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Users, Calendar, DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { dashboardStats, todaySessions, bookings, invoices } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending" || inv.status === "overdue")
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <div className="flex gap-2">
          <Link href="/dashboard/bookings">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{dashboardStats.revenueChange}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{dashboardStats.clientsChange}</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{dashboardStats.bookingsChange}%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(dashboardStats.pendingAmount)} outstanding
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today&apos;s Sessions
            </CardTitle>
            <Link href="/dashboard/schedule">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-primary min-w-[80px]">
                      {session.time}
                    </div>
                    <div>
                      <div className="font-medium">{session.artist}</div>
                      <div className="text-sm text-muted-foreground">{session.studio}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      {session.engineer}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`status-dot ${
                          session.status === "active"
                            ? "status-active"
                            : session.status === "pending"
                            ? "status-pending"
                            : "status-booked"
                        }`}
                      />
                      <span className="text-xs capitalize">{session.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Bookings
            </CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-primary min-w-[80px]">
                      {booking.date.split("-").slice(1).join("/")}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {booking.clientName}
                        {booking.isVip && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">VIP</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.studio} | {booking.sessionType}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.startTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices Alert */}
      {pendingInvoices.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertCircle className="h-5 w-5" />
              Action Required: Pending Invoices
            </CardTitle>
            <Link href="/dashboard/invoices">
              <Button variant="outline" size="sm">View Invoices</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingInvoices.slice(0, 3).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">{invoice.id}</span>
                    <span>{invoice.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        invoice.status === "overdue"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Studio Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-medium">Studio A (Neve 88R)</div>
                  <div className="text-sm text-muted-foreground">Drake - Recording Session</div>
                </div>
                <span className="flex items-center gap-2 text-green-500">
                  <span className="status-dot status-active" />
                  In Use
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <div className="font-medium">Studio B (SSL 9000K)</div>
                  <div className="text-sm text-muted-foreground">Next: Rihanna @ 2:00 PM</div>
                </div>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="status-dot" style={{ backgroundColor: "#666" }} />
                  Available
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Staff On Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Jerry 'Wonda' Duplessis", role: "Producer", status: "Studio A" },
                { name: "Noel Cadastre", role: "Engineer", status: "Studio A" },
                { name: "Young Guru", role: "Head Engineer", status: "Available" },
              ].map((staff, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{staff.name}</div>
                    <div className="text-sm text-muted-foreground">{staff.role}</div>
                  </div>
                  <span
                    className={`text-sm ${
                      staff.status === "Available" ? "text-muted-foreground" : "text-primary"
                    }`}
                  >
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
