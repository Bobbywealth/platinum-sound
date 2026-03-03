"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SmsMarketingPage() {
  return (
    <DashboardPageShell>
      <Card>
        <CardHeader><CardTitle>SMS Marketing</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No SMS campaign data available yet.</p>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
