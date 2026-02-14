import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/engineers - Get all engineers with their room assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const date = searchParams.get('date')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    // Get all engineer users
    const engineers = await prisma.user.findMany({
      where: { role: Role.ENGINEER },
      include: {
        assignedRooms: {
          include: {
            room: true
          }
        },
        engineerRates: {
          include: {
            room: true
          }
        }
      }
    })

    // If roomId is provided, filter engineers assigned to that room
    let filteredEngineers = engineers
    if (roomId) {
      filteredEngineers = engineers.filter(e => 
        e.assignedRooms.some(ar => ar.roomId === roomId)
      )
    }

    // If checking availability for a specific time slot
    if (date && startTime && endTime) {
      const engineersWithAvailability = await Promise.all(
        filteredEngineers.map(async (engineer) => {
          // Check availability status
          const availability = await prisma.engineerAvailability.findUnique({
            where: {
              engineerId_date: {
                engineerId: engineer.id,
                date: new Date(date)
              }
            }
          })

          // Check for conflicting bookings
          const conflictingBookings = await prisma.booking.findMany({
            where: {
              engineer: engineer.name || engineer.id,
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

          const isAvailable = 
            (!availability || availability.status === 'AVAILABLE') &&
            conflictingBookings.length === 0

          return {
            ...engineer,
            isAvailable,
            availabilityStatus: availability?.status || 'AVAILABLE',
            blockedReason: availability?.blockedReason,
            assignedRooms: engineer.assignedRooms.map(ar => ({
              id: ar.room.id,
              name: ar.room.name,
              isPrimary: ar.isPrimary
            })),
            rates: engineer.engineerRates.map(r => ({
              roomId: r.roomId,
              roomName: r.room?.name,
              hourlyRate: r.hourlyRate,
              minRate: r.minRate,
              maxRate: r.maxRate
            }))
          }
        })
      )

      return NextResponse.json(engineersWithAvailability)
    }

    // Return engineers with their room assignments
    const result = filteredEngineers.map(engineer => ({
      id: engineer.id,
      name: engineer.name,
      email: engineer.email,
      phone: engineer.phone,
      discountLimit: engineer.discountLimit,
      assignedRooms: engineer.assignedRooms.map(ar => ({
        id: ar.room.id,
        name: ar.room.name,
        isPrimary: ar.isPrimary
      })),
      rates: engineer.engineerRates.map(r => ({
        roomId: r.roomId,
        roomName: r.room?.name,
        hourlyRate: r.hourlyRate,
        minRate: r.minRate,
        maxRate: r.maxRate
      }))
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching engineers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch engineers' },
      { status: 500 }
    )
  }
}
