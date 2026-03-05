import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: "NEW",
        source: "BOOKING_PAGE",
        notes: `Session Type: ${data.sessionType || "Not specified"}\nStudio: ${data.studio || "Not specified"}\nDate: ${data.date || "Not specified"}\nTime: ${data.time || "Not specified"}`,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
