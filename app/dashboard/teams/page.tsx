"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { cn, getInitials } from "@/lib/utils"
import { Mail, Pencil, Phone, Plus, Search, Trash2, Users } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  roleType: "admin" | "editor" | "viewer"
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Bobby Chidumaga",
    role: "Admin",
    email: "bobbyc@platinumsound.com",
    phone: "+1 (555) 123-4567",
    roleType: "admin",
  },
  {
    id: "2",
    name: "John Smith",
    role: "Editor",
    email: "johnsmith@platinumsound.com",
    phone: "+1 (555) 234-5678",
    roleType: "editor",
  },
  {
    id: "3",
    name: "Jane Doe",
    role: "Editor",
    email: "janedoe@platinumsound.com",
    phone: "+1 (555) 345-6789",
    roleType: "editor",
  },
  {
    id: "4",
    name: "Mike Johnson",
    role: "Viewer",
    email: "mikej@platinumsound.com",
    phone: "+1 (555) 456-7890",
    roleType: "viewer",
  },
  {
    id: "5",
    name: "Sarah Wilson",
    role: "Editor",
    email: "sarahw@platinumsound.com",
    phone: "+1 (555) 567-8901",
    roleType: "editor",
  },
  {
    id: "6",
    name: "Tom Brown",
    role: "Viewer",
    email: "tombrown@platinumsound.com",
    phone: "+1 (555) 678-9012",
    roleType: "viewer",
  },
]

const roleConfig = {
  admin: {
    variant: "default" as const,
    label: "Admin",
    description: "Full access to all features",
  },
  editor: {
    variant: "secondary" as const,
    label: "Editor",
    description: "Can edit and manage content",
  },
  viewer: {
    variant: "outline" as const,
    label: "Viewer",
    description: "Read-only access",
  },
}

const emptyAddForm = {
  name: "",
  email: "",
  phone: "",
  roleType: "viewer" as TeamMember["roleType"],
}

export default function TeamsPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Add modal state
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyAddForm })

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editForm, setEditForm] = useState({ ...emptyAddForm })

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !selectedRole || member.roleType === selectedRole
    return matchesSearch && matchesRole
  })

  const roleCounts = {
    all: members.length,
    admin: members.filter((m) => m.roleType === "admin").length,
    editor: members.filter((m) => m.roleType === "editor").length,
    viewer: members.filter((m) => m.roleType === "viewer").length,
  }

  // --- Add Member handlers ---
  function openAddModal() {
    setAddForm({ ...emptyAddForm })
    setAddOpen(true)
  }

  function handleAddSubmit() {
    if (!addForm.name.trim() || !addForm.email.trim()) return
    const roleLabel =
      addForm.roleType.charAt(0).toUpperCase() + addForm.roleType.slice(1)
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      role: roleLabel,
      roleType: addForm.roleType,
    }
    setMembers((prev) => [...prev, newMember])
    setAddOpen(false)
  }

  // --- Edit Member handlers ---
  function openEditModal(member: TeamMember) {
    setEditingMember(member)
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      roleType: member.roleType,
    })
    setEditOpen(true)
  }

  function handleEditSubmit() {
    if (!editingMember || !editForm.name.trim() || !editForm.email.trim()) return
    const roleLabel =
      editForm.roleType.charAt(0).toUpperCase() + editForm.roleType.slice(1)
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: editForm.name.trim(),
              email: editForm.email.trim(),
              phone: editForm.phone.trim(),
              role: roleLabel,
              roleType: editForm.roleType,
            }
          : m
      )
    )
    setEditOpen(false)
    setEditingMember(null)
  }

  // --- Delete handler ---
  function handleDelete(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

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

      {/* Role Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([
          { key: null, label: "All Members", count: roleCounts.all },
          { key: "admin", label: "Admins", count: roleCounts.admin },
          { key: "editor", label: "Editors", count: roleCounts.editor },
          { key: "viewer", label: "Viewers", count: roleCounts.viewer },
        ] as const).map(({ key, label, count }) => (
          <button
            key={label}
            onClick={() => setSelectedRole(key as string | null)}
            className={cn(
              "text-left rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50",
              selectedRole === key && "border-primary ring-1 ring-primary"
            )}
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{count}</p>
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
                    <Badge variant={roleConfig[member.roleType].variant} className="mt-0.5 text-xs">
                      {roleConfig[member.roleType].label}
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
                  <span>{member.phone}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {roleConfig[member.roleType].description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No team members match your search.
        </div>
      )}

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
                value={addForm.roleType}
                onValueChange={(v) =>
                  setAddForm((f) => ({ ...f, roleType: v as TeamMember["roleType"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
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
                value={editForm.roleType}
                onValueChange={(v) =>
                  setEditForm((f) => ({ ...f, roleType: v as TeamMember["roleType"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
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
