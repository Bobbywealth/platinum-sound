import { NextResponse } from "next/server"
import { clients, bookings, invoices, staff } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase().trim()

  if (!query || query.length === 0) {
    return NextResponse.json({ results: [] })
  }

  const results: {
    type: string
    title: string
    subtitle: string
    href: string
  }[] = []

  // Search clients
  clients.forEach((client) => {
    if (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.project.toLowerCase().includes(query)
    ) {
      results.push({
        type: "client",
        title: client.name,
        subtitle: `${client.label} • ${client.project}`,
        href: `/dashboard/clients?id=${client.id}`,
      })
    }
  })

  // Search bookings
  bookings.forEach((booking) => {
    if (
      booking.clientName.toLowerCase().includes(query) ||
      booking.studio.toLowerCase().includes(query) ||
      booking.engineer.toLowerCase().includes(query)
    ) {
      results.push({
        type: "booking",
        title: `${booking.clientName} - ${booking.studio}`,
        subtitle: `${booking.date} • ${booking.startTime} - ${booking.endTime}`,
        href: `/dashboard/bookings?id=${booking.id}`,
      })
    }
  })

  // Search invoices
  invoices.forEach((invoice) => {
    if (
      invoice.clientName.toLowerCase().includes(query) ||
      invoice.id.toLowerCase().includes(query)
    ) {
      results.push({
        type: "invoice",
        title: `${invoice.clientName} - ${invoice.id}`,
        subtitle: `$${invoice.amount.toLocaleString()} • ${invoice.status}`,
        href: `/dashboard/invoices?id=${invoice.id}`,
      })
    }
  })

  // Search staff
  staff.forEach((member) => {
    if (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.specialty.toLowerCase().includes(query)
    ) {
      results.push({
        type: "staff",
        title: member.name,
        subtitle: `${member.role} • ${member.specialty}`,
        href: `/dashboard/staff?id=${member.id}`,
      })
    }
  })

  return NextResponse.json({ results })
}
