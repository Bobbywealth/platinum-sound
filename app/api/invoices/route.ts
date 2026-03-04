import { NextRequest, NextResponse } from 'next/server'
import { InvoiceStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
    const body = await request.json()

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
