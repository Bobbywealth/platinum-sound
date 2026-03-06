"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { DashboardSkeleton } from "@/components/skeletons"
import { StatCard } from "@/components/stat-card"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Clock, DollarSign, Plus, TrendingUp, Users, UserPlus, Activity, Music, CheckCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface ActivityItem {
  id: string
  type: 'booking' | 'invoice' | 'client'
  title: string
  description: string
  timestamp: string
}

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
    id: string; 
    client: { firstName: string; lastName: string; email: string; phone: string }; 
    studio: string; 
    startTime: string;
    endTime: string;
    engineer: string;
  }>
  upcomingBookings: Array<{ 
    id: string; 
    client: { firstName: string; lastName: string }; 
    date: string; 
    startTime: string;
    endTime: string;
    studio: string 
  }>
  recentActivity: ActivityItem[]
  recentInvoices: Array<{
    id: string
    amount: number
    client: { firstName: string; lastName: string }
    dueDate: string
    status: string
  }>
}

const defaultStats = { totalRevenue: 0, revenueChange: 0, activeClients: 0, clientsChange: 0, activeBookings: 0, bookingsChange: 0, pendingInvoices: 0, pendingAmount: 0 }

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (loading) return <DashboardSkeleton />
  const stats = data?.stats ?? defaultStats

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4" />
      case 'invoice': return <DollarSign className="h-4 w-4" />
      case 'client': return <UserPlus className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
      case 'invoice': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      case 'client': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // Get studio status for today
  const studioStatus = ['STUDIO_A', 'STUDIO_B', 'STUDIO_C'].map(studio => {
    const sessions = data?.todaySessions?.filter(s => s.studio === studio) || []
    return {
      name: studio.replace('STUDIO_', 'Studio '),
      inUse: sessions.length > 0,
      sessions: sessions.length
    }
  })

  return (
    <DashboardPageShell className="space-y-6">
      {/* Header with Date/Time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-lg animate-pulse-subtle">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{formatDate(currentTime)}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 animate-slide-left delay-75">
        <Link 
          href="/dashboard/bookings/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all hover-lift"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </Link>
        <Link 
          href="/dashboard/clients?new=true" 
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-all hover-lift"
        >
          <UserPlus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in delay-75 hover-lift transition-transform">
          <StatCard 
            title="This Month's Revenue" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={DollarSign} 
            change={stats.revenueChange} 
          />
        </div>
        <div className="animate-fade-in delay-150 hover-lift transition-transform">
          <StatCard 
            title="Active Clients" 
            value={String(stats.activeClients)} 
            icon={Users} 
            change={stats.clientsChange} 
          />
        </div>
        <div className="animate-fade-in delay-225 hover-lift transition-transform">
          <StatCard 
            title="Active Bookings" 
            value={String(stats.activeBookings)} 
            icon={Calendar} 
            change={stats.bookingsChange} 
          />
        </div>
        <div className="animate-fade-in delay-300 hover-lift transition-transform">
          <StatCard 
            title="Pending Invoices" 
            value={String(stats.pendingInvoices)} 
            description={`${formatCurrency(stats.pendingAmount)} pending`} 
            icon={TrendingUp} 
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Today's Sessions & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Sessions */}
          <div className="bg-card rounded-lg border p-6 animate-fade-in delay-375 hover-lift transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Sessions
              </h2>
              <span className="text-sm text-muted-foreground">
                {data?.todaySessions?.length || 0} sessions
              </span>
            </div>
            {(data?.todaySessions?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground py-4">No sessions scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {data?.todaySessions?.map((session, index) => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors animate-fade-in"
                    style={{ animationDelay: `${450 + index * 75}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center animate-scale-in" style={{ animationDelay: `${500 + index * 75}ms` }}>
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.client.firstName} {session.client.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.studio.replace('STUDIO_', 'Studio ')} • {session.engineer || 'No engineer assigned'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.startTime} - {session.endTime}</p>
                      <p className="text-sm text-muted-foreground">{session.client.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-card rounded-lg border p-6 animate-fade-in delay-450 hover-lift transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Bookings
              </h2>
              <Link href="/dashboard/bookings" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {(data?.upcomingBookings?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground py-4">No upcoming bookings.</p>
            ) : (
              <div className="space-y-3">
                {data?.upcomingBookings?.slice(0, 5).map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors animate-fade-in"
                    style={{ animationDelay: `${500 + index * 75}ms` }}
                  >
                    <div>
                      <p className="font-medium">{booking.client.firstName} {booking.client.lastName}</p>
                      <p className="text-sm text-muted-foreground">{booking.studio.replace('STUDIO_', 'Studio ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invoices */}
          {(data?.recentInvoices?.length ?? 0) > 0 && (
            <div className="bg-card rounded-lg border p-6 animate-fade-in delay-525 hover-lift transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pending Invoices
                </h2>
                <Link href="/dashboard/invoices" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {data?.recentInvoices?.slice(0, 5).map((invoice, index) => (
                  <div 
                    key={invoice.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors animate-fade-in"
                    style={{ animationDelay: `${575 + index * 75}ms` }}
                  >
                    <div>
                      <p className="font-medium">{invoice.client.firstName} {invoice.client.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                      <p className="text-sm text-yellow-600">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Activity & Studio Status */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-card rounded-lg border p-6 animate-fade-in delay-600 hover-lift transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </h2>
            </div>
            {(data?.recentActivity?.length ?? 0) === 0 ? (
              <p className="text-muted-foreground py-4">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {data?.recentActivity?.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex gap-3 animate-fade-in"
                    style={{ animationDelay: `${650 + index * 75}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)} animate-scale-in`} style={{ animationDelay: `${700 + index * 75}ms` }}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Studio Status */}
          <div className="bg-card rounded-lg border p-6 animate-fade-in delay-675 hover-lift transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="h-5 w-5" />
              Studio Status
            </h2>
            <div className="space-y-3">
              {studioStatus.map((studio, index) => (
                <div 
                  key={studio.name} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors animate-fade-in"
                  style={{ animationDelay: `${725 + index * 75}ms` }}
                >
                  <div className="flex items-center gap-3">
                    {studio.inUse ? (
                      <XCircle className="h-5 w-5 text-red-500 animate-pulse-subtle" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <span className="font-medium">{studio.name}</span>
                  </div>
                  <span className={`text-sm ${studio.inUse ? 'text-red-600' : 'text-green-600'}`}>
                    {studio.inUse ? `${studio.sessions} in use` : 'Available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  )
}
