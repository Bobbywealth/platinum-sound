import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// POST /api/bookings/[id]/swap-engineer - Swap engineer for a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'swap_engineers')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { newEngineerId, newEngineerName } = body

    if (!newEngineerId && !newEngineerName) {
      return NextResponse.json(
        { error: 'New engineer ID or name is required' },
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

    // Get new engineer if ID provided
    let newEngineer = null
    if (newEngineerId) {
      newEngineer = await prisma.user.findUnique({
        where: { id: newEngineerId },
        include: {
          assignedRooms: {
            include: { room: true }
          }
        }
      })

      if (!newEngineer) {
        return NextResponse.json({ error: 'Engineer not found' }, { status: 404 })
      }

      // Check if engineer is assigned to the booking's room
      const currentRoom = booking.rooms[0]?.room
      if (currentRoom) {
        const isAssigned = newEngineer.assignedRooms.some(
          (ar) => ar.roomId === currentRoom.id
        )

        if (!isAssigned) {
          return NextResponse.json(
            { error: 'Engineer is not assigned to this room', 
              assignedRooms: newEngineer.assignedRooms.map(ar => ar.room.name) },
            { status: 400 }
          )
        }
      }

      // Check engineer availability
      const availability = await prisma.engineerAvailability.findUnique({
        where: {
          engineerId_date: {
            engineerId: newEngineerId,
            date: booking.date
          }
        }
      })

      if (availability && availability.status !== 'AVAILABLE') {
        return NextResponse.json(
          { error: `Engineer is not available: ${availability.blockedReason || availability.status}` },
          { status: 400 }
        )
        }

      // Check for conflicting bookings
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          id: { not: id },
          engineer: newEngineer.name || newEngineerId,
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
          { error: 'Engineer has conflicting bookings' },
          { status: 400 }
        )
      }
    }

    // Store original engineer if not already stored
    const originalEngineer = booking.originalEngineer || booking.engineer

    // Update booking with new engineer
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        engineer: newEngineer?.name || newEngineerName,
        originalEngineer,
        engineerSwappedAt: new Date(),
      },
      include: {
        client: true,
        rooms: {
          include: { room: true }
        }
      }
    })

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Engineer swapped successfully'
    })
  } catch (error) {
    console.error('Error swapping engineer:', error)
    return NextResponse.json(
      { error: 'Failed to swap engineer' },
      { status: 500 }
    )
  }
}
