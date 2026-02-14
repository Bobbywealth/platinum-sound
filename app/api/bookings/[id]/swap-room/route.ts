import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// POST /api/bookings/[id]/swap-room - Swap room for a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'swap_rooms')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { newRoomId } = body

    if (!newRoomId) {
      return NextResponse.json(
        { error: 'New room ID is required' },
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

    // Get new room
    const newRoom = await prisma.room.findUnique({
      where: { id: newRoomId },
      include: { pricing: true }
    })

    if (!newRoom) {
      return NextResponse.json({ error: 'New room not found' }, { status: 404 })
    }

    // Check room availability
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        id: { not: id },
        studio: newRoom.name === 'Studio A' ? 'STUDIO_A' : newRoom.name === 'Studio B' ? 'STUDIO_B' : 'STUDIO_C',
        date: booking.date,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: booking.startTime } },
              { endTime: { gt: booking.startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: booking.endTime } },
              { endTime: { gte: booking.endTime } }
            ]
          }
        ]
      }
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Room is not available for the selected time slot' },
        { status: 400 }
      )
    }

    // Check for lockouts
    const lockouts = await prisma.roomLockout.findMany({
      where: {
        roomId: newRoomId,
        AND: [
          { startDate: { lte: booking.date } },
          { endDate: { gte: booking.date } }
        ]
      }
    })

    if (lockouts.length > 0) {
      return NextResponse.json(
        { error: 'Room is locked for the selected date' },
        { status: 400 }
      )
    }

    // Calculate price difference
    const currentRoom = booking.rooms[0]?.room
    const currentPrice = currentRoom?.baseRate || 0
    const newPrice = newRoom.baseRate
    
    // Calculate hours
    const startHour = parseInt(booking.startTime.split(':')[0])
    const endHour = parseInt(booking.endTime.split(':')[0])
    const hours = endHour - startHour
    
    const priceDifference = (newPrice - currentPrice) * hours

    // Store original room if not already stored
    const originalRoomId = booking.originalRoomId || currentRoom?.id

    // Update booking with new room
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // Remove existing room assignments
      await tx.bookingRoom.deleteMany({
        where: { bookingId: id }
      })

      // Create new room assignment
      await tx.bookingRoom.create({
        data: {
          bookingId: id,
          roomId: newRoomId,
          price: newPrice,
          isPrimary: true,
        }
      })

      // Update booking
      return await tx.booking.update({
        where: { id },
        data: {
          studio: newRoom.name === 'Studio A' ? 'STUDIO_A' : newRoom.name === 'Studio B' ? 'STUDIO_B' : 'STUDIO_C',
          originalRoomId,
          roomSwappedAt: new Date(),
        },
        include: {
          client: true,
          rooms: {
            include: { room: true }
          }
        }
      })
    })

    return NextResponse.json({
      booking: updatedBooking,
      priceDifference,
      disclaimer: 'Rooms may be swapped at any time. Pricing will reflect assigned room.'
    })
  } catch (error) {
    console.error('Error swapping room:', error)
    return NextResponse.json(
      { error: 'Failed to swap room' },
      { status: 500 }
    )
  }
}
