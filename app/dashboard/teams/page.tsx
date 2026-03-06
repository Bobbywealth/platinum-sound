"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, getInitials } from "@/lib/utils"
import { Mail, Pencil, Phone, Plus, Search, Shield, Trash2, Users } from "lucide-react"
import { useState } from "react"

// ─── Role definitions ─────────────────────────────────────────────────────────

type RoleKey =
  | "ADMIN"
  | "MANAGER"
  | "BOOKING_AGENT"
  | "ENGINEER"
  | "INTERN"
  | "FINANCE"
  | "MARKETING"
  | "FRONT_DESK"

const ALL_ROLES: RoleKey[] = [
  "ADMIN",
  "MANAGER",
  "BOOKING_AGENT",
  "ENGINEER",
  "INTERN",
  "FINANCE",
  "MARKETING",
  "FRONT_DESK",
]

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

const roleConfig: Record<RoleKey, { label: string; description: string; variant: BadgeVariant }> = {
  ADMIN:         { label: "Administrator", description: "Full access to all system features and settings",                          variant: "default" },
  MANAGER:       { label: "Manager",       description: "Manage bookings, staff, reports, and studio operations",                   variant: "secondary" },
  BOOKING_AGENT: { label: "Booking Agent", description: "Create and manage bookings, view calendar, handle client requests",        variant: "secondary" },
  ENGINEER:      { label: "Engineer",      description: "Update availability, manage sessions, apply discounts within limits",      variant: "secondary" },
  INTERN:        { label: "Intern",        description: "Inventory sign-offs, work order signing, and view-only calendar access",   variant: "outline" },
  FINANCE:       { label: "Finance",       description: "Invoices, expenses, and financial reports — no booking access",           variant: "outline" },
  MARKETING:     { label: "Marketing",     description: "Email/SMS campaigns, client communications, and analytics",               variant: "outline" },
  FRONT_DESK:    { label: "Front Desk",    description: "View-only calendar and bookings, assist with client check-in",            variant: "outline" },
}

// ─── Page access definitions ──────────────────────────────────────────────────

interface PageDef {
  label: string
  href: string
  section: string
}

const PAGES: PageDef[] = [
  { label: "Overview",        href: "/dashboard",               section: "Dashboard" },
  { label: "Master Calendar", href: "/dashboard/calendar",      section: "Calendar & Scheduling" },
  { label: "Availability",    href: "/dashboard/availability",  section: "Calendar & Scheduling" },
  { label: "Daily Schedule",  href: "/dashboard/schedule",      section: "Calendar & Scheduling" },
  { label: "Bookings",        href: "/dashboard/bookings",      section: "Operations" },
  { label: "Tasks",           href: "/dashboard/tasks",         section: "Operations" },
  { label: "Studios",         href: "/dashboard/studios",       section: "Operations" },
  { label: "Services",        href: "/dashboard/services",      section: "Operations" },
  { label: "Inventory",       href: "/dashboard/inventory",     section: "Operations" },
  { label: "Work Orders",     href: "/dashboard/work-orders",   section: "Operations" },
  { label: "Reports",         href: "/dashboard/reports",       section: "Finance & Reports" },
  { label: "Analytics",       href: "/dashboard/analytics",     section: "Finance & Reports" },
  { label: "Invoices",        href: "/dashboard/invoices",      section: "Finance & Reports" },
  { label: "Expenses",        href: "/dashboard/expenses",      section: "Finance & Reports" },
  { label: "Marketing",       href: "/dashboard/marketing",     section: "Marketing" },
  { label: "Clients",         href: "/dashboard/clients",       section: "People" },
  { label: "Teams",           href: "/dashboard/teams",         section: "People" },
  { label: "Settings",        href: "/dashboard/settings",      section: "System" },
]

const access = (hrefs: string[]): Record<string, boolean> =>
  Object.fromEntries(PAGES.map((p) => [p.href, hrefs.includes(p.href)]))

