import { NextRequest, NextResponse } from 'next/server'
import { ClientStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) {
      where.status = status.toUpperCase() as ClientStatus
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          bookings: true,
          invoices: true,
        },
      }),
      prisma.client.count({ where }),
    ])

    // Calculate transaction count and lifetime spend for each client
    const clientsWithStats = clients.map(client => ({
      ...client,
      transactionCount: client.bookings.length + client.invoices.length,
      lifetimeSpend: client.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
    }))

    return NextResponse.json({
      clients: clientsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = await prisma.client.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        companyName: body.companyName,
        address: body.address,
        city: body.city,
        notes: body.notes,
        firstVisit: body.firstVisit ? new Date(body.firstVisit) : null,
        status: (body.status?.toUpperCase() as ClientStatus) || ClientStatus.ACTIVE,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids, ...data } = body

    if (!ids) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 })
    }

    const client = await prisma.client.update({
      where: { id: ids },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        address: data.address,
        city: data.city,
        notes: data.notes,
        firstVisit: data.firstVisit ? new Date(data.firstVisit) : null,
        status: (data.status?.toUpperCase() as ClientStatus) || ClientStatus.ACTIVE,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}
