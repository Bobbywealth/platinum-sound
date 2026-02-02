import { clients } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newClient = {
      id: String(clients.length + 1).padStart(3, "0"),
      ...body,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    clients.push(newClient as any)

    return NextResponse.json(newClient, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    )
  }
}
