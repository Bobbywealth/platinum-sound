import { bookings } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingCode } = await request.json()

    const booking = bookings.find((b) => b.id === bookingCode.toUpperCase())

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking })
  } catch {
    return NextResponse.json(
      { error: "Check-in failed" },
      { status: 500 }
    )
  }
}
