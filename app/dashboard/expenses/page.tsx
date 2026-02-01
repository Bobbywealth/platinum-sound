"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Utensils,
  Zap,
  Hammer,
  Plus,
} from "lucide-react"

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
  Equipment: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  Utilities: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
  Maintenance: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  Other: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
}

export default function ExpensesPage() {
  const [summary] = useState<ExpenseSummary>(mockSummary)
  const [expenses] = useState<Expense[]>(mockExpenses)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Track and manage studio expenses
          </p>
        </div>
        <Button>
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
              {((summary.equipmentCosts / summary.totalExpenses) * 100).toFixed(0)}% of total
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
              {((summary.utilitiesCosts / summary.totalExpenses) * 100).toFixed(0)}% of total
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
              {((summary.maintenanceCosts / summary.totalExpenses) * 100).toFixed(0)}% of total
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
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.vendor} - {expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {expense.category}
                    </span>
                    <span className="font-semibold">{formatCurrency(expense.amount)}</span>
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
                const percentage = (amount / summary.totalExpenses) * 100
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
    </div>
  )
}
