import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, PaymentMethod } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/bookings/[id]/payments - Get payments for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const payments = await prisma.paymentSplit.findMany({
      where: { bookingId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { recordedAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/bookings/[id]/payments - Record a payment split
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
    const { method, amount, reference, notes } = body

    if (!method || !amount) {
      return NextResponse.json(
        { error: 'Payment method and amount are required' },
        { status: 400 }
      )
    }

    // Validate payment method
    const validMethods: PaymentMethod[] = [
      'CASH', 'CASH_APP', 'ZELLE', 'SQUARE', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER'
    ]
    if (!validMethods.includes(method as PaymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Check booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: true,
        rooms: { include: { room: true } }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Create payment record
    const payment = await prisma.paymentSplit.create({
      data: {
        bookingId: id,
        method: method as PaymentMethod,
        amount: parseFloat(amount),
        reference,
        notes,
        recordedBy: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Calculate total paid
    const totalPaid = booking.payments.reduce((sum, p) => sum + p.amount, 0) + payment.amount

    // Calculate expected amount (basic calculation - can be enhanced)
    const startHour = parseInt(booking.startTime.split(':')[0])
    const endHour = parseInt(booking.endTime.split(':')[0])
    const hours = endHour - startHour
    const roomRate = booking.rooms[0]?.room?.baseRate || 150
    const expectedAmount = hours * roomRate

    // Update booking status if fully paid
    if (totalPaid >= expectedAmount && booking.status === 'PENDING') {
      await prisma.booking.update({
        where: { id },
        data: { status: 'CONFIRMED' }
      })
    }

    return NextResponse.json({
      payment,
      totalPaid,
      expectedAmount,
      isFullyPaid: totalPaid >= expectedAmount
    }, { status: 201 })
  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    )
  }
}
