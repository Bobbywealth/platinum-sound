import { NextRequest, NextResponse } from 'next/server'
import { Priority, TaskStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignee: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // If assigneeName is provided, look up the user by name
    let assigneeId = body.assigneeId || null
    if (body.assigneeName && !assigneeId) {
      const user = await prisma.user.findFirst({
        where: { name: body.assigneeName },
      })
      if (user) {
        assigneeId = user.id
      }
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: (body.status?.toUpperCase() as TaskStatus) || TaskStatus.TODO,
        priority: (body.priority?.toUpperCase() as Priority) || Priority.MEDIUM,
        assigneeId,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        isRecurring: Boolean(body.isRecurring),
        recurrencePattern: body.recurrencePattern || null,
        recurrenceEndDate: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : null,
      },
      include: { assignee: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

// PATCH /api/tasks - Update task status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, title, description, priority, assigneeId, assigneeName } = body

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // If assigneeName is provided, look up the user by name
    let finalAssigneeId = assigneeId
    if (assigneeName !== undefined) {
      if (assigneeName === "") {
        finalAssigneeId = null
      } else {
        const user = await prisma.user.findFirst({
          where: { name: assigneeName },
        })
        finalAssigneeId = user?.id || null
      }
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status.toUpperCase()
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (priority) updateData.priority = priority.toUpperCase()
    if (finalAssigneeId !== undefined) updateData.assigneeId = finalAssigneeId
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: { assignee: true },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Full update of a task
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }
    
    const body = await request.json()
    const { title, description, status, priority, isRecurring, recurrencePattern, assigneeName, dueDate } = body
    
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
        status: status?.toUpperCase(),
        priority: priority?.toUpperCase(),
        isRecurring: Boolean(isRecurring),
        recurrencePattern,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: { assignee: true },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
