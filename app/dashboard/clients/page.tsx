"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { clients as initialClients, bookings, type Client } from "@/lib/data"
import { formatCurrency, getInitials } from "@/lib/utils"
import { Plus, Search, Mail, Phone, MoreVertical, User, Calendar, DollarSign, Trash2, Pencil } from "lucide-react"
import { useState } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─── helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Client["status"] }) {
  const styles =
    status === "active"
      ? "bg-green-500/10 text-green-500"
      : status === "pending"
      ? "bg-yellow-500/10 text-yellow-500"
      : "bg-muted text-muted-foreground"
  const dotStyle =
    status === "active"
      ? "status-dot status-active mr-2"
      : status === "pending"
      ? "status-dot status-pending mr-2"
      : "status-dot mr-2"

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
      <span className={dotStyle} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── empty form shapes ─────────────────────────────────────────────────────────

const emptyClientForm = {
  name: "",
  email: "",
  phone: "",
  label: "",
  project: "",
  budget: "",
  status: "active" as Client["status"],
}

// ─── component ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")

  // ── Add Client dialog ──
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyClientForm })

  // ── Edit Client dialog ──
  const [editOpen, setEditOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [editForm, setEditForm] = useState({ ...emptyClientForm })

  // ── Client Detail dialog ──
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailClient, setDetailClient] = useState<Client | null>(null)

  // ── Delete confirmation dialog ──
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)

  const filteredClients = clientList.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeClients = clientList.filter((c) => c.status === "active").length
  const totalBudget = clientList.reduce((acc, c) => acc + c.budget, 0)

  // ── Add handlers ──
  function openAddModal() {
    setAddForm({ ...emptyClientForm })
    setAddOpen(true)
  }

  function handleAddSubmit() {
    if (!addForm.name.trim()) return
    const newClient: Client = {
      id: Date.now().toString(),
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      label: addForm.label.trim() || "—",
      project: addForm.project.trim() || "—",
      budget: parseFloat(addForm.budget) || 0,
      status: addForm.status,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setClientList((prev) => [...prev, newClient])
    setAddOpen(false)
  }

  // ── Edit handlers ──
  function openEditModal(client: Client) {
    setEditingClient(client)
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      label: client.label,
      project: client.project,
      budget: client.budget > 0 ? client.budget.toString() : "",
      status: client.status,
    })
    setEditOpen(true)
  }

  function handleEditSubmit() {
    if (!editingClient || !editForm.name.trim()) return
    setClientList((prev) =>
      prev.map((c) =>
        c.id === editingClient.id
          ? {
              ...c,
              name: editForm.name.trim(),
              email: editForm.email.trim(),
              phone: editForm.phone.trim(),
              label: editForm.label.trim() || "—",
              project: editForm.project.trim() || "—",
              budget: parseFloat(editForm.budget) || 0,
              status: editForm.status,
            }
          : c
      )
    )
    setEditOpen(false)
    setEditingClient(null)
  }

  // ── Delete handlers ──
  function openDeleteModal(client: Client) {
    setDeletingClient(client)
    setDeleteOpen(true)
  }

  function handleDeleteConfirm() {
    if (!deletingClient) return
    setClientList((prev) => prev.filter((c) => c.id !== deletingClient.id))
    setDeleteOpen(false)
    setDeletingClient(null)
  }

  // ── Detail handler ──
  function openDetailModal(client: Client) {
    setDetailClient(client)
    setDetailOpen(true)
  }

  // Client bookings helper
  function getClientBookings(clientId: string) {
    return bookings.filter((b) => b.clientId === clientId)
  }

  // ── Reusable client form fields ──
  function ClientFormFields({
    form,
    setForm,
  }: {
    form: typeof emptyClientForm
    setForm: React.Dispatch<React.SetStateAction<typeof emptyClientForm>>
  }) {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="cl-name">Client Name <span className="text-destructive">*</span></Label>
          <Input
            id="cl-name"
            placeholder="Enter client name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-email">Email</Label>
          <Input
            id="cl-email"
            type="email"
            placeholder="client@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-phone">Phone</Label>
          <Input
            id="cl-phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-label">Label / Company</Label>
          <Input
            id="cl-label"
            placeholder="Record label or company"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-project">Project</Label>
          <Input
            id="cl-project"
            placeholder="Current project"
            value={form.project}
            onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-budget">Budget ($)</Label>
          <Input
            id="cl-budget"
            type="number"
            min="0"
            placeholder="Project budget"
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-status">Status</Label>
          <Select
            value={form.status}
            onValueChange={(val) =>
              setForm((f) => ({ ...f, status: val as Client["status"] }))
            }
          >
            <SelectTrigger id="cl-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Client Roster</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your studio clients and projects</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientList.length}</div>
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
                          {/* BUG #8 fix: clicking the name opens the detail modal */}
                          <button
                            className="font-medium hover:underline hover:text-primary transition-colors text-left"
                            onClick={() => openDetailModal(client)}
                          >
                            {client.name}
                          </button>
                          <div className="text-sm text-muted-foreground">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{client.label}</td>
                    <td className="p-4">{client.project}</td>
                    <td className="p-4 text-primary font-medium">
                      {client.budget > 0 ? formatCurrency(client.budget) : "—"}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${client.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`tel:${client.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                        {/* BUG #7 fix: three-dots dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailModal(client)}>
                              <User className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(client)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => openDeleteModal(client)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                    {/* BUG #8 fix: clicking the name opens the detail modal */}
                    <button
                      className="font-semibold truncate hover:underline hover:text-primary transition-colors text-left w-full"
                      onClick={() => openDetailModal(client)}
                    >
                      {client.name}
                    </button>
                    <div className="text-sm text-muted-foreground truncate">{client.email}</div>
                  </div>
                </div>
                <StatusBadge status={client.status} />
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
                    {client.budget > 0 ? formatCurrency(client.budget) : "—"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button size="sm" variant="ghost" className="flex-1" asChild>
                  <a href={`mailto:${client.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>
                <Button size="sm" variant="ghost" className="flex-1" asChild>
                  <a href={`tel:${client.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
                {/* BUG #7 fix: mobile three-dots dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDetailModal(client)}>
                      <User className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditModal(client)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => openDeleteModal(client)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* ═══════════════════════════════════════════════════════════════════════
          Add Client Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Add a new client to your roster</DialogDescription>
          </DialogHeader>
          <ClientFormFields form={addForm} setForm={setAddForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={!addForm.name.trim()}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          Edit Client Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update details for {editingClient?.name}</DialogDescription>
          </DialogHeader>
          <ClientFormFields form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={!editForm.name.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          Client Detail Dialog (BUG #8)
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          {detailClient && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {getInitials(detailClient.name)}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{detailClient.name}</DialogTitle>
                    <DialogDescription className="mt-0.5">
                      {detailClient.label}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Contact
                  </h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`mailto:${detailClient.email}`} className="hover:underline">
                        {detailClient.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${detailClient.phone}`} className="hover:underline">
                        {detailClient.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Project info */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Project
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Project</p>
                      <p className="font-medium mt-0.5">{detailClient.project}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium text-primary mt-0.5">
                        {detailClient.budget > 0 ? formatCurrency(detailClient.budget) : "—"}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={detailClient.status} />
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Client Since</p>
                      <p className="font-medium mt-0.5">{detailClient.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Booking history */}
                {(() => {
                  const clientBookings = getClientBookings(detailClient.id)
                  if (clientBookings.length === 0) return null
                  return (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Booking History
                      </h3>
                      <div className="space-y-2">
                        {clientBookings.map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between rounded-lg border p-3 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="font-medium">{b.sessionType} — {b.studio}</p>
                                <p className="text-xs text-muted-foreground">
                                  {b.date} · {b.startTime}–{b.endTime} · {b.engineer}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                b.status === "completed"
                                  ? "bg-muted text-muted-foreground"
                                  : b.status === "confirmed" || b.status === "in-progress"
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailOpen(false)
                    openEditModal(detailClient)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button onClick={() => setDetailOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          Delete Confirmation Dialog
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">{deletingClient?.name}</span> from
              your roster? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

