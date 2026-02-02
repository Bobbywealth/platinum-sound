"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/section-header"
import { StatCard } from "@/components/stat-card"
import { CTASection } from "@/components/cta-section"
import { AudioWaveform } from "@/components/audio-waveform"
import { motion } from "framer-motion"
import { cn, formatCurrency } from "@/lib/utils"
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react"

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
          value="7 Sessions"
          change={data.stats.revenueChange}
          icon={DollarSign}
          index={0}
        />
        <StatCard
          title="Active Clients"
          value="24"
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
    </div>
  )
}
