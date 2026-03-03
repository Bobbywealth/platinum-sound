"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Expense = { id: string; category: string; description: string; amount: number; date: string }

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    fetch('/api/expenses').then(r => (r.ok ? r.json() : [])).then(setExpenses)
  }, [])

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses])

  return (
    <DashboardPageShell className="space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>
      <Card><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent>${total.toLocaleString()}</CardContent></Card>
      <Card><CardHeader><CardTitle>Expense Entries</CardTitle></CardHeader><CardContent>{expenses.length === 0 ? 'No expenses yet.' : expenses.map(e => <p key={e.id}>{new Date(e.date).toLocaleDateString()} • {e.category} • ${e.amount.toLocaleString()} • {e.description}</p>)}</CardContent></Card>
    </DashboardPageShell>
  )
}
