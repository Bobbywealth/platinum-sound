import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Role, EmailType } from '@prisma/client'

export const dynamic = 'force-dynamic'

// GET /api/settings - Get all settings
export async function GET() {
  try {
    // Get key-value settings
    const settings = await prisma.settings.findMany()
    const settingsMap: Record<string, any> = {}
    settings.forEach(s => {
      settingsMap[s.key] = s.value
    })

    // Get email notification settings
    const emailNotifications = await prisma.emailNotificationSetting.findMany()
    const notificationsMap: Record<string, boolean> = {}
    emailNotifications.forEach(n => {
      const key = `${n.role}_${n.emailType}`
      notificationsMap[key] = n.enabled
    })

    // Get all team members (users)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      studio: settingsMap.studio || {
        name: "Platinum Sound Studios",
        email: "admin@platinumsound.com",
        phone: "+1 (555) 234-5678",
        address: "",
      },
      notifications: notificationsMap,
      team: users,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { studio, notifications } = body

    // Update studio settings
    if (studio) {
      await prisma.settings.upsert({
        where: { key: 'studio' },
        update: { value: studio },
        create: { key: 'studio', value: studio },
      })
    }

    // Update email notification settings
    if (notifications) {
      // notifications format: { ADMIN_BOOKING: true, ENGINEER_CANCELLATION: false, ... }
      for (const [key, enabled] of Object.entries(notifications)) {
        const [role, emailType] = key.split('_') as [Role, EmailType]
        
        await prisma.emailNotificationSetting.upsert({
          where: {
            role_emailType: { role, emailType }
          },
          update: { enabled: enabled as boolean },
          create: { role, emailType, enabled: enabled as boolean },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
