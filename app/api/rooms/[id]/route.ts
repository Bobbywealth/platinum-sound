import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/rooms/[id] - Get a specific room
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            engineer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                engineerRates: true,
              }
            }
          }
        },
        pricing: true,
        engineerRates: {
          include: {
            engineer: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error fetching room:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    )
  }
}

// PATCH /api/rooms/[id] - Update a room
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, baseRate, rateWithEngineer, rateWithoutEngineer, status, amenities, images } = body

    const room = await prisma.room.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(baseRate !== undefined && { baseRate }),
        ...(rateWithEngineer !== undefined && { rateWithEngineer }),
        ...(rateWithoutEngineer !== undefined && { rateWithoutEngineer }),
        ...(status && { status }),
        ...(amenities && { amenities }),
        ...(images && { images }),
      }
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
      { status: 500 }
    )
  }
}

// DELETE /api/rooms/[id] - Delete a room
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.room.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting room:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}
