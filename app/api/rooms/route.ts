import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Studio } from '@prisma/client'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

// Validation schema
const createRoomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  baseRate: z.number().positive().optional(),
  rateWithEngineer: z.number().positive().optional(),
  rateWithoutEngineer: z.number().positive().optional(),
  amenities: z.any().optional(),
  images: z.any().optional(),
})

// GET /api/rooms - Get all rooms (public for booking flow)
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
          // Map room name to studio enum
          const studioMap: Record<string, Studio> = {
            'Studio A': Studio.STUDIO_A, 'Platinum VIP Suite': Studio.STUDIO_A,
            'Studio B': Studio.STUDIO_B, 'Dolby Atmos Suite': Studio.STUDIO_B,
            'Studio C': Studio.STUDIO_C, 'China Room': Studio.STUDIO_C, 'PS Chelsea': Studio.STUDIO_C,
            'Studio D': Studio.STUDIO_D, 'Production Room': Studio.STUDIO_D,
            'Studio E': Studio.STUDIO_E, 'Rehearsal Room': Studio.STUDIO_E,
            'Studio F': Studio.STUDIO_F, 'Suite 122': Studio.STUDIO_F,
          }
          const studioKey = studioMap[room.name] || Studio.STUDIO_A
          
          // Check for conflicting bookings
          const conflictingBookings = await prisma.booking.findMany({
            where: {
              studio: studioKey,
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

// POST /api/rooms - Create a new room (requires auth)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = createRoomSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

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
