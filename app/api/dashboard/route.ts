import { NextRequest, NextResponse } from "next/server"
import { bookings, dashboardStats, todaySessions } from "@/lib/data"

export async function GET() {
  return NextResponse.json({
    stats: dashboardStats,
    upcomingBookings: bookings.filter((b) => b.status === "confirmed").slice(0, 5),
    todaySessions,
    recentInvoices: [],
  })
}
