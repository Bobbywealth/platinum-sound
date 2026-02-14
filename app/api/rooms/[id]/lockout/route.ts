import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// POST /api/rooms/[id]/lockout - Lock a room for a date range
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
    const { startDate, endDate, reason } = body

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check for conflicting bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        studio: room.name === 'Studio A' ? 'STUDIO_A' : room.name === 'Studio B' ? 'STUDIO_B' : 'STUDIO_C',
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        OR: [
          {
            AND: [
              { date: { gte: new Date(startDate) } },
              { date: { lte: new Date(endDate) } }
            ]
          }
        ]
      }
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot lock room: existing bookings in the selected date range', conflictingBookings },
        { status: 400 }
      )
    }

    // Create lockout
    const lockout = await prisma.roomLockout.create({
      data: {
        roomId: id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        createdBy: session.user.id,
      }
    })

    // Update room status if lockout starts today or earlier
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lockoutStart = new Date(startDate)
    lockoutStart.setHours(0, 0, 0, 0)

    if (lockoutStart <= today) {
      await prisma.room.update({
        where: { id },
        data: { status: 'LOCKED' }
      })
    }

    return NextResponse.json(lockout, { status: 201 })
  } catch (error) {
    console.error('Error locking room:', error)
    return NextResponse.json(
      { error: 'Failed to lock room' },
      { status: 500 }
    )
  }
}

// GET /api/rooms/[id]/lockout - Get lockouts for a room
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const lockouts = await prisma.roomLockout.findMany({
      where: {
        roomId: id,
        ...(startDate && endDate && {
          OR: [
            {
              AND: [
                { startDate: { gte: new Date(startDate) } },
                { startDate: { lte: new Date(endDate) } }
              ]
            },
            {
              AND: [
                { endDate: { gte: new Date(startDate) } },
                { endDate: { lte: new Date(endDate) } }
              ]
            },
            {
              AND: [
                { startDate: { lte: new Date(startDate) } },
                { endDate: { gte: new Date(endDate) } }
              ]
            }
          ]
        })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { startDate: 'asc' }
    })

    return NextResponse.json(lockouts)
  } catch (error) {
    console.error('Error fetching lockouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lockouts' },
      { status: 500 }
    )
  }
}

// DELETE /api/rooms/[id]/lockout - Remove a lockout
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const lockoutId = searchParams.get('lockoutId')

    if (!lockoutId) {
      return NextResponse.json(
        { error: 'Lockout ID is required' },
        { status: 400 }
      )
    }

    await prisma.roomLockout.delete({
      where: { id: lockoutId }
    })

    // Check if there are any remaining active lockouts
    const today = new Date()
    const activeLockouts = await prisma.roomLockout.findMany({
      where: {
        roomId: id,
        startDate: { lte: today },
        endDate: { gte: today }
      }
    })

    // If no active lockouts, set room back to available
    if (activeLockouts.length === 0) {
      await prisma.room.update({
        where: { id },
        data: { status: 'AVAILABLE' }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing lockout:', error)
    return NextResponse.json(
      { error: 'Failed to remove lockout' },
      { status: 500 }
    )
  }
}
