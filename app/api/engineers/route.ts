import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
      // Get all engineer IDs
      const engineerIds = filteredEngineers.map(e => e.id)
      const engineerNames = filteredEngineers.map(e => e.name || e.id)
      const targetDate = new Date(date)

      // Fetch all availability records for these engineers on this date in a single query
      const allAvailability = await prisma.engineerAvailability.findMany({
        where: {
          engineerId: { in: engineerIds },
          date: targetDate
        }
      })

      // Create a map for quick lookup
      const availabilityMap = new Map(
        allAvailability.map(a => [a.engineerId, a])
      )

      // Fetch all conflicting bookings for these engineers on this date in a single query
      const allConflictingBookings = await prisma.booking.findMany({
        where: {
          engineer: { in: engineerNames },
          date: targetDate,
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

      // Create a map of bookings by engineer
      const bookingsByEngineer = new Map<string, typeof allConflictingBookings>()
      for (const booking of allConflictingBookings) {
        const key = booking.engineer
        if (!bookingsByEngineer.has(key)) {
          bookingsByEngineer.set(key, [])
        }
        bookingsByEngineer.get(key)!.push(booking)
      }

      // Combine data in memory - no more N+1 queries
      const engineersWithAvailability = filteredEngineers.map(engineer => {
        const availability = availabilityMap.get(engineer.id)
        const conflictingBookings = bookingsByEngineer.get(engineer.name || engineer.id) || []

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
