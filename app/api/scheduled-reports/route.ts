import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ScheduleFrequency, Role } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { addDays, addWeeks, addMonths, startOfDay } from 'date-fns'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

function calculateNextSendAt(frequency: ScheduleFrequency): Date {
  const now = new Date()
  switch (frequency) {
    case ScheduleFrequency.DAILY:
      return addDays(startOfDay(now), 1)
    case ScheduleFrequency.WEEKLY:
      return addWeeks(startOfDay(now), 1)
    case ScheduleFrequency.MONTHLY:
      return addMonths(startOfDay(now), 1)
    default:
      return addDays(startOfDay(now), 1)
  }
}

// GET /api/scheduled-reports - Get all scheduled reports
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'view_reports')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const scheduledReports = await prisma.scheduledReport.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(scheduledReports)
  } catch (error) {
    console.error('Error fetching scheduled reports:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled reports' }, { status: 500 })
  }
}

// POST /api/scheduled-reports - Create a new scheduled report
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_reports')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, reportType, period, frequency, recipients } = body

    if (!name || !reportType || !period || !frequency || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = recipients.filter((email: string) => !emailRegex.test(email))
    if (invalidEmails.length > 0) {
      return NextResponse.json({ error: `Invalid email addresses: ${invalidEmails.join(', ')}` }, { status: 400 })
    }

    const scheduledReport = await prisma.scheduledReport.create({
      data: {
        name,
        reportType,
        period,
        frequency,
        recipients,
        enabled: true,
        nextSendAt: calculateNextSendAt(frequency),
        createdBy: session.user.id
      }
    })

    return NextResponse.json(scheduledReport, { status: 201 })
  } catch (error) {
    console.error('Error creating scheduled report:', error)
    return NextResponse.json({ error: 'Failed to create scheduled report' }, { status: 500 })
  }
}

// PUT /api/scheduled-reports - Update a scheduled report
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_reports')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, reportType, period, frequency, recipients, enabled } = body

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (reportType) updateData.reportType = reportType
    if (period) updateData.period = period
    if (frequency) {
      updateData.frequency = frequency
      updateData.nextSendAt = calculateNextSendAt(frequency)
    }
    if (recipients) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const invalidEmails = recipients.filter((email: string) => !emailRegex.test(email))
      if (invalidEmails.length > 0) {
        return NextResponse.json({ error: `Invalid email addresses: ${invalidEmails.join(', ')}` }, { status: 400 })
      }
      updateData.recipients = recipients
    }
    if (enabled !== undefined) updateData.enabled = enabled

    const scheduledReport = await prisma.scheduledReport.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(scheduledReport)
  } catch (error) {
    console.error('Error updating scheduled report:', error)
    return NextResponse.json({ error: 'Failed to update scheduled report' }, { status: 500 })
  }
}

// DELETE /api/scheduled-reports - Delete a scheduled report
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user.role, 'manage_reports')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    await prisma.scheduledReport.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scheduled report:', error)
    return NextResponse.json({ error: 'Failed to delete scheduled report' }, { status: 500 })
  }
}
