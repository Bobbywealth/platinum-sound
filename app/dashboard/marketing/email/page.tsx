"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailMarketingPage() {
  return (
    <DashboardPageShell>
      <Card>
        <CardHeader><CardTitle>Email Marketing</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No campaign data available yet.</p>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
