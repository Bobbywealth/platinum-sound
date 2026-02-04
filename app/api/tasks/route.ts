import { tasks } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTask = {
      id: `T${String(tasks.length + 1).padStart(3, "0")}`,
      ...body,
      status: body.status || "todo",
      isRecurring: body.isRecurring || false,
      createdAt: new Date().toISOString().split("T")[0],
    }

    tasks.push(newTask as any)
    return NextResponse.json(newTask, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
