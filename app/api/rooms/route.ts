import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/rooms - Get all rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeUnavailable = searchParams.get('includeUnavailable') === 'true'
    const date = searchParams.get('date')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    const rooms = await prisma.room.findMany({
      where: includeUnavailable ? {} : { status: 'AVAILABLE' },
      include: {
        assignments: {
          include: {
            engineer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        },
        pricing: true,
        lockouts: date ? {
          where: {
            AND: [
              { startDate: { lte: new Date(date) } },
              { endDate: { gte: new Date(date) } }
            ]
          }
        } : false,
      },
      orderBy: { name: 'asc' }
    })

    // If checking availability for a specific time slot
    if (date && startTime && endTime) {
      const roomsWithAvailability = await Promise.all(
        rooms.map(async (room) => {
          // Check for conflicting bookings
          const conflictingBookings = await prisma.booking.findMany({
            where: {
              studio: room.name === 'Studio A' ? 'STUDIO_A' : room.name === 'Studio B' ? 'STUDIO_B' : 'STUDIO_C',
              date: new Date(date),
              status: { notIn: ['CANCELLED', 'COMPLETED'] },
              OR: [
                {
                  AND: [
                    { startTime: { lte: startTime } },
                    { endTime: { gt: startTime } }
                  ]
                },
                {
                  AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gte: endTime } }
                  ]
                }
              ]
            }
          })

          const isLocked = room.lockouts && room.lockouts.length > 0
          const isBooked = conflictingBookings.length > 0

          return {
            ...room,
            isAvailable: !isLocked && !isBooked,
            conflictingBookings: conflictingBookings.length,
          }
        })
      )

      return NextResponse.json(roomsWithAvailability)
    }

    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

// POST /api/rooms - Create a new room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, baseRate, rateWithEngineer, rateWithoutEngineer, amenities, images } = body

    const room = await prisma.room.create({
      data: {
        name,
        description,
        baseRate,
        rateWithEngineer,
        rateWithoutEngineer,
        amenities,
        images,
        status: 'AVAILABLE',
      }
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
