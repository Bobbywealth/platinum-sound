"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { invoices } from "@/lib/data"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Download, Send, DollarSign, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function InvoicesPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredInvoices = filter === "all"
    ? invoices
    : invoices.filter((inv) => inv.status === filter)

  const stats = {
    total: invoices.reduce((acc, inv) => acc + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === "paid").reduce((acc, inv) => acc + inv.amount, 0),
    pending: invoices.filter((inv) => inv.status === "pending").reduce((acc, inv) => acc + inv.amount, 0),
    overdue: invoices.filter((inv) => inv.status === "overdue").reduce((acc, inv) => acc + inv.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Manage billing and payments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
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
      <div className="flex gap-2">
        {["all", "paid", "pending", "overdue"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Invoice List */}
      <Card>
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
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-500/10 text-green-500"
                            : invoice.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
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
    </div>
  )
}
