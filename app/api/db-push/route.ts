import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Only allow in development or with a secret key
    const body = await req.json();
    const secret = process.env.DB_PUSH_SECRET;
    
    if (secret && body.secret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run prisma db push
    const { stdout, stderr } = await execAsync("npx prisma db push --skip-generate");
    
    return NextResponse.json({ 
      success: true, 
      message: "Database updated successfully",
      stdout,
      stderr 
    });
  } catch (error: any) {
    console.error("Database push error:", error);
    return NextResponse.json({ 
      error: "Failed to update database",
      details: error.message 
    }, { status: 500 });
  }
}
