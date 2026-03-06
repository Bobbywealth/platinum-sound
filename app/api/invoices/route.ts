import { NextRequest, NextResponse } from 'next/server'
import { InvoiceStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schemas
const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  issuedDate: z.string().optional(),
  items: z.array(z.any()).optional(),
})

// Auth check helper
async function checkAuth() {
  const session = await auth()
  if (!session?.user) {
    return { authorized: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { authorized: true, session }
}

export async function GET() {
  try {
    // Check authentication
    const authCheck = await checkAuth()
    if (!authCheck.authorized) return authCheck.error
    const invoices = await prisma.invoice.findMany({
      include: { client: true },
      orderBy: { issuedDate: 'desc' },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCheck = await checkAuth()
    if (!authCheck.authorized) return authCheck.error

    const body = await request.json()

    // Validate input
    const validation = createInvoiceSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const invoice = await prisma.invoice.create({
      data: {
        clientId: body.clientId,
        amount: Number(body.amount),
        status: (body.status?.toUpperCase() as InvoiceStatus) || InvoiceStatus.PENDING,
        dueDate: new Date(body.dueDate),
        issuedDate: body.issuedDate ? new Date(body.issuedDate) : new Date(),
        items: body.items ?? [],
      },
      include: { client: true },
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
