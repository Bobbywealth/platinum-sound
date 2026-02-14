import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// POST /api/bookings/[id]/extend - Extend a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { additionalHours } = body

    if (!additionalHours || additionalHours < 1) {
      return NextResponse.json(
        { error: 'Additional hours must be at least 1' },
        { status: 400 }
      )
    }

    // Get current booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        rooms: {
          include: { room: true }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot extend a completed or cancelled booking' },
        { status: 400 }
      )
    }

    // Calculate new end time
    const [endHour, endMinute] = booking.endTime.split(':').map(Number)
    const newEndHour = endHour + additionalHours
    const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

    // Check room availability for extended time
    const room = booking.rooms[0]?.room
    if (room) {
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          id: { not: id },
          studio: booking.studio,
          date: booking.date,
          status: { notIn: ['CANCELLED', 'COMPLETED'] },
          AND: [
            { startTime: { gte: booking.endTime } },
            { startTime: { lt: newEndTime } }
          ]
        }
      })

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: 'Room is not available for the extended time', conflictingBookings },
          { status: 400 }
        )
      }
    }

    // Calculate additional cost
    const hourlyRate = room?.baseRate || 150
    const additionalCost = hourlyRate * additionalHours

    // Create extension record and update booking
    const result = await prisma.$transaction(async (tx) => {
      // Create extension record
      const extension = await tx.sessionExtension.create({
        data: {
          bookingId: id,
          originalEndTime: booking.endTime,
          newEndTime,
          additionalCost,
        }
      })

      // Update booking end time
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          endTime: newEndTime,
        },
        include: {
          client: true,
          rooms: {
            include: { room: true }
          },
          extensions: true,
        }
      })

      return { extension, booking: updatedBooking }
    })

    return NextResponse.json({
      booking: result.booking,
      extension: result.extension,
      additionalCost,
      message: `Session extended by ${additionalHours} hour(s)`
    })
  } catch (error) {
    console.error('Error extending session:', error)
    return NextResponse.json(
      { error: 'Failed to extend session' },
      { status: 500 }
    )
  }
}
