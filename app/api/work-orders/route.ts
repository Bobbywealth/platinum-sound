import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, WorkOrderStatus, Priority } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// GET /api/work-orders - Get all work orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assignedEngineerId = searchParams.get('assignedEngineerId')
    const createdBy = searchParams.get('createdBy')

    const workOrders = await prisma.workOrder.findMany({
      where: {
        ...(status && { status: status as WorkOrderStatus }),
        ...(assignedEngineerId && { assignedEngineerId }),
        ...(createdBy && { createdBy }),
      },
      include: {
        assignedEngineer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        signatures: true,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(workOrders)
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work orders' },
      { status: 500 }
    )
  }
}

// POST /api/work-orders - Create a work order
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'create_work_orders')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, priority, assignedEngineerId } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const workOrder = await prisma.workOrder.create({
      data: {
        title,
        description,
        priority: (priority as Priority) || Priority.MEDIUM,
        assignedEngineerId,
        createdBy: session.user.id,
      },
      include: {
        assignedEngineer: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // TODO: Send notification to assigned engineer and finance manager
    // This would typically involve checking email notification settings

    return NextResponse.json(workOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}
