"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Search, Mail, Phone } from "lucide-react"
import { useState } from "react"

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  initials: string
  roleType: "admin" | "editor" | "viewer"
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Bobby Chidumaga",
    role: "Admin",
    email: "bobbyc@platinumsound.com",
    phone: "+1 (555) 123-4567",
    initials: "BC",
    roleType: "admin",
  },
  {
    id: "2",
    name: "John Smith",
    role: "Editor",
    email: "johnsmith@platinumsound.com",
    phone: "+1 (555) 234-5678",
    initials: "JS",
    roleType: "editor",
  },
  {
    id: "3",
    name: "Jane Doe",
    role: "Editor",
    email: "janedoe@platinumsound.com",
    phone: "+1 (555) 345-6789",
    initials: "JD",
    roleType: "editor",
  },
  {
    id: "4",
    name: "Mike Johnson",
    role: "Viewer",
    email: "mikej@platinumsound.com",
    phone: "+1 (555) 456-7890",
    initials: "MJ",
    roleType: "viewer",
  },
  {
    id: "5",
    name: "Sarah Wilson",
    role: "Editor",
    email: "sarahw@platinumsound.com",
    phone: "+1 (555) 567-8901",
    initials: "SW",
    roleType: "editor",
  },
  {
    id: "6",
    name: "Tom Brown",
    role: "Viewer",
    email: "tombrown@platinumsound.com",
    phone: "+1 (555) 678-9012",
    initials: "TB",
    roleType: "viewer",
  },
]

const roleColors = {
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  editor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your studio team</p>
        </div>
        <Button>
          Add Team Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
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
                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${roleColors[member.roleType]}`}>
                      {member.role}
                    </span>
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
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No team members found</p>
        </div>
      )}
    </div>
  )
}
