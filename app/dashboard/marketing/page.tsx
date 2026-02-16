"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function MarketingPage() {
  return (
    <DashboardPageShell>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
        <p className="text-muted-foreground">
          Choose a marketing channel to manage your campaigns
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/dashboard/marketing/email">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-royal/20 dark:bg-royal/30">
                  <Mail className="h-8 w-8 text-royal dark:text-royal-foreground" />
                </div>
                <div>
                  <CardTitle>Email Campaigns</CardTitle>
                  <CardDescription>
                    Send promotional emails to your clients
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Manage email marketing campaigns, templates, and subscribers</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/marketing/sms">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>SMS Campaigns</CardTitle>
                  <CardDescription>
                    Send text messages to your clients
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Manage SMS marketing, templates, and contacts</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardPageShell>
  )
}
