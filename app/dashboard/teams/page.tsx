"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

const teamMembers: TeamMember[] = [
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

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !selectedRole || member.roleType === selectedRole
    return matchesSearch && matchesRole
  })

  const roleCounts = {
    all: teamMembers.length,
    admin: teamMembers.filter((m) => m.roleType === "admin").length,
    editor: teamMembers.filter((m) => m.roleType === "editor").length,
    viewer: teamMembers.filter((m) => m.roleType === "viewer").length,
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your studio team members and their roles</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Role Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", "admin", "editor", "viewer"] as const).map((role) => (
          <Button
            key={role}
            variant={selectedRole === null && role === "all" ? "default" : selectedRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRole(role === "all" ? null : role)}
            className="gap-2 flex-1 sm:flex-none min-w-[70px]"
          >
            <Users className="h-3 w-3" />
            <span className="hidden xs:inline">{role === "all" ? "All" : roleConfig[role].label}</span>
            <span className="ml-1 text-xs opacity-70">({roleCounts[role]})</span>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <Badge variant={roleConfig[member.roleType].variant} className="mt-1">
                      {roleConfig[member.roleType].label}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  {roleConfig[member.roleType].description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No team members found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </DashboardPageShell>
  )
}
