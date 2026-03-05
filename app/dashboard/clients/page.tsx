"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, getInitials } from "@/lib/utils"
import { Plus, Search, Mail, Phone, MoreVertical, User, Calendar, DollarSign, Trash2, Pencil, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { ImportClientsDialog } from "@/components/clients/import-clients-dialog"
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


interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  address: string
  city: string
  notes: string
  firstVisit: string | null
  status: "active" | "pending" | "completed"
  createdAt: string
  transactionCount?: number
  lifetimeSpend?: number
}

interface BookingRef {
  id: string
  clientId: string
  sessionType: string
  studio: string
  date: string
  startTime: string
  endTime: string
  engineer: string
  status: "completed" | "confirmed" | "in-progress" | "pending" | string
}

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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  address: "",
  city: "",
  notes: "",
  firstVisit: "",
  status: "active" as Client["status"],
}

// ── Reusable client form fields (moved outside to prevent re-renders) ──
type ClientFormProps = {
  form: typeof emptyClientForm
  setForm: React.Dispatch<React.SetStateAction<typeof emptyClientForm>>
}

function ClientFormFields({ form, setForm }: ClientFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cl-firstName">First Name <span className="text-destructive">*</span></Label>
          <Input
            id="cl-firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cl-lastName">Last Name <span className="text-destructive">*</span></Label>
          <Input
            id="cl-lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
        </div>
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
        <Label htmlFor="cl-companyName">Company Name</Label>
        <Input
          id="cl-companyName"
          placeholder="Company or record label"
          value={form.companyName}
          onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cl-address">Address</Label>
        <Input
          id="cl-address"
          placeholder="Street address"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cl-city">City</Label>
        <Input
          id="cl-city"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cl-firstVisit">First Visit</Label>
        <Input
          id="cl-firstVisit"
          type="date"
          value={form.firstVisit}
          onChange={(e) => setForm((f) => ({ ...f, firstVisit: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cl-notes">Memo</Label>
        <Input
          id="cl-notes"
          placeholder="Notes or memo"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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

// ─── component ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>([])
  const [bookings, setBookings] = useState<BookingRef[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalClients, setTotalClients] = useState(0)
  const clientsPerPage = 20

  // ── Add Client dialog ──
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyClientForm })

  // ── Import dialog ──
  const [importOpen, setImportOpen] = useState(false)

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

  // Fetch clients with pagination
  useEffect(() => {
    const fetchClients = async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      params.set('limit', clientsPerPage.toString())
      if (searchQuery) {
        params.set('search', searchQuery)
      }
      
      const response = await fetch(`/api/clients?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setClientList(data.clients.map((c: any) => ({ ...c, status: (c.status || 'pending').toLowerCase() })))
        setTotalPages(data.pagination.totalPages)
        setTotalClients(data.pagination.total)
      }
    }
    
    fetchClients()
    fetch("/api/bookings").then((r) => (r.ok ? r.json() : [])).then(setBookings)
  }, [currentPage, searchQuery])

  const activeClients = clientList.filter((c) => c.status === "active").length
  const totalLifetimeSpend = clientList.reduce((acc, c) => acc + (c.lifetimeSpend || 0), 0)

  // ── Add handlers ──
  function openAddModal() {
    setAddForm({ ...emptyClientForm })
    setAddOpen(true)
  }

  async function handleAddSubmit() {
    if (!addForm.firstName.trim() || !addForm.lastName.trim()) return
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: addForm.firstName.trim(),
          lastName: addForm.lastName.trim(),
          email: addForm.email.trim(),
          phone: addForm.phone.trim(),
          companyName: addForm.companyName.trim(),
          address: addForm.address.trim(),
          city: addForm.city.trim(),
          notes: addForm.notes.trim(),
          firstVisit: addForm.firstVisit || null,
          status: addForm.status,
        }),
      })
      
      if (response.ok) {
        const savedClient = await response.json()
        setClientList((prev) => [...prev, savedClient])
      }
    } catch (error) {
      console.error('Failed to add client:', error)
    }
    
    setAddOpen(false)
  }

  // ── Edit handlers ──
  function openEditModal(client: Client) {
    setEditingClient(client)
    setEditForm({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      companyName: client.companyName,
      address: client.address,
      city: client.city,
      notes: client.notes,
      firstVisit: client.firstVisit || "",
      status: client.status,
    })
    setEditOpen(true)
  }

  async function handleEditSubmit() {
    if (!editingClient || !editForm.firstName.trim() || !editForm.lastName.trim()) return
    
    try {
      const response = await fetch(`/api/clients?ids=${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          companyName: editForm.companyName.trim(),
          address: editForm.address.trim(),
          city: editForm.city.trim(),
          notes: editForm.notes.trim(),
          firstVisit: editForm.firstVisit || null,
          status: editForm.status,
        }),
      })
      
      if (response.ok) {
        const updatedClient = await response.json()
        setClientList((prev) =>
          prev.map((c) =>
            c.id === editingClient.id ? updatedClient : c
          )
        )
      }
    } catch (error) {
      console.error('Failed to update client:', error)
    }
    
    setEditOpen(false)
    setEditingClient(null)
  }

  // ── Delete handlers ──
  function openDeleteModal(client: Client) {
    setDeletingClient(client)
    setDeleteOpen(true)
  }

  async function handleDeleteConfirm() {
    if (!deletingClient) return
    
    try {
      const response = await fetch(`/api/clients?ids=${deletingClient.id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setClientList((prev) => prev.filter((c) => c.id !== deletingClient.id))
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
    
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

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Client Roster</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your studio clients and projects</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button className="w-full sm:w-auto" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Lifetime Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLifetimeSpend)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients by name, company, or email..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {/* Client List (Desktop) */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Phone</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Company</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">City</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">First Visit</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Txns</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Spend</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {getInitials(client.firstName + ' ' + client.lastName)}
                        </div>
                        <button
                          className="font-medium hover:underline hover:text-primary transition-colors text-left"
                          onClick={() => openDetailModal(client)}
                        >
                          {client.firstName} {client.lastName}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{client.email}</td>
                    <td className="p-4 text-muted-foreground">{client.phone || '—'}</td>
                    <td className="p-4">{client.companyName || '—'}</td>
                    <td className="p-4 text-muted-foreground">{client.city || '—'}</td>
                    <td className="p-4 text-muted-foreground">
                      {client.firstVisit ? new Date(client.firstVisit).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4 text-primary font-medium">
                      {client.transactionCount || 0}
                    </td>
                    <td className="p-4 text-primary font-medium">
                      {formatCurrency(client.lifetimeSpend || 0)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * clientsPerPage) + 1} to {Math.min(currentPage * clientsPerPage, totalClients)} of {totalClients} clients
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Client List (Mobile) */}
      <div className="md:hidden space-y-3">
        {clientList.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                    {getInitials(client.firstName + ' ' + client.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      className="font-semibold truncate hover:underline hover:text-primary transition-colors text-left w-full"
                      onClick={() => openDetailModal(client)}
                    >
                      {client.firstName} {client.lastName}
                    </button>
                    <div className="text-sm text-muted-foreground truncate">{client.email}</div>
                  </div>
                </div>
                <StatusBadge status={client.status} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{client.companyName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{client.city || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifetime Spend:</span>
                  <span className="font-medium text-primary">
                    {formatCurrency(client.lifetimeSpend || 0)}
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

        {clientList.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No clients found matching your search.
            </CardContent>
          </Card>
        )}
      </div>

      <ImportClientsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={(rows) => {
          const importedClients: Client[] = rows
            .filter((row) => (row.firstName).trim())
            .map((row) => {
              const nameParts = ('').trim().split(' ')
              const firstName = row.firstName || nameParts[0] || ''
              const lastName = row.lastName || nameParts.slice(1).join(' ') || ''
              return {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: row.email?.trim() || "",
                phone: row.phone?.trim() || "",
                companyName: row.companyName?.trim() || "",
                address: row.address?.trim() || "",
                city: row.city?.trim() || "",
                notes: row.notes?.trim() || "",
                firstVisit: row.firstVisit || null,
                status: row.status?.toLowerCase() === "active" ? "active" as const : "pending" as const,
                createdAt: new Date().toISOString().split("T")[0],
              }
            })

          if (importedClients.length) {
            setClientList((prev) => [...importedClients, ...prev])
          }
        }}
      />

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
            <Button onClick={handleAddSubmit} disabled={!addForm.firstName.trim() || !addForm.lastName.trim()}>
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
            <DialogDescription>Update details for {editingClient?.firstName + ' ' + editingClient?.lastName}</DialogDescription>
          </DialogHeader>
          <ClientFormFields form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={!editForm.firstName.trim() || !editForm.lastName.trim()}>
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
                    {getInitials(detailClient.firstName + ' ' + detailClient.lastName)}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{detailClient.firstName + ' ' + detailClient.lastName}</DialogTitle>
                    <DialogDescription className="mt-0.5">
                      {detailClient.companyName || '—'}
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
                    Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium mt-0.5">{detailClient.companyName || '—'}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">City</p>
                      <p className="font-medium mt-0.5">{detailClient.city || '—'}</p>
                    </div>
                    <div className="rounded-lg border p-3 col-span-2">
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium mt-0.5">{detailClient.address || '—'}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">First Visit</p>
                      <p className="font-medium mt-0.5">{detailClient.firstVisit ? new Date(detailClient.firstVisit).toLocaleDateString() : '—'}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Client Since</p>
                      <p className="font-medium mt-0.5">{new Date(detailClient.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="font-medium text-primary mt-0.5">{detailClient.transactionCount || 0}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Lifetime Spend</p>
                      <p className="font-medium text-primary mt-0.5">{formatCurrency(detailClient.lifetimeSpend || 0)}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={detailClient.status} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {detailClient.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Memo / Notes
                    </h3>
                    <div className="rounded-lg border p-3 text-sm">
                      {detailClient.notes}
                    </div>
                  </div>
                )}

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
              <span className="font-semibold text-foreground">{deletingClient?.firstName + ' ' + deletingClient?.lastName}</span> from
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
