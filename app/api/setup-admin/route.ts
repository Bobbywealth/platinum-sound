import { NextResponse } from "next/server"
import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

// This is a one-time setup route - should be deleted after use
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

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
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create the user
    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || "Admin",
        password: hashedPassword,
        role: Role.ADMIN,
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
