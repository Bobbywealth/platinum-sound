import { NextResponse } from 'next/server'
import { BookingStatus, InvoiceStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type RevenueAggregate = {
  _sum: {
    amount: number | null
  }
}

async function safeQuery<T>(name: string, query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query()
  } catch (error) {
    console.error(`Dashboard query failed (${name}):`, error)
    return fallback
  }
}

function startOfDay(date: Date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export async function GET() {
  try {
    const now = new Date()
    const todayStart = startOfDay(now)
    const tomorrow = new Date(todayStart)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const lastMonth = new Date(now)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [
      activeClients,
      activeBookings,
      pendingInvoices,
      paidInvoices,
      thisMonthRevenue,
      previousMonthRevenue,
      upcomingBookings,
      todaySessions,
      recentInvoices,
      recentBookings,
      recentClients,
    ] = await Promise.all([
      safeQuery<number>('activeClients', () => prisma.client.count({ where: { status: 'ACTIVE' } }), 0),
      safeQuery<number>(
        'activeBookings',
        () =>
          prisma.booking.count({
            where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] } },
          }),
        0,
      ),
      safeQuery<any[]>('pendingInvoices', () => prisma.invoice.findMany({ where: { status: InvoiceStatus.PENDING } }), []),
      safeQuery<any[]>(
        'paidInvoices',
        () => prisma.invoice.findMany({ where: { status: InvoiceStatus.PAID }, orderBy: { issuedDate: 'desc' }, take: 30 }),
        [],
      ),
      safeQuery<RevenueAggregate>(
        'thisMonthRevenue',
        () =>
          prisma.invoice.aggregate({
            where: { status: InvoiceStatus.PAID, issuedDate: { gte: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)) } },
            _sum: { amount: true },
          }),
        { _sum: { amount: 0 } },
      ),
      safeQuery<RevenueAggregate>(
        'previousMonthRevenue',
        () =>
          prisma.invoice.aggregate({
            where: {
              status: InvoiceStatus.PAID,
              issuedDate: {
                gte: startOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)),
                lt: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
              },
            },
            _sum: { amount: true },
          }),
        { _sum: { amount: 0 } },
      ),
      safeQuery<any[]>(
        'upcomingBookings',
        () =>
          prisma.booking.findMany({
            where: {
              date: { gte: now },
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
            },
            include: { client: true },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
            take: 5,
          }),
        [],
      ),
      safeQuery<any[]>(
        'todaySessions',
        () =>
          prisma.booking.findMany({
            where: {
              date: { gte: todayStart, lt: tomorrow },
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.PENDING] },
            },
            include: { client: true },
            orderBy: { startTime: 'asc' },
          }),
        [],
      ),
      safeQuery<any[]>(
        'recentInvoices',
        () =>
          prisma.invoice.findMany({
            where: { status: InvoiceStatus.PENDING },
            include: { client: true },
            orderBy: { dueDate: 'asc' },
            take: 5,
          }),
        [],
      ),
      safeQuery<any[]>(
        'recentBookings',
        () => prisma.booking.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
        [],
      ),
      safeQuery<any[]>('recentClients', () => prisma.client.findMany({ orderBy: { createdAt: 'desc' }, take: 2 }), []),
    ])

    const pendingAmount = pendingInvoices.reduce((total, invoice) => total + invoice.amount, 0)
    const totalRevenue = paidInvoices.reduce((total, invoice) => total + invoice.amount, 0)
    const thisMonthAmount = thisMonthRevenue?._sum?.amount ?? 0
    const previousMonthAmount = previousMonthRevenue?._sum?.amount ?? 0
    const revenueChange = previousMonthAmount === 0 ? 0 : ((thisMonthAmount - previousMonthAmount) / previousMonthAmount) * 100

    const recentActivity = [
      ...recentBookings.map((booking) => ({
        id: `booking-${booking.id}`,
        type: 'booking' as const,
        title: 'New Booking',
        description: `${booking.client.name} booked ${booking.studio.replace('STUDIO_', 'Studio ')}`,
        timestamp: booking.createdAt.toISOString(),
      })),
      ...recentInvoices.slice(0, 2).map((invoice) => ({
        id: `invoice-${invoice.id}`,
        type: 'invoice' as const,
        title: 'Invoice Pending',
        description: `Invoice sent to ${invoice.client.name}`,
        timestamp: invoice.createdAt.toISOString(),
      })),
      ...recentClients.map((client) => ({
        id: `client-${client.id}`,
        type: 'client' as const,
        title: 'New Client',
        description: `${client.name} was added`,
        timestamp: client.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalRevenue,
        revenueChange: Number(revenueChange.toFixed(1)),
        activeClients,
        clientsChange: 0,
        activeBookings,
        bookingsChange: 0,
        pendingInvoices: pendingInvoices.length,
        pendingAmount,
      },
      upcomingBookings,
      todaySessions,
      recentInvoices,
      recentActivity,
      revenueChart: [],
    })
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
