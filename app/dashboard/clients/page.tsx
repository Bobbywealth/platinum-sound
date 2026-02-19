"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clients } from "@/lib/data"
import { formatCurrency, getInitials } from "@/lib/utils"
import { Plus, Search, Mail, Phone, MoreVertical } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeClients = clients.filter((c) => c.status === "active").length
  const totalBudget = clients.reduce((acc, c) => acc + c.budget, 0)

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Client Roster</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your studio clients and projects</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your roster
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" placeholder="Enter client name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input id="clientEmail" type="email" placeholder="client@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientPhone">Phone</Label>
                <Input id="clientPhone" placeholder="Phone number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="label">Label / Company</Label>
                <Input id="label" placeholder="Record label or company" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Input id="project" placeholder="Current project" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" type="number" placeholder="Project budget" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Add Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients by name, label, or email..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Client List (Desktop) */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Client</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Label / Company</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Project</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Budget</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{client.label}</td>
                    <td className="p-4">{client.project}</td>
                    <td className="p-4 text-primary font-medium">
                      {client.budget > 0 ? formatCurrency(client.budget) : "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : client.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`status-dot mr-2 ${
                            client.status === "active"
                              ? "status-active"
                              : client.status === "pending"
                              ? "status-pending"
                              : ""
                          }`}
                        />
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client List (Mobile) */}
      <div className="md:hidden space-y-3">
        {filteredClients.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                    {getInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{client.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{client.email}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    client.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : client.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span
                    className={`status-dot mr-1 ${
                      client.status === "active"
                        ? "status-active"
                        : client.status === "pending"
                        ? "status-pending"
                        : ""
                    }`}
                  />
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Label / Company:</span>
                  <span className="font-medium">{client.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{client.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium text-primary">
                    {client.budget > 0 ? formatCurrency(client.budget) : "-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button size="sm" variant="ghost" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="ghost" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No clients found matching your search.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
