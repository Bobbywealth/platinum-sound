import { bookings, dashboardStats, invoices, todaySessions } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  // Generate recent activity from bookings and invoices
  const recentActivity = [
    {
      id: "1",
      type: "booking" as const,
      title: "New Booking",
      description: `${bookings[0]?.clientName || "New client"} booked ${bookings[0]?.studio || "a studio"}`,
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: "2",
      type: "payment" as const,
      title: "Payment Received",
      description: `${invoices.find(i => i.status === "paid")?.clientName || "Client"} paid invoice #${invoices.find(i => i.status === "paid")?.id || "001"}`,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      type: "client" as const,
      title: "New Client",
      description: "New client registered",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "4",
      type: "invoice" as const,
      title: "Invoice Sent",
      description: `Invoice sent to ${invoices.find(i => i.status === "pending")?.clientName || "client"}`,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: "5",
      type: "booking" as const,
      title: "Session Completed",
      description: `Recording session in ${bookings[0]?.studio || "studio"} completed`,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
  ]

  // Generate revenue chart data
  const revenueChart = [
    { name: "Mon", revenue: 1200, bookings: 4 },
    { name: "Tue", revenue: 1800, bookings: 6 },
    { name: "Wed", revenue: 2400, bookings: 8 },
    { name: "Thu", revenue: 1600, bookings: 5 },
    { name: "Fri", revenue: 3200, bookings: 10 },
    { name: "Sat", revenue: 2800, bookings: 9 },
    { name: "Sun", revenue: 1450, bookings: 4 },
  ]

  return NextResponse.json({
    stats: dashboardStats,
    upcomingBookings: bookings.filter((b) => b.status === "confirmed").slice(0, 5),
    todaySessions,
    recentInvoices: invoices.filter((i) => i.status === "pending").slice(0, 5),
    recentActivity,
    revenueChart,
  })
}
