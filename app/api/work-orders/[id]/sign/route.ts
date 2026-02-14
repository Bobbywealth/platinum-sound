import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, WorkOrderStatus } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

const prisma = new PrismaClient()

// POST /api/work-orders/[id]/sign - Sign a work order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'sign_work_orders')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { signatureData, notes } = body

    // Check work order exists
    const workOrder = await prisma.workOrder.findUnique({
      where: { id }
    })

    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
    }

    // Create signature
    const signature = await prisma.workOrderSignature.create({
      data: {
        workOrderId: id,
        signerId: session.user.id,
        signerName: session.user.name || 'Unknown',
        signerRole: session.user.role,
        signatureData,
      }
    })

    // If this is the assigned engineer signing, mark as completed
    if (workOrder.assignedEngineerId === session.user.id) {
      await prisma.workOrder.update({
        where: { id },
        data: {
          status: WorkOrderStatus.COMPLETED,
          completedAt: new Date(),
        }
      })
    }

    return NextResponse.json({ signature, workOrder }, { status: 201 })
  } catch (error) {
    console.error('Error signing work order:', error)
    return NextResponse.json(
      { error: 'Failed to sign work order' },
      { status: 500 }
    )
  }
}
