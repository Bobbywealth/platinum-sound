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

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: (body.status?.toUpperCase() as TaskStatus) || TaskStatus.TODO,
        priority: (body.priority?.toUpperCase() as Priority) || Priority.MEDIUM,
        assigneeId: body.assigneeId || null,
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
