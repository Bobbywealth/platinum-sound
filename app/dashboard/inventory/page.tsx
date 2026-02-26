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

const inventoryItems: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Neumann TLM 103",
    category: "Microphones",
    stock: 4,
    reorderPoint: 2,
    status: "in-stock",
    location: "Mic Locker",
    nextRestock: "—",
    onOrder: false,
  },
  {
    id: "INV-002",
    name: "Shure SM7B",
    category: "Microphones",
    stock: 1,
    reorderPoint: 2,
    status: "low-stock",
    location: "Studio B",
    nextRestock: "Oct 12, 2024",
    onOrder: true,
  },
  {
    id: "INV-003",
    name: "Audio Interface Cables",
    category: "Accessories",
    stock: 0,
    reorderPoint: 6,
    status: "out-of-stock",
    location: "Supply Room",
    nextRestock: "Oct 08, 2024",
    onOrder: true,
  },
  {
    id: "INV-004",
    name: "Sony MDR-7506",
    category: "Headphones",
    stock: 12,
    reorderPoint: 6,
    status: "in-stock",
    location: "Studio A",
    nextRestock: "—",
    onOrder: false,
  },
  {
    id: "INV-005",
    name: "XLR Cables (20ft)",
    category: "Cables",
    stock: 3,
    reorderPoint: 10,
    status: "low-stock",
    location: "Supply Room",
    nextRestock: "Oct 15, 2024",
    onOrder: true,
  },
]

const statusStyles: Record<InventoryStatus, string> = {
  "in-stock": "bg-green-100 text-green-700",
  "low-stock": "bg-yellow-100 text-yellow-800",
  "out-of-stock": "bg-red-100 text-red-700",
}

export default function InventoryPage() {
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
            {inventoryItems.map((item) => (
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
