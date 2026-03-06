import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

// SECURITY: This route is only allowed in development or with a secret key
// In production, this should be disabled or deleted
function isAllowed(): boolean {
  // Allow in development mode
  if (process.env.NODE_ENV === "development") return true
  
  // Allow with secret key in production
  const secretKey = process.env.SETUP_ADMIN_SECRET
  if (!secretKey) return false
  
  return false // Disabled in production by default - set SETUP_ADMIN_SECRET to enable
}

// This is a one-time setup route - should be deleted after use
export async function POST(request: NextRequest) {
  // Security check
  if (!isAllowed()) {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    )
  }
  try {
    const body = await request.json()
    const { action } = body

    if (action === "seed-all") {
      // Create all staff users
      const staffMembers = [
        // Admin
        { email: "admin@platinumsound.com", name: "Admin", role: Role.ADMIN, password: "admin123" },
        // Chief Engineers
        { email: "jerry@platinumsound.com", name: "Jerry Wonda", role: Role.ENGINEER, password: "password123" },
        { email: "serge@platinumsound.com", name: "Serge", role: Role.ENGINEER, password: "password123" },
        // Staff Engineers
        { email: "julian@platinumsound.com", name: "Julian", role: Role.ENGINEER, password: "password123" },
        { email: "jack@platinumsound.com", name: "Jack", role: Role.ENGINEER, password: "password123" },
        { email: "solon@platinumsound.com", name: "Solon", role: Role.ENGINEER, password: "password123" },
        // Senior Engineers
        { email: "knice@platinumsound.com", name: "Knice", role: Role.ENGINEER, password: "password123" },
        { email: "rene@platinumsound.com", name: "Rene", role: Role.ENGINEER, password: "password123" },
        { email: "darren@platinumsound.com", name: "Darren", role: Role.ENGINEER, password: "password123" },
        // Engineers
        { email: "kyle@platinumsound.com", name: "Kyle", role: Role.ENGINEER, password: "password123" },
        { email: "jacob@platinumsound.com", name: "Jacob", role: Role.ENGINEER, password: "password123" },
        { email: "rohan@platinumsound.com", name: "Rohan", role: Role.ENGINEER, password: "password123" },
        { email: "chris@platinumsound.com", name: "Chris", role: Role.ENGINEER, password: "password123" },
        // Additional staff
        { email: "lisa@platinumsound.com", name: "Lisa", role: Role.ENGINEER, password: "password123" },
        { email: "spice@platinumsound.com", name: "Spice", role: Role.ENGINEER, password: "password123" },
        { email: "marshall@platinumsound.com", name: "Marshall", role: Role.ENGINEER, password: "password123" },
      ]

      const created = []
      for (const staff of staffMembers) {
        const hashedPassword = await hash(staff.password, 12)
        const user = await prisma.user.upsert({
          where: { email: staff.email },
          update: {},
          create: {
            email: staff.email,
            name: staff.name,
            password: hashedPassword,
            role: staff.role,
          },
        })
        created.push(user.email)
      }

      return NextResponse.json({
        success: true,
        message: `Created ${created.length} users`,
        users: created,
      })
    }

    // Create or update user with role
    const { email, password, name, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update existing user
      const hashedPassword = await hash(password, 12)
      const user = await prisma.user.update({
        where: { email },
        data: {
          name: name || existingUser.name,
          password: hashedPassword,
          role: role || existingUser.role,
        },
      })

      return NextResponse.json({
        success: true,
        message: `User ${user.email} updated successfully`,
      })
    }

    // Create the user
    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || "User",
        password: hashedPassword,
        role: role || Role.ENGINEER,
      },
    })

    return NextResponse.json({
      success: true,
      message: `User ${user.email} created successfully`,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/setup-admin - Delete a user
export async function DELETE(request: NextRequest) {
  // Security check
  if (!isAllowed()) {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { email },
    })

    return NextResponse.json({
      success: true,
      message: `User ${email} deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
