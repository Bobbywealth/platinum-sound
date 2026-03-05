import { NextRequest, NextResponse } from 'next/server'
import { Priority, TaskStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true },
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, status, priority, isRecurring, recurrencePattern, assigneeName } = body

    // If assigneeName is provided, look up the user by name
    let assigneeId = null
    if (assigneeName) {
      const user = await prisma.user.findFirst({
        where: { name: assigneeName },
      })
      assigneeId = user?.id || null
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status: status as TaskStatus,
        priority: priority as Priority,
        isRecurring: Boolean(isRecurring),
        recurrencePattern,
        assigneeId,
      },
      include: { assignee: true },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
