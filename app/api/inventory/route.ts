import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, InventoryCategory, InventoryStatus, EquipmentCondition } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// GET /api/inventory - Get inventory items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const items = await prisma.inventoryItem.findMany({
      where: {
        ...(category && { category: category as InventoryCategory }),
        ...(status && { status: status as InventoryStatus }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { serialNumber: { contains: search, mode: 'insensitive' } },
          ]
        }),
      },
      include: {
        signOffs: {
          orderBy: { signedAt: 'desc' },
          take: 5,
        }
      },
      orderBy: [
        { status: 'asc' },
        { name: 'asc' }
      ]
    })

    // Calculate summary statistics
    const summary = {
      total: items.length,
      inStock: items.filter(i => i.status === 'IN_STOCK').length,
      lowStock: items.filter(i => i.status === 'LOW_STOCK').length,
      outOfStock: items.filter(i => i.status === 'OUT_OF_STOCK').length,
      byCategory: Object.values(InventoryCategory).map(cat => ({
        category: cat,
        count: items.filter(i => i.category === cat).length
      }))
    }

    return NextResponse.json({ items, summary })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

// POST /api/inventory - Create inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_inventory')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      category,
      subCategory,
      description,
      serialNumber,
      condition,
      location,
      stock,
      reorderPoint,
      purchasePrice,
      purchaseDate,
      images,
    } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Determine status based on stock and reorder point
    let status: InventoryStatus = InventoryStatus.IN_STOCK
    if (stock === 0) {
      status = InventoryStatus.OUT_OF_STOCK
    } else if (reorderPoint && stock <= reorderPoint) {
      status = InventoryStatus.LOW_STOCK
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category: category as InventoryCategory,
        subCategory,
        description,
        serialNumber,
        condition: condition as EquipmentCondition,
        location,
        stock: stock || 1,
        reorderPoint,
        status,
        purchasePrice,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        images,
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}
