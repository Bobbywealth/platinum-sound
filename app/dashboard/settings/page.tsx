"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, CreditCard, Users, Building2 } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newBookings: true,
    cancellations: true,
    reminders: false,
    reports: true,
  })

  const [studioName, setStudioName] = useState("Platinum Sound Studios")
  const [email, setEmail] = useState("admin@platinumsound.com")
  const [phone, setPhone] = useState("+1 (555) 234-5678")

  return (
    <DashboardPageShell className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your studio preferences and account settings
        </p>
      </div>

      {/* Studio Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Studio Profile
          </CardTitle>
          <CardDescription>Update your studio's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studioName">Studio Name</Label>
              <Input
                id="studioName"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">New Bookings</p>
              <p className="text-xs text-muted-foreground">Get notified when a new booking is made</p>
            </div>
            <Switch
              checked={notifications.newBookings}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newBookings: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cancellations</p>
              <p className="text-xs text-muted-foreground">Alert when a booking is cancelled</p>
            </div>
            <Switch
              checked={notifications.cancellations}
              onCheckedChange={(checked) => setNotifications({ ...notifications, cancellations: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reminders</p>
              <p className="text-xs text-muted-foreground">Send reminders 24h before sessions</p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Reports</p>
              <p className="text-xs text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch
              checked={notifications.reports}
              onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>Manage access and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Alex Johnson", role: "Admin", email: "alex@platinumsound.com" },
            { name: "Maria Garcia", role: "Engineer", email: "maria@platinumsound.com" },
            { name: "James Wilson", role: "Engineer", email: "james@platinumsound.com" },
          ].map((member) => (
            <div key={member.email} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <Badge variant="outline">{member.role}</Badge>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2">
            <Users className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
          <Separator />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Badge variant="outline" className="text-yellow-600 border-yellow-300 w-fit">Not Enabled</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing
          </CardTitle>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm font-medium">Professional Plan</p>
              <p className="text-xs text-muted-foreground">$99/month · Renews Jan 1, 2025</p>
            </div>
            <Badge className="bg-green-100 text-green-700 w-fit">Active</Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1">Manage Plan</Button>
            <Button variant="outline" className="flex-1">Update Payment</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
