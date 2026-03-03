import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { bookingCode } = await request.json()

    if (!bookingCode || typeof bookingCode !== 'string') {
      return NextResponse.json({ error: 'Booking code is required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: bookingCode.toUpperCase() },
      include: { client: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Check-in failed:', error)
    return NextResponse.json({ error: 'Check-in failed' }, { status: 500 })
  }
}
