import { NextRequest, NextResponse } from "next/server"
import { invoices } from "@/lib/data"

export async function GET() {
  return NextResponse.json(invoices)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      ...body,
      status: "pending",
      issuedDate: new Date().toISOString(),
    }

    invoices.push(newInvoice as any)

    return NextResponse.json(newInvoice, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    )
  }
}
