"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, CreditCard, Users, Building2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  phone: string | null
}

type StudioSettings = {
  name: string
  email: string
  phone: string
  address: string
}

type NotificationKey = `${string}_${string}`

const EMAIL_NOTIFICATION_TYPES = [
  { key: 'BOOKING', label: 'New Bookings', description: 'Get notified when a new booking is made' },
  { key: 'CANCELLATION', label: 'Cancellations', description: 'Alert when a booking is cancelled' },
  { key: 'REMINDER', label: 'Reminders', description: 'Send reminders 24h before sessions' },
  { key: 'REPORT', label: 'Weekly Reports', description: 'Receive weekly performance summaries' },
]

const ROLES = ['ADMIN', 'MANAGER', 'BOOKING_AGENT', 'ENGINEER', 'INTERN', 'FINANCE', 'MARKETING', 'FRONT_DESK']

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Studio settings
  const [studioName, setStudioName] = useState("Platinum Sound Studios")
  const [email, setEmail] = useState("admin@platinumsound.com")
  const [phone, setPhone] = useState("+1 (555) 234-5678")
  const [address, setAddress] = useState("")
  
  // Notifications - keyed by ROLE_TYPE
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  
  // Team members
  const [team, setTeam] = useState<User[]>([])

  // Load settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (data.studio) {
            setStudioName(data.studio.name || "Platinum Sound Studios")
            setEmail(data.studio.email || "")
            setPhone(data.studio.phone || "")
            setAddress(data.studio.address || "")
          }
          if (data.notifications) {
            setNotifications(data.notifications)
          }
          if (data.team) {
            setTeam(data.team)
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  async function handleSaveStudio() {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studio: {
            name: studioName,
            email,
            phone,
            address,
          }
        })
      })
      
      if (response.ok) {
        toast({ title: 'Studio settings saved' })
      } else {
        toast({ title: 'Failed to save settings', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error saving studio settings:', error)
      toast({ title: 'Failed to save settings', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleNotificationChange(role: string, type: string, enabled: boolean) {
    const key = `${role}_${type}` as NotificationKey
    const newNotifications = { ...notifications, [key]: enabled }
    setNotifications(newNotifications)
    
    // Save immediately
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: newNotifications })
      })
      toast({ title: 'Notification settings updated' })
    } catch (error) {
      console.error('Error saving notification:', error)
      toast({ title: 'Failed to update notifications', variant: 'destructive' })
    }
  }

  if (isLoading) {
    return (
      <DashboardPageShell className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardPageShell>
    )
  }

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
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Studio address"
              />
            </div>
          </div>
          <Button onClick={handleSaveStudio} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
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
          {ROLES.map((role) => (
            <div key={role}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{role.replace('_', ' ')}</Badge>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                {EMAIL_NOTIFICATION_TYPES.map((type) => {
                  const key = `${role}_${type.key}`
                  const isEnabled = notifications[key] ?? true
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => handleNotificationChange(role, type.key, checked)}
                      />
                    </div>
                  )
                })}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
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
          {team.length === 0 ? (
            <p className="text-muted-foreground text-sm">No team members found.</p>
          ) : (
            team.map((member) => (
              <div key={member.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{member.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                  {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
                </div>
                <Badge variant="outline">{member.role.replace('_', ' ')}</Badge>
              </div>
            ))
          )}
          <Button variant="outline" className="w-full mt-2" asChild>
            <a href="/dashboard/staff">
              <Users className="h-4 w-4 mr-2" />
              Manage Team Members
            </a>
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
              <p className="text-xs text-muted-foreground">Contact support for billing inquiries</p>
            </div>
            <Badge className="bg-green-100 text-green-700 w-fit">Contact Us</Badge>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="flex-1" disabled>Manage Plan</Button>
            <Button variant="outline" className="flex-1" disabled>Update Payment</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
