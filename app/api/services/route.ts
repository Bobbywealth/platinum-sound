import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SessionMode } from '@prisma/client'

export const dynamic = 'force-dynamic'

// GET /api/services - Get all services
export async function GET() {
  try {
    const services = await prisma.servicePricing.findMany({
      orderBy: { serviceType: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceType, description, basePrice, sessionMode } = body

    if (!serviceType || !sessionMode) {
      return NextResponse.json({ error: 'Service type and session mode are required' }, { status: 400 })
    }

    const service = await prisma.servicePricing.create({
      data: {
        serviceType,
        sessionMode: sessionMode as SessionMode,
        basePrice: parseFloat(basePrice) || 0,
        description,
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
