"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewBookingPage() {
  return (
    <DashboardPageShell className="space-y-4">
      <h1 className="text-2xl font-bold">New Booking</h1>
      <p className="text-muted-foreground">Use the bookings API-powered flow to create bookings with real client and engineer records.</p>
      <Link href="/dashboard/bookings"><Button>Back to Bookings</Button></Link>
    </DashboardPageShell>
  )
}
