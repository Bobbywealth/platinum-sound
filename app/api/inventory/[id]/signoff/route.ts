import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, EquipmentCondition } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

// POST /api/inventory/[id]/signoff - Sign off on inventory item (intern)
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
    const { condition, notes } = body

    // Check item exists
    const item = await prisma.inventoryItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
    }

    // Create sign-off
    const signOff = await prisma.inventorySignOff.create({
      data: {
        itemId: id,
        internId: session.user.id,
        internName: session.user.name || 'Unknown',
        condition: (condition as EquipmentCondition) || item.condition || EquipmentCondition.GOOD,
        notes,
      }
    })

    // Update item condition if provided
    if (condition && condition !== item.condition) {
      await prisma.inventoryItem.update({
        where: { id },
        data: { condition: condition as EquipmentCondition }
      })
    }

    return NextResponse.json(signOff, { status: 201 })
  } catch (error) {
    console.error('Error signing off inventory:', error)
    return NextResponse.json(
      { error: 'Failed to sign off inventory' },
      { status: 500 }
    )
  }
}

// GET /api/inventory/[id]/signoff - Get sign-offs for an item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const signOffs = await prisma.inventorySignOff.findMany({
      where: { itemId: id },
      orderBy: { signedAt: 'desc' }
    })

    return NextResponse.json(signOffs)
  } catch (error) {
    console.error('Error fetching sign-offs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sign-offs' },
      { status: 500 }
    )
  }
}
