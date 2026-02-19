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
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
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

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">Reorder reminders</p>
              <p className="text-yellow-800">
                Review low or out-of-stock items weekly to avoid session disruptions.
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="mt-6 overflow-hidden rounded-lg border bg-white hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <span className="sm:hidden">Restock</span>
                    <span className="hidden sm:inline">Next Restock</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <p className="text-xs text-muted-foreground">{item.id}</p>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.stock}</div>
                      <p className="text-xs text-muted-foreground">
                        Reorder at {item.reorderPoint}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[item.status]}>
                        {item.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.nextRestock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="mt-6 md:hidden space-y-3">
            {inventoryItems.map((item) => (
              <div key={item.id} className="p-4 rounded-lg border bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.id}</p>
                  </div>
                  <Badge className={statusStyles[item.status]}>
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Stock</p>
                    <p className="font-medium">
                      {item.stock} <span className="text-xs text-muted-foreground">(reorder at {item.reorderPoint})</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Next Restock</p>
                    <p className="font-medium">{item.nextRestock}</p>
                  </div>
                </div>

                {item.onOrder && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-blue-600">
                    <Truck className="h-4 w-4" />
                    <span>On Order</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