const defaultPageAccess: Record<RoleKey, Record<string, boolean>> = {
  ADMIN: Object.fromEntries(PAGES.map((p) => [p.href, true])),
  MANAGER: access([
    "/dashboard", "/dashboard/calendar", "/dashboard/availability", "/dashboard/schedule",
    "/dashboard/bookings", "/dashboard/tasks", "/dashboard/studios", "/dashboard/services",
    "/dashboard/inventory", "/dashboard/work-orders", "/dashboard/reports", "/dashboard/analytics",
    "/dashboard/invoices", "/dashboard/expenses", "/dashboard/marketing", "/dashboard/clients",
    "/dashboard/teams",
  ]),
  BOOKING_AGENT: access([
    "/dashboard", "/dashboard/calendar", "/dashboard/schedule",
    "/dashboard/bookings", "/dashboard/studios", "/dashboard/services", "/dashboard/clients",
  ]),
  ENGINEER: access([
    "/dashboard", "/dashboard/calendar", "/dashboard/availability", "/dashboard/schedule",
    "/dashboard/bookings", "/dashboard/tasks", "/dashboard/work-orders",
  ]),
  INTERN: access([
    "/dashboard", "/dashboard/calendar", "/dashboard/schedule",
    "/dashboard/tasks", "/dashboard/inventory", "/dashboard/work-orders",
  ]),
  FINANCE: access([
    "/dashboard", "/dashboard/reports", "/dashboard/analytics",
    "/dashboard/invoices", "/dashboard/expenses",
  ]),
  MARKETING: access([
    "/dashboard", "/dashboard/reports", "/dashboard/analytics",
    "/dashboard/marketing", "/dashboard/clients",
  ]),
  FRONT_DESK: access([
    "/dashboard", "/dashboard/calendar", "/dashboard/schedule",
    "/dashboard/bookings", "/dashboard/clients",
  ]),
}

// ─── Team member interface ────────────────────────────────────────────────────

interface TeamMember {
  id: string
  name: string
  role: RoleKey
  email: string
  phone: string
}

