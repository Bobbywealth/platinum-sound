"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { invoices as initialInvoices } from "@/lib/data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Download, Send, DollarSign, Clock, AlertTriangle, CheckCircle, Pencil } from "lucide-react"
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
  const [invoiceList, setInvoiceList] = useState<Invoice[]>(initialInvoices as Invoice[])
  const [filter, setFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null)
  const [editForm, setEditForm] = useState<Partial<Invoice>>({})

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
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Create a new invoice for a client</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoiceClient">Client</Label>
                  <Input id="invoiceClient" placeholder="Select client" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoiceAmount">Amount</Label>
                  <Input id="invoiceAmount" type="number" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Service description" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Invoice</Button>
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
