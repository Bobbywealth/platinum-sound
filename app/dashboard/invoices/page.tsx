"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Download, Send, DollarSign, Clock, AlertTriangle, CheckCircle, Pencil, Search, User, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type InvoiceStatus = "paid" | "pending" | "overdue"

interface InvoiceItem {
  description: string
  amount: number
}

interface Invoice {
  id: string
  clientId: string
  clientName: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  issuedDate: string
  items: InvoiceItem[]
  description?: string
}

export default function InvoicesPage() {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null)
  const [editForm, setEditForm] = useState<Partial<Invoice>>({})

  // Client selector state
  const [clients, setClients] = useState<any[]>([])
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null)
  const [isClientsLoading, setIsClientsLoading] = useState(false)
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  // Invoice line items state
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; quantity: number; rate: number }[]>([
    { description: '', quantity: 1, rate: 0 }
  ])
  const [invoiceDueDate, setInvoiceDueDate] = useState('')
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [invoiceTerms, setInvoiceTerms] = useState('Payment due within 30 days of invoice date.')

  // Services for selection
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setInvoiceList(rows.map((inv: any) => ({
        id: inv.id,
        clientId: inv.clientId,
        clientName: inv.client?.name ?? "Unknown",
        amount: inv.amount,
        status: String(inv.status).toLowerCase(),
        dueDate: inv.dueDate,
        issuedDate: inv.issuedDate,
        items: Array.isArray(inv.items) ? inv.items : [],
      }))))
  }, [])

  // Fetch clients for selector
  useEffect(() => {
    const fetchClients = async () => {
      setIsClientsLoading(true)
      try {
        const params = new URLSearchParams()
        if (clientSearch) {
          params.set('search', clientSearch)
        }
        params.set('status', 'ACTIVE')
        params.set('limit', '20')
        
        const res = await fetch(`/api/clients?${params}`)
        if (res.ok) {
          const data = await res.json()
          setClients(data.clients || [])
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setIsClientsLoading(false)
      }
    }

    // Debounce search
    const timeout = setTimeout(fetchClients, 300)
    return () => clearTimeout(timeout)
  }, [clientSearch])

  // Fetch services for line items
  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setServices(data))
      .catch(console.error)
  }, [])

  // Calculate totals
  const invoiceSubtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  const invoiceTotal = invoiceSubtotal // Can add tax calculation here if needed

  // Add/remove line items
  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: '', quantity: 1, rate: 0 }])
  }

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
    }
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems]
    updated[index] = { ...updated[index], [field]: value }
    setInvoiceItems(updated)
  }

  const handleServiceSelect = (index: number, service: any) => {
    updateInvoiceItem(index, 'description', service.serviceType)
    updateInvoiceItem(index, 'rate', service.basePrice)
  }

  const resetInvoiceForm = () => {
    setSelectedClient(null)
    setClientSearch('')
    setInvoiceItems([{ description: '', quantity: 1, rate: 0 }])
    setInvoiceDueDate('')
    setInvoiceNotes('')
    setInvoiceTerms('Payment due within 30 days of invoice date.')
  }

  const filteredInvoices = filter === "all"
    ? invoiceList
    : invoiceList.filter((inv) => inv.status === filter)

  const stats = {
    total: invoiceList.reduce((acc, inv) => acc + inv.amount, 0),
    paid: invoiceList.filter((inv) => inv.status === "paid").reduce((acc, inv) => acc + inv.amount, 0),
    pending: invoiceList.filter((inv) => inv.status === "pending").reduce((acc, inv) => acc + inv.amount, 0),
    overdue: invoiceList.filter((inv) => inv.status === "overdue").reduce((acc, inv) => acc + inv.amount, 0),
  }

  function openEdit(invoice: Invoice) {
    setEditInvoice(invoice)
    setEditForm({
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status,
      description: invoice.description ?? invoice.items.map((i) => i.description).join("; "),
    })
  }

  function saveEdit() {
    if (!editInvoice) return
    setInvoiceList((prev) =>
      prev.map((inv) => {
        if (inv.id !== editInvoice.id) return inv
        const newAmount = Number(editForm.amount ?? inv.amount)
        const newStatus = (editForm.status ?? inv.status) as InvoiceStatus
        const newDueDate = editForm.dueDate ?? inv.dueDate
        const newDesc = editForm.description ?? ""
        return {
          ...inv,
          amount: newAmount,
          status: newStatus,
          dueDate: newDueDate,
          description: newDesc,
          // Update first item amount if description changed
          items: newDesc !== inv.items.map((i) => i.description).join("; ")
            ? [{ description: newDesc, amount: newAmount }]
            : inv.items.map((item, idx) => idx === 0 ? { ...item, amount: newAmount } : item),
        }
      })
    )
    setEditInvoice(null)
  }

  const statusBadgeClass = (status: string) =>
    `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      status === "paid"
        ? "bg-green-500/10 text-green-500"
        : status === "pending"
        ? "bg-yellow-500/10 text-yellow-500"
        : "bg-red-500/10 text-red-500"
    }`

  return (
    <DashboardPageShell>
      <div className="space-y-4 sm:space-y-6 min-h-screen">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Invoices</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Manage billing and payments</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice / Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Invoice / Quote</DialogTitle>
                <DialogDescription>Create a new invoice or quote for a client</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoiceClient">Client</Label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="invoiceClient" 
                        placeholder="Search clients..." 
                        className="pl-9"
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value)
                          setShowClientDropdown(true)
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                      />
                    </div>
                    
                    {/* Client dropdown */}
                    {showClientDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {isClientsLoading ? (
                          <div className="p-3 text-center text-muted-foreground text-sm">
                            Loading...
                          </div>
                        ) : clients.length > 0 ? (
                          clients.map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              className="w-full p-3 text-left hover:bg-muted flex items-center gap-3 border-b last:border-b-0"
                              onClick={() => {
                                const fullName = `${client.firstName} ${client.lastName}`.trim()
                                setSelectedClient({ id: client.id, name: fullName || client.companyName || client.email })
                                setClientSearch(fullName || client.companyName || client.email)
                                setShowClientDropdown(false)
                              }}
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {client.firstName} {client.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {client.email || client.companyName}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-muted-foreground text-sm">
                            {clientSearch ? 'No clients found' : 'Type to search clients'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedClient && (
                    <p className="text-xs text-green-600 mt-1">Selected: {selectedClient.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceAmount">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Line Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                {invoiceItems.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid gap-2">
                        <Label htmlFor={`item-desc-${index}`}>Service</Label>
                        <div className="relative">
                          <Input
                            id={`item-desc-${index}`}
                            placeholder="Select or type service..."
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            list={`services-list-${index}`}
                          />
                          <datalist id={`services-list-${index}`}>
                            {services.map((service) => (
                              <option key={service.id} value={service.serviceType} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                      {invoiceItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8 text-red-500 hover:text-red-700"
                          onClick={() => removeInvoiceItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor={`item-qty-${index}`}>Qty/Hours</Label>
                        <Input
                          id={`item-qty-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`item-rate-${index}`}>Rate ($)</Label>
                        <Input
                          id={`item-rate-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Subtotal: <span className="font-semibold text-foreground">${(item.quantity * item.rate).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-end pt-4 border-t">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Subtotal</div>
                    <div className="text-2xl font-bold">${invoiceSubtotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid gap-4 pt-4 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="invoiceNotes">Notes (Optional)</Label>
                  <Input 
                    id="invoiceNotes" 
                    placeholder="Additional notes for the client..."
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceTerms">Terms & Conditions</Label>
                  <Input 
                    id="invoiceTerms" 
                    value={invoiceTerms}
                    onChange={(e) => setInvoiceTerms(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetInvoiceForm(); }}>Cancel</Button>
                <Button onClick={() => { setIsCreateDialogOpen(false); resetInvoiceForm(); }}>Create Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(stats.paid)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{formatCurrency(stats.pending)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(stats.overdue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {["all", "paid", "pending", "overdue"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className="flex-1 sm:flex-none min-w-[80px]"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {/* Invoice List (Desktop) */}
        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Invoice</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Client</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Amount</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Issued</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Due Date</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-medium">{invoice.id}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{invoice.clientName}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {formatDate(invoice.issuedDate)}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="p-4">
                        <span className={statusBadgeClass(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {/* BUG #13 FIX: Edit button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Invoice"
                            onClick={() => openEdit(invoice)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button variant="ghost" size="icon" title="Send Reminder">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invoice List (Mobile) */}
        <div className="md:hidden space-y-3">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{invoice.id}</p>
                    <p className="font-semibold mt-1">{invoice.clientName}</p>
                  </div>
                  <span className={`${statusBadgeClass(invoice.status)} flex-shrink-0`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-primary">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued:</span>
                    <span className="font-medium">{formatDate(invoice.issuedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  {/* BUG #13 FIX: Edit button on mobile */}
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(invoice)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {invoice.status !== "paid" && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Remind
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInvoices.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No invoices found.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Invoice Detail Preview */}
        {filteredInvoices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details - {filteredInvoices[0].id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-medium">{filteredInvoices[0].clientName}</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Line Items</h4>
                  <div className="space-y-2">
                    {filteredInvoices[0].items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.description}</span>
                        <span>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(filteredInvoices[0].amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BUG #13 FIX: Edit Invoice Dialog */}
        <Dialog open={!!editInvoice} onOpenChange={(open) => !open && setEditInvoice(null)}>
          <DialogContent className="max-w-md">
            {editInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Invoice {editInvoice.id}</DialogTitle>
                  <DialogDescription>Update invoice details for {editInvoice.clientName}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-amount">Amount ($)</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={editForm.amount ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-due-date">Due Date</Label>
                    <Input
                      id="edit-due-date"
                      type="date"
                      value={editForm.dueDate ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      placeholder="Invoice description"
                      value={editForm.description ?? ""}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editForm.status ?? editInvoice.status}
                      onValueChange={(val) => setEditForm({ ...editForm, status: val as InvoiceStatus })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditInvoice(null)}>Cancel</Button>
                  <Button onClick={saveEdit}>Save Changes</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardPageShell>
  )
}
