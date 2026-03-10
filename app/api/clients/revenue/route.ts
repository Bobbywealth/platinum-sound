import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins and managers can recalculate revenue
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get all clients with their invoices and payments
    const clients = await prisma.client.findMany({
      include: {
        invoices: {
          where: { status: 'PAID' }
        },
        bookings: {
          where: { status: 'COMPLETED' },
          include: {
            payments: true
          }
        }
      }
    })

    let updatedCount = 0

    for (const client of clients) {
      // Calculate total from paid invoices
      const invoiceRevenue = client.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
      
      // Calculate total from completed bookings (via payment splits)
      const bookingRevenue = client.bookings.reduce(
        (sum, booking) => sum + booking.payments.reduce((pSum, payment) => pSum + (payment.amount || 0), 0),
        0
      )
      
      const totalRevenue = invoiceRevenue + bookingRevenue

      // Upsert the client revenue record
      await prisma.clientRevenue.upsert({
        where: { clientId: client.id },
        update: { totalRevenue },
        create: {
          clientId: client.id,
          totalRevenue
        }
      })

      updatedCount++
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated revenue for ${updatedCount} clients` 
    })
  } catch (error) {
    console.error('Error recalculating client revenue:', error)
    return NextResponse.json({ error: 'Failed to recalculate revenue' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all client revenues
    const revenues = await prisma.clientRevenue.findMany({
      orderBy: { totalRevenue: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    const totalRevenue = revenues.reduce((sum, r) => sum + r.totalRevenue, 0)

    return NextResponse.json({
      revenues,
      totalRevenue,
      clientCount: revenues.length
    })
  } catch (error) {
    console.error('Error fetching client revenues:', error)
    return NextResponse.json({ error: 'Failed to fetch revenues' }, { status: 500 })
  }
}
