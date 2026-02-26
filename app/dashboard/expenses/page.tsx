"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatCurrency } from "@/lib/utils"
import {
  DollarSign,
  Hammer,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useState } from "react"

interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  vendor: string
}

interface ExpenseSummary {
  totalExpenses: number
  expensesChange: number
  equipmentCosts: number
  utilitiesCosts: number
  maintenanceCosts: number
  otherCosts: number
}

const mockExpenses: Expense[] = [
  { id: "1", category: "Equipment", description: "Microphone purchase", amount: 2500, date: "2024-01-15", vendor: "Sweetwater" },
  { id: "2", category: "Utilities", description: "Monthly electricity", amount: 850, date: "2024-01-10", vendor: "Con Edison" },
  { id: "3", category: "Maintenance", description: "HVAC repair", amount: 1200, date: "2024-01-08", vendor: "NYC HVAC Services" },
  { id: "4", category: "Equipment", description: "Cable supplies", amount: 350, date: "2024-01-05", vendor: "B&H Photo" },
  { id: "5", category: "Other", description: "Office supplies", amount: 125, date: "2024-01-03", vendor: "Staples" },
  { id: "6", category: "Maintenance", description: "Equipment calibration", amount: 500, date: "2024-01-02", vendor: "Pro Audio" },
]

const mockSummary: ExpenseSummary = {
  totalExpenses: 5525,
  expensesChange: -8.5,
  equipmentCosts: 2850,
  utilitiesCosts: 850,
  maintenanceCosts: 1700,
  otherCosts: 125,
}

const categoryIcons: Record<string, React.ElementType> = {
  Equipment: Hammer,
  Utilities: Zap,
  Maintenance: Hammer,
  Other: Receipt,
}

const categoryColors: Record<string, string> = {
  Equipment: "bg-royal/20 text-royal dark:bg-royal/30 dark:text-royal-foreground",
  Utilities: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
  Maintenance: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  Other: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
}

const emptyForm = {
  description: "",
  amount: "",
  category: "Equipment" as string,
  date: new Date().toISOString().split("T")[0],
  vendor: "",
}

/** Recalculate summary totals from the current expense list. */
function computeSummary(expenses: Expense[], base: ExpenseSummary): ExpenseSummary {
  const equipment = expenses.filter((e) => e.category === "Equipment").reduce((s, e) => s + e.amount, 0)
  const utilities = expenses.filter((e) => e.category === "Utilities").reduce((s, e) => s + e.amount, 0)
  const maintenance = expenses.filter((e) => e.category === "Maintenance").reduce((s, e) => s + e.amount, 0)
  const other = expenses.filter((e) => e.category === "Other").reduce((s, e) => s + e.amount, 0)
  const total = equipment + utilities + maintenance + other
  return {
    ...base,
    totalExpenses: total,
    equipmentCosts: equipment,
    utilitiesCosts: utilities,
    maintenanceCosts: maintenance,
    otherCosts: other,
  }
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [summary, setSummary] = useState<ExpenseSummary>(mockSummary)

  // Add Expense modal state
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ ...emptyForm })

  function openAddModal() {
    setAddForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })
    setAddOpen(true)
  }

  function handleAddSubmit() {
    const parsedAmount = parseFloat(addForm.amount)
    if (!addForm.description.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: addForm.description.trim(),
      amount: parsedAmount,
      category: addForm.category,
      date: addForm.date,
      vendor: addForm.vendor.trim() || "—",
    }

    const updated = [newExpense, ...expenses]
    setExpenses(updated)
    setSummary(computeSummary(updated, summary))
    setAddOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage studio expenses
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                summary.expensesChange >= 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {summary.expensesChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(summary.expensesChange)}% from last month
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.equipmentCosts)}</div>
            <span className="text-xs text-muted-foreground">
              {summary.totalExpenses > 0
                ? ((summary.equipmentCosts / summary.totalExpenses) * 100).toFixed(0)
                : 0}% of total
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilities</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.utilitiesCosts)}</div>
            <span className="text-xs text-muted-foreground">
              {summary.totalExpenses > 0
                ? ((summary.utilitiesCosts / summary.totalExpenses) * 100).toFixed(0)
                : 0}% of total
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Hammer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.maintenanceCosts)}</div>
            <span className="text-xs text-muted-foreground">
              {summary.totalExpenses > 0
                ? ((summary.maintenanceCosts / summary.totalExpenses) * 100).toFixed(0)
                : 0}% of total
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => {
              const Icon = categoryIcons[expense.category] || Receipt
              const colorClass = categoryColors[expense.category] || categoryColors.Other

              return (
                <div
                  key={expense.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{expense.description}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {expense.vendor} - {expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                      {expense.category}
                    </span>
                    <span className="font-semibold flex-shrink-0">{formatCurrency(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries({
                Equipment: summary.equipmentCosts,
                Utilities: summary.utilitiesCosts,
                Maintenance: summary.maintenanceCosts,
                Other: summary.otherCosts,
              }).map(([category, amount]) => {
                const percentage = summary.totalExpenses > 0 ? (amount / summary.totalExpenses) * 100 : 0
                const Icon = categoryIcons[category] || Receipt
                const colorClass = categoryColors[category] || categoryColors.Other

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${colorClass}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(amount)} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg. Daily Expense</span>
              <span className="font-medium">{formatCurrency(summary.totalExpenses / 30)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Highest Category</span>
              <span className="font-medium">Equipment</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">This Month vs Last</span>
              <span className="font-medium text-green-500">
                {formatCurrency(summary.totalExpenses * 0.085)} less
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending Approvals</span>
              <span className="font-medium">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Add Expense Modal ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Record a new studio expense.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exp-description">Description <span className="text-destructive">*</span></Label>
              <Input
                id="exp-description"
                placeholder="e.g. Studio monitor repair"
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-amount">Amount ($) <span className="text-destructive">*</span></Label>
              <Input
                id="exp-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={addForm.amount}
                onChange={(e) => setAddForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-category">Category <span className="text-destructive">*</span></Label>
              <Select
                value={addForm.category}
                onValueChange={(val) => setAddForm((f) => ({ ...f, category: val }))}
              >
                <SelectTrigger id="exp-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-date">Date <span className="text-destructive">*</span></Label>
              <Input
                id="exp-date"
                type="date"
                value={addForm.date}
                onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp-vendor">Vendor</Label>
              <Input
                id="exp-vendor"
                placeholder="e.g. Sweetwater"
                value={addForm.vendor}
                onChange={(e) => setAddForm((f) => ({ ...f, vendor: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSubmit}
              disabled={
                !addForm.description.trim() ||
                !addForm.amount ||
                isNaN(parseFloat(addForm.amount)) ||
                parseFloat(addForm.amount) <= 0
              }
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
