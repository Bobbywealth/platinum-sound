import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, SignatureType } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/bookings/[id]/authorization - Get authorization for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const authorization = await prisma.bookingAuthorization.findUnique({
      where: { bookingId: id }
    })

    if (!authorization) {
      return NextResponse.json({ error: 'Authorization not found' }, { status: 404 })
    }

    return NextResponse.json(authorization)
  } catch (error) {
    console.error('Error fetching authorization:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authorization' },
      { status: 500 }
    )
  }
}

// POST /api/bookings/[id]/authorization - Create authorization for a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { signatureType, signatureData, ipAddress, userAgent } = body

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if authorization already exists
    const existingAuth = await prisma.bookingAuthorization.findUnique({
      where: { bookingId: id }
    })

    if (existingAuth) {
      return NextResponse.json(
        { error: 'Authorization already exists for this booking' },
        { status: 400 }
      )
    }

    // Create authorization
    const authorization = await prisma.bookingAuthorization.create({
      data: {
        bookingId: id,
        signatureType: (signatureType as SignatureType) || SignatureType.CHECKBOX_ACKNOWLEDGMENT,
        signatureData,
        ipAddress,
        userAgent,
        acknowledged: true,
      }
    })

    // TODO: Send email notification to admins and managers
    // This would typically involve an email service

    return NextResponse.json(authorization, { status: 201 })
  } catch (error) {
    console.error('Error creating authorization:', error)
    return NextResponse.json(
      { error: 'Failed to create authorization' },
      { status: 500 }
    )
  }
}
