"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StaffPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Teams page since we're consolidating
    router.replace("/dashboard/teams")
  }, [router])

  return (
    <DashboardPageShell>
      <p className="text-sm text-muted-foreground">Redirecting to teams...</p>
    </DashboardPageShell>
  )
}
