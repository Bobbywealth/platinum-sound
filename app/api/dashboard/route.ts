import { bookings, dashboardStats, todaySessions } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    stats: dashboardStats,
    upcomingBookings: bookings.filter((b) => b.status === "confirmed").slice(0, 5),
    todaySessions,
    recentInvoices: [],
  })
}
