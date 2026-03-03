"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudiosPage() {
  return (
    <DashboardPageShell>
      <Card>
        <CardHeader><CardTitle>Studios</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Studio details will appear here once real studio scheduling data is available.</p>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
