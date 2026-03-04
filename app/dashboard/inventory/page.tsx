"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveTableShell } from "@/components/ui/responsive-table-shell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertTriangle, Archive, Package, Plus, Truck } from "lucide-react"
import { useState } from "react"

type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock"

interface InventoryItem {
  id: string
  name: string
  category: string
  stock: number
  reorderPoint: number
  status: InventoryStatus
  location: string
  nextRestock: string
  onOrder: boolean
}

const statusStyles: Record<InventoryStatus, string> = {
  "in-stock": "bg-green-100 text-green-700",
  "low-stock": "bg-yellow-100 text-yellow-800",
  "out-of-stock": "bg-red-100 text-red-700",
}

export default function InventoryPage() {
  const [inventoryItems] = useState<InventoryItem[]>([])
  const totalItems = inventoryItems.length
  const lowStockCount = inventoryItems.filter((item) => item.status === "low-stock").length
  const outOfStockCount = inventoryItems.filter((item) => item.status === "out-of-stock").length
  const onOrderCount = inventoryItems.filter((item) => item.onOrder).length

  return (
    <DashboardPageShell className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track studio gear, supplies, and reorder needs.
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-semibold">{totalItems}</p>
            </div>
            <Package className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-semibold">{lowStockCount}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-semibold">{outOfStockCount}</p>
            </div>
            <Archive className="h-6 w-6 text-red-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">On Order</p>
              <p className="text-2xl font-semibold">{onOrderCount}</p>
            </div>
            <Truck className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      <ResponsiveTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Next Restock</TableHead>
              <TableHead>On Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No inventory items yet.
                </TableCell>
              </TableRow>
            ) : inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Badge className={statusStyles[item.status]}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.nextRestock}</TableCell>
                <TableCell>{item.onOrder ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ResponsiveTableShell>
    </DashboardPageShell>
  )
}
