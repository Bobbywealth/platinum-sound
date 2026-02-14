import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, AvailabilityStatus } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// GET /api/availability - Get engineer availability
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const engineerId = searchParams.get('engineerId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const availability = await prisma.engineerAvailability.findMany({
      where: {
        ...(engineerId && { engineerId }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }),
      },
      include: {
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

// POST /api/availability - Set engineer availability
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Engineers can update their own availability, admins/managers can update anyone's
    const body = await request.json()
    const { engineerId, date, status, blockedReason } = body

    // Determine which engineer to update
    const targetEngineerId = engineerId || session.user.id

    // Check permissions
    const isOwnAvailability = targetEngineerId === session.user.id
    if (!isOwnAvailability && !hasPermission(session.user.role, 'manage_users')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Engineers can only update their own availability
    if (session.user.role === 'ENGINEER' && !isOwnAvailability) {
      return NextResponse.json({ error: 'Can only update your own availability' }, { status: 403 })
    }

    if (!date || !status) {
      return NextResponse.json(
        { error: 'Date and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses: AvailabilityStatus[] = ['AVAILABLE', 'BLOCKED', 'VACATION', 'SICK']
    if (!validStatuses.includes(status as AvailabilityStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Upsert availability
    const availability = await prisma.engineerAvailability.upsert({
      where: {
        engineerId_date: {
          engineerId: targetEngineerId,
          date: new Date(date)
        }
      },
      update: {
        status: status as AvailabilityStatus,
        blockedReason,
      },
      create: {
        engineerId: targetEngineerId,
        date: new Date(date),
        status: status as AvailabilityStatus,
        blockedReason,
      },
      include: {
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(availability, { status: 201 })
  } catch (error) {
    console.error('Error setting availability:', error)
    return NextResponse.json(
      { error: 'Failed to set availability' },
      { status: 500 }
    )
  }
}

// POST /api/availability/bulk - Set availability for multiple dates
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { engineerId, dates, status, blockedReason } = body

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json(
        { error: 'Dates array is required' },
        { status: 400 }
      )
    }

    // Determine which engineer to update
    const targetEngineerId = engineerId || session.user.id

    // Check permissions
    const isOwnAvailability = targetEngineerId === session.user.id
    if (session.user.role === 'ENGINEER' && !isOwnAvailability) {
      return NextResponse.json({ error: 'Can only update your own availability' }, { status: 403 })
    }

    // Create/update availability for all dates
    const results = await Promise.all(
      dates.map((date: string) =>
        prisma.engineerAvailability.upsert({
          where: {
            engineerId_date: {
              engineerId: targetEngineerId,
              date: new Date(date)
            }
          },
          update: {
            status: status as AvailabilityStatus,
            blockedReason,
          },
          create: {
            engineerId: targetEngineerId,
            date: new Date(date),
            status: status as AvailabilityStatus,
            blockedReason,
          }
        })
      )
    )

    return NextResponse.json({ 
      message: `Updated availability for ${results.length} date(s)`,
      count: results.length 
    })
  } catch (error) {
    console.error('Error setting bulk availability:', error)
    return NextResponse.json(
      { error: 'Failed to set bulk availability' },
      { status: 500 }
    )
  }
}
