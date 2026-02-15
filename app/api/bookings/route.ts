import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, BookingStatus, SessionMode, SessionType, Studio } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// GET /api/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const studio = searchParams.get('studio')
    const status = searchParams.get('status')
    const engineerId = searchParams.get('engineerId')

    const bookings = await prisma.booking.findMany({
      where: {
        ...(date && { date: new Date(date) }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }),
        ...(studio && { studio: studio as Studio }),
        ...(status && { status: status as BookingStatus }),
        ...(engineerId && { engineer: engineerId }),
      },
      include: {
        client: true,
        rooms: {
          include: {
            room: true
          }
        },
        payments: true,
        authorization: true,
        referral: true,
        micAddOns: {
          include: {
            mic: true
          }
        },
        extensions: true,
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientLabel,
      project,
      budget,
      date,
      startTime,
      endTime,
      sessionType,
      sessionMode,
      studio,
      engineer,
      engineerId,
      notes,
      isVip,
      paymentOption,
      addOns,
      roomIds,
      referral,
      micAddOns,
      authorization,
    } = body

    // Validate contact info against staff
    if (clientPhone) {
      const staffWithPhone = await prisma.staff.findFirst({
        where: { phone: clientPhone }
      })
      
      if (staffWithPhone) {
        return NextResponse.json(
          { error: 'Contact phone number matches a staff member. Please use a different number.' },
          { status: 400 }
        )
        }
    }

    // Generate booking code
    const bookingCode = `${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create or find client
    let client = await prisma.client.findUnique({
      where: { email: clientEmail }
    })

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          label: clientLabel,
          project,
          budget,
          status: 'PENDING',
        }
      })
    }

    // Map studio string to enum
    let studioEnum: Studio
    if (studio === 'Studio A' || studio === 'STUDIO_A') {
      studioEnum = Studio.STUDIO_A
    } else if (studio === 'Studio B' || studio === 'STUDIO_B') {
      studioEnum = Studio.STUDIO_B
    } else {
      studioEnum = Studio.STUDIO_C
    }

    // Map session type string to enum
    const sessionTypeMap: Record<string, SessionType> = {
      'Recording': SessionType.RECORDING,
      'Mixing': SessionType.MIXING,
      'Mastering': SessionType.MASTERING,
      'Production': SessionType.PRODUCTION,
      'Podcast': SessionType.PODCAST,
      'Voiceover': SessionType.VOICEOVER,
    }
    const sessionTypeEnum = sessionTypeMap[sessionType] || SessionType.RECORDING

    // Map session mode string to enum
    const sessionModeEnum = sessionMode === 'Online' ? SessionMode.ONLINE : SessionMode.IN_PERSON

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        studio: studioEnum,
        date: new Date(date),
        startTime,
        endTime,
        engineer: engineer || 'No preference',
        sessionType: sessionTypeEnum,
        sessionMode: sessionModeEnum,
        status: BookingStatus.PENDING,
        notes,
        isVip: isVip || false,
        bookingCode,
        ...(roomIds && roomIds.length > 0 && {
          rooms: {
            create: roomIds.map((roomId: string) => ({
              roomId,
              price: 0, // Will be calculated
              isPrimary: false,
            }))
          }
        }),
      },
      include: {
        client: true,
        rooms: {
          include: {
            room: true
          }
        }
      }
    })

    // Create authorization record if provided
    if (authorization) {
      await prisma.bookingAuthorization.create({
        data: {
          bookingId: booking.id,
          signatureType: authorization.signatureType || 'CHECKBOX_ACKNOWLEDGMENT',
          ipAddress: authorization.ipAddress,
          userAgent: authorization.userAgent,
          acknowledged: authorization.acknowledged || true,
          signatureData: authorization.signatureData,
        }
      })
    }

    // Create referral record if provided
    if (referral) {
      await prisma.referral.create({
        data: {
          clientId: client.id,
          bookingId: booking.id,
          referrerType: referral.referrerType,
          referrerId: referral.referrerId,
          referrerName: referral.referrerName,
        }
      })
    }

    // Create mic add-ons if provided
    if (micAddOns && micAddOns.length > 0) {
      for (const addOn of micAddOns) {
        await prisma.bookingMicAddOn.create({
          data: {
            bookingId: booking.id,
            micId: addOn.micId,
            quantity: addOn.quantity || 1,
            price: addOn.price,
          }
        })
      }
    }

    // Get the full booking with all relations
    const fullBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        client: true,
        rooms: {
          include: {
            room: true
          }
        },
        authorization: true,
        referral: true,
        micAddOns: {
          include: {
            mic: true
          }
        },
      }
    })

    return NextResponse.json(fullBooking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
