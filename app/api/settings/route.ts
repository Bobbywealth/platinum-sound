import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Role, EmailType } from '@prisma/client'
import { auth } from '@/lib/auth'
import { hash } from 'bcryptjs'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// GET /api/settings - Get all settings (requires auth)
export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
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
      apiKeys: {
        twilioSid: settingsMap.twilioSid || '',
        twilioToken: settingsMap.twilioToken || '',
        twilioPhone: settingsMap.twilioPhone || '',
        openaiKey: settingsMap.openaiKey || '',
      },
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT /api/settings - Update settings (requires auth)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
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

// POST /api/settings - Create a new team member (requires auth)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    console.log("[SETTINGS DEBUG] Session:", session ? "exists" : "null")
    console.log("[SETTINGS DEBUG] User role:", session?.user?.role)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins and managers can add team members
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { action, email, name, role, password, phone } = body

    // Validate input
    if (!email || !name || !role || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as Role,
        password: hashedPassword,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('[SETTINGS DEBUG] Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}

// DELETE /api/settings - Delete a team member (requires auth)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete team members
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if trying to delete self
    if (session.user.email === email) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Delete user
    await prisma.user.delete({
      where: { email }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
