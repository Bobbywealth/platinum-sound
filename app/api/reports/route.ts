import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ReportType, ReportPeriod, Role } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format } from 'date-fns'

const prisma = new PrismaClient()

// GET /api/reports - Get reports
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_reports')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ReportType
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()

    let startDate: Date
    let endDate: Date

    switch (type) {
      case ReportType.END_OF_DAY:
        startDate = startOfDay(date)
        endDate = endOfDay(date)
        break
      case ReportType.WEEKLY_SESSION_LOG:
        startDate = startOfWeek(date, { weekStartsOn: 1 })
        endDate = endOfWeek(date, { weekStartsOn: 1 })
        break
      case ReportType.MONTHLY_SUMMARY:
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
        break
      default:
        startDate = startOfDay(date)
        endDate = endOfDay(date)
    }

    // Get bookings for the period
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        client: true,
        rooms: {
          include: { room: true }
        },
        payments: true,
        extensions: true,
      }
    })

    // Calculate statistics
    const totalBookings = bookings.length
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length

    // Calculate revenue
    const totalRevenue = bookings.reduce((sum, booking) => {
      const payments = booking.payments.reduce((pSum, p) => pSum + p.amount, 0)
      return sum + payments
    }, 0)

    // Calculate room utilization
    const roomUtilization = await calculateRoomUtilization(startDate, endDate)

    // Calculate engineer hours
    const engineerHours = calculateEngineerHours(bookings)

    // Generate report
    const report = {
      type,
      period: type === ReportType.END_OF_DAY ? ReportPeriod.DAILY : 
              type === ReportType.WEEKLY_SESSION_LOG ? ReportPeriod.WEEKLY : ReportPeriod.MONTHLY,
      startDate,
      endDate,
      generatedAt: new Date(),
      generatedBy: session.user.id,
      data: {
        summary: {
          totalBookings,
          completedBookings,
          cancelledBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue,
        },
        bookings: bookings.map(b => ({
          id: b.id,
          clientName: b.client.name,
          date: b.date,
          startTime: b.startTime,
          endTime: b.endTime,
          studio: b.studio,
          sessionType: b.sessionType,
          status: b.status,
          totalPaid: b.payments.reduce((sum, p) => sum + p.amount, 0),
        })),
        roomUtilization,
        engineerHours,
      }
    }

    // Store report in database
    await prisma.report.create({
      data: {
        type,
        period: report.period,
        startDate,
        endDate,
        data: report.data,
        generatedBy: session.user.id,
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function calculateRoomUtilization(startDate: Date, endDate: Date) {
  const rooms = await prisma.room.findMany()
  const utilization = []

  for (const room of rooms) {
    const bookings = await prisma.booking.findMany({
      where: {
        studio: room.name === 'Studio A' ? 'STUDIO_A' : room.name === 'Studio B' ? 'STUDIO_B' : 'STUDIO_C',
        date: {
          gte: startDate,
          lte: endDate
        },
        status: { notIn: ['CANCELLED'] }
      }
    })

    // Calculate total hours booked
    const totalHours = bookings.reduce((sum, b) => {
      const start = parseInt(b.startTime.split(':')[0])
      const end = parseInt(b.endTime.split(':')[0])
      return sum + (end - start)
    }, 0)

    // Calculate available hours (assuming 12 hours per day)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const availableHours = days * 12

    utilization.push({
      room: room.name,
      totalHours,
      availableHours,
      utilizationRate: availableHours > 0 ? (totalHours / availableHours) * 100 : 0
    })
  }

  return utilization
}

function calculateEngineerHours(bookings: any[]) {
  const engineerMap = new Map<string, { name: string; hours: number; sessions: number }>()

  for (const booking of bookings) {
    if (booking.engineer && booking.engineer !== 'No preference') {
      const start = parseInt(booking.startTime.split(':')[0])
      const end = parseInt(booking.endTime.split(':')[0])
      const hours = end - start

      const existing = engineerMap.get(booking.engineer)
      if (existing) {
        existing.hours += hours
        existing.sessions += 1
      } else {
        engineerMap.set(booking.engineer, {
          name: booking.engineer,
          hours,
          sessions: 1
        })
      }
    }
  }

  return Array.from(engineerMap.values())
}
