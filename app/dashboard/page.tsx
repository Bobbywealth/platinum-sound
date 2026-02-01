"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatTime } from "@/lib/utils"
import { SectionHeader } from "@/components/section-header"
import { StatCard } from "@/components/stat-card"
import { DarkSection } from "@/components/dark-section"
import { CTASection } from "@/components/cta-section"
import { AudioWaveform } from "@/components/audio-waveform"
import { motion } from "framer-motion"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
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
    <motion.div
      className="space-y-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Audio Waveform Background */}
      <AudioWaveform />

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="Overview"
          description="Track your studio's performance at a glance"
        />
      </motion.div>
      <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.stats.totalRevenue)}
          change={data.stats.revenueChange}
          icon={DollarSign}
          index={0}
        />
        <StatCard
          title="Active Clients"
          value={data.stats.activeClients.toString()}
          change={data.stats.clientsChange}
          icon={Users}
          index={1}
        />
        <StatCard
          title="Active Bookings"
          value={data.stats.activeBookings.toString()}
          change={data.stats.bookingsChange}
          icon={Calendar}
          index={2}
        />
        <StatCard
          title="Pending Invoices"
          value={data.stats.pendingInvoices.toString()}
          description={`${formatCurrency(data.stats.pendingAmount)} pending`}
          icon={Activity}
          index={3}
        />
      </motion.div>

      {/* Today's Sessions & Upcoming Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Today's Sessions</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.todaySessions.map((session, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-2 h-2 rounded-full ${
                          session.status === "active"
                            ? "bg-green-500"
                            : session.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-primary"
                        }`}
                        animate={
                          session.status === "active"
                            ? {
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: session.status === "active" ? 1.5 : 0,
                          repeat: session.status === "active" ? Infinity : 0,
                        }}
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="card-hover">
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
                {data.upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {booking.isVip && (
                        <Badge variant="warning">VIP</Badge>
                      )}
                      <div>
                        <p className="font-medium">{booking.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.studio} - {formatTime(booking.startTime)}
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Studio Status */}
      <motion.div variants={itemVariants}>
        <DarkSection>
          <SectionHeader
            title="Studio Status"
            description="Real-time overview of your recording studios"
            action={
              <Link href="/dashboard/studios">
                <Button variant="secondary" size="sm">
                  Manage Studios
                </Button>
              </Link>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <motion.div
              className="space-y-4 p-6 rounded-lg bg-gray-800"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Session</span>
                <span className="font-medium">Drake - Recording</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engineer</span>
                <span className="font-medium">Noel Cadastre</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Next Available</span>
                <span className="font-medium">10:00 PM</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <motion.span
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <span className="text-sm text-green-500 font-medium">
                  In Session
                </span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-4 p-6 rounded-lg bg-gray-800"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Session</span>
                <span className="font-medium">Rihanna - Recording</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engineer</span>
                <span className="font-medium">Young Guru</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Next Available</span>
                <span className="font-medium">8:00 PM</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <motion.span
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.6, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <span className="text-sm text-green-500 font-medium">
                  In Session
                </span>
              </div>
            </motion.div>
          </div>
        </DarkSection>
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={itemVariants}>
        <CTASection
          title="Ready to book a session?"
          description="Schedule your next recording session in just a few clicks"
          buttonText="Book Now"
          buttonHref="/dashboard/bookings"
        />
      </motion.div>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted rounded mb-2" />
                <div className="h-3 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-muted rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