const emptyAddForm = {
  name: "",
  email: "",
  phone: "",
  role: "FRONT_DESK" as RoleKey,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<RoleKey | "ALL">("ALL")
  const [pageAccess, setPageAccess] = useState(defaultPageAccess)

  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyAddForm })

  const [editOpen, setEditOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editForm, setEditForm] = useState({ ...emptyAddForm })

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleConfig[m.role].label.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "ALL" || m.role === filterRole
    return matchesSearch && matchesRole
  })

  function openAddModal() {
    setAddForm({ ...emptyAddForm })
    setAddOpen(true)
  }

  async function handleAddSubmit() {
    if (!addForm.name.trim() || !addForm.email.trim()) return
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addForm.email.trim(),
          name: addForm.name.trim(),
          phone: addForm.phone.trim(),
          role: addForm.role,
          password: 'password123', // Default password
        }),
      })
      
      if (res.ok) {
        // Refresh the members list
        const settingsRes = await fetch('/api/settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          setMembers(data.team || [])
        }
        setAddOpen(false)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add member')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Failed to add member')
    }
  }

  function openEditModal(member: TeamMember) {
    setEditingMember(member)
    setEditForm({ name: member.name, email: member.email, phone: member.phone, role: member.role })
    setEditOpen(true)
  }

  async function handleEditSubmit() {
    if (!editingMember || !editForm.name.trim() || !editForm.email.trim()) return
    
    try {
      const res = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editingMember.email,
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          role: editForm.role,
          password: 'password123', // Keep existing password
        }),
      })
      
      if (res.ok) {
        // Refresh the members list
        const settingsRes = await fetch('/api/settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          setMembers(data.team || [])
        }
        setEditOpen(false)
        setEditingMember(null)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update member')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Failed to update member')
    }
  }

  async function handleDelete(id: string) {
    const member = members.find(m => m.id === id)
    if (!member) return
    
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return
    
    try {
      const res = await fetch(`/api/settings?email=${encodeURIComponent(member.email)}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        // Refresh the members list
        const settingsRes = await fetch('/api/settings')
        if (settingsRes.ok) {
          const data = await settingsRes.json()
          setMembers(data.team || [])
        }
      } else {
        alert('Failed to delete member')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Failed to delete member')
    }
  }

  function togglePageAccess(role: RoleKey, href: string) {
    if (role === "ADMIN") return
    setPageAccess((prev) => ({
      ...prev,
      [role]: { ...prev[role], [href]: !prev[role][href] },
    }))
  }

  const pageSections = Array.from(new Set(PAGES.map((p) => p.section)))

  return (
    <DashboardPageShell>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Team Management
          </h1>
          <p className="text-muted-foreground">Manage your team members and their access levels</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* ── Team Members Tab ── */}
        <TabsContent value="members" className="space-y-4 mt-4">
          {/* Role filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRole("ALL")}
              className={cn(
                "rounded-lg border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted/50",
                filterRole === "ALL" && "border-primary ring-1 ring-primary"
              )}
            >
              All <span className="ml-1 font-bold">{members.length}</span>
            </button>
            {ALL_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={cn(
                  "rounded-lg border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted/50",
                  filterRole === role && "border-primary ring-1 ring-primary"
                )}
              >
                {roleConfig[role].label}{" "}
                <span className="ml-1 font-bold">
                  {members.filter((m) => m.role === role).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Members Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{member.name}</p>
                        <Badge variant={roleConfig[member.role].variant} className="mt-0.5 text-xs">
                          {roleConfig[member.role].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(member)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{member.phone || "—"}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {roleConfig[member.role].description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {members.length === 0
                ? 'No team members yet. Click "Add Member" to get started.'
                : "No team members match your search."}
            </div>
          )}
        </TabsContent>

        {/* ── Permissions Tab ── */}
        <TabsContent value="permissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Page Access by Role
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure which pages each role can access by default. Administrator always has full access.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="sticky left-0 bg-card text-left font-medium text-muted-foreground py-3 pr-6 min-w-[150px]">
                        Page
                      </th>
                      {ALL_ROLES.map((role) => (
                        <th key={role} className="text-center font-medium py-3 px-2 min-w-[100px]">
                          <Badge variant={roleConfig[role].variant} className="text-xs whitespace-nowrap">
                            {roleConfig[role].label}
                          </Badge>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageSections.map((section) => (
                      <>
                        <tr key={`section-${section}`}>
                          <td
                            colSpan={ALL_ROLES.length + 1}
                            className="sticky left-0 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-2"
                          >
                            {section}
                          </td>
                        </tr>
                        {PAGES.filter((p) => p.section === section).map((page) => (
                          <tr
                            key={page.href}
                            className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                          >
                            <td className="sticky left-0 bg-card py-2.5 pr-6 font-medium">
                              {page.label}
                            </td>
                            {ALL_ROLES.map((role) => (
                              <td key={role} className="text-center py-2.5 px-2">
                                <Checkbox
                                  checked={pageAccess[role][page.href]}
                                  onCheckedChange={() => togglePageAccess(role, page.href)}
                                  disabled={role === "ADMIN"}
                                  className="mx-auto"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                * Administrator always has access to all pages and cannot be restricted.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add Member Dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Invite a new member to your team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="addName">Full Name *</Label>
              <Input
                id="addName"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Jane Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addEmail">Email *</Label>
              <Input
                id="addEmail"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="jane@platinumsound.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addPhone">Phone</Label>
              <Input
                id="addPhone"
                value={addForm.phone}
                onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={addForm.role}
                onValueChange={(v) => setAddForm((f) => ({ ...f, role: v as RoleKey }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleConfig[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {addForm.role && (
                <p className="text-xs text-muted-foreground">{roleConfig[addForm.role].description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Member Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update this member's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Full Name *</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input
                id="editPhone"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(v) => setEditForm((f) => ({ ...f, role: v as RoleKey }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleConfig[role].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.role && (
                <p className="text-xs text-muted-foreground">{roleConfig[editForm.role].description}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  )
}
