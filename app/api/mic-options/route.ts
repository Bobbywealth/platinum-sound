import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/mic-options - Get all mic options
export async function GET(request: NextRequest) {
  try {
    const micOptions = await prisma.micOption.findMany({
      where: { isActive: true },
      orderBy: [
        { isPremium: 'asc' },
        { upcharge: 'asc' }
      ]
    })

    return NextResponse.json(micOptions)
  } catch (error) {
    console.error('Error fetching mic options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mic options' },
      { status: 500 }
    )
  }
}

// POST /api/mic-options - Create a new mic option
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, upcharge, isPremium, image } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const micOption = await prisma.micOption.create({
      data: {
        name,
        description,
        upcharge: upcharge || 0,
        isPremium: isPremium ?? true,
        image,
      }
    })

    return NextResponse.json(micOption, { status: 201 })
  } catch (error) {
    console.error('Error creating mic option:', error)
    return NextResponse.json(
      { error: 'Failed to create mic option' },
      { status: 500 }
    )
  }
}
