import { bookings } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  // In production, this would query the database
  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newBooking = {
      id: `B${String(bookings.length + 1).padStart(3, "0")}`,
      clientName: body.clientName,
      date: body.date,
      studio: body.studio,
      startTime: body.startTime,
      endTime: body.endTime,
      duration: body.duration,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In production, this would save to database
    bookings.push(newBooking as any)

    return NextResponse.json(newBooking, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
