import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const [clients, bookings, invoices, staff] = await Promise.all([
    prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { project: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
    prisma.booking.findMany({
      where: {
        OR: [
          { bookingCode: { contains: query, mode: 'insensitive' } },
          { engineer: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: { client: true },
      take: 10,
    }),
    prisma.invoice.findMany({
      where: {
        OR: [
          { id: { contains: query, mode: 'insensitive' } },
          { client: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: { client: true },
      take: 10,
    }),
    prisma.staff.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { role: { contains: query, mode: 'insensitive' } },
          { specialty: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
    }),
  ])

  const results = [
    ...clients.map((client) => ({
      type: 'client',
      title: `${client.firstName} ${client.lastName}`,
      subtitle: `${client.companyName ?? '—'} • ${client.city ?? '—'}`,
      href: `/dashboard/clients?id=${client.id}`,
    })),
    ...bookings.map((booking) => ({
      type: 'booking',
      title: `${booking.client.firstName} ${booking.client.lastName} - ${booking.studio.replace('STUDIO_', 'Studio ')}`,
      subtitle: `${booking.date.toISOString().split('T')[0]} • ${booking.startTime} - ${booking.endTime}`,
      href: `/dashboard/bookings?id=${booking.id}`,
    })),
    ...invoices.map((invoice) => ({
      type: 'invoice',
      title: `${invoice.client.firstName} ${invoice.client.lastName} - ${invoice.id}`,
      subtitle: `${invoice.amount.toLocaleString()} • ${invoice.status}`,
      href: `/dashboard/invoices?id=${invoice.id}`,
    })),
    ...staff.map((member) => ({
      type: 'staff',
      title: member.name,
      subtitle: `${member.role} • ${member.specialty ?? '—'}`,
      href: `/dashboard/staff?id=${member.id}`,
    })),
  ]

  return NextResponse.json({ results })
}
