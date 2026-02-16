"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveTableShell } from '@/components/ui/responsive-table-shell'
import { ClipboardList, Plus, Search, AlertCircle, CheckCircle, Clock, User, PenLine } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { DigitalSignaturePad } from '@/components/digital-signature-pad'

interface WorkOrder {
  id: string
  title: string
  description?: string
  priority: string
  status: string
  assignedEngineer?: {
    id: string
    name: string
    email: string
  }
  createdBy: string
  createdAt: Date
  completedAt?: Date
  signatures: {
    id: string
    signerName: string
    signerRole: string
    signedAt: Date
  }[]
}

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
}

const statusConfig = {
  OPEN: { label: 'Open', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
}

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [engineers, setEngineers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [signingWorkOrder, setSigningWorkOrder] = useState<WorkOrder | null>(null)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignedEngineerId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [workOrdersRes, engineersRes] = await Promise.all([
        fetch('/api/work-orders'),
        fetch('/api/engineers'),
      ])

      if (workOrdersRes.ok) {
        const data = await workOrdersRes.json()
        setWorkOrders(data.map((wo: any) => ({
          ...wo,
          createdAt: new Date(wo.createdAt),
          completedAt: wo.completedAt ? new Date(wo.completedAt) : undefined,
        })))
      }

      if (engineersRes.ok) {
        setEngineers(await engineersRes.json())
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWorkOrder = async () => {
    if (!newWorkOrder.title) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkOrder),
      })

      if (res.ok) {
        toast({
          title: 'Work order created',
          description: 'The work order has been created and notifications sent.',
        })
        setIsCreateDialogOpen(false)
        setNewWorkOrder({
          title: '',
          description: '',
          priority: 'MEDIUM',
          assignedEngineerId: '',
        })
        fetchData()
      } else {
        throw new Error('Failed to create work order')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create work order',
        variant: 'destructive',
      })
    }
  }

  const handleSignWorkOrder = async () => {
    if (!signingWorkOrder || !signatureData) {
      toast({
        title: 'Error',
        description: 'Please provide a signature',
        variant: 'destructive',
      })
      return
    }

    try {
      const res = await fetch(`/api/work-orders/${signingWorkOrder.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureData }),
      })

      if (res.ok) {
        toast({
          title: 'Work order signed',
          description: 'Your signature has been recorded.',
        })
        setSigningWorkOrder(null)
        setSignatureData(null)
        fetchData()
      } else {
        throw new Error('Failed to sign work order')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign work order',
        variant: 'destructive',
      })
    }
  }

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardPageShell>
      {/* Header */}
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            Work Orders
          </h1>
          <p className="text-muted-foreground">
            Create and manage work orders for equipment and maintenance
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Work Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Work Order</DialogTitle>
              <DialogDescription>
                Create a new work order. Notifications will be sent to the assigned engineer and finance manager.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newWorkOrder.title}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, title: e.target.value })}
                  placeholder="Brief description of the work needed"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newWorkOrder.description}
                  onChange={(e) => setNewWorkOrder({ ...newWorkOrder, description: e.target.value })}
                  placeholder="Detailed description of the work order"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newWorkOrder.priority}
                    onValueChange={(value) => setNewWorkOrder({ ...newWorkOrder, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Assign to Engineer</Label>
                  <Select
                    value={newWorkOrder.assignedEngineerId}
                    onValueChange={(value) => setNewWorkOrder({ ...newWorkOrder, assignedEngineerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineers.map(eng => (
                        <SelectItem key={eng.id} value={eng.id}>
                          {eng.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkOrder}>
                Create Work Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <Card>
        <CardContent className="p-0">
          <ResponsiveTableShell tableMinWidthClassName="min-w-[860px]" stickyFirstColumn>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sm:hidden">Assignee</span>
                  <span className="hidden sm:inline">Assigned To</span>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead>
                  <span className="sm:hidden">Signs</span>
                  <span className="hidden sm:inline">Signatures</span>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredWorkOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No work orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkOrders.map(wo => (
                  <TableRow key={wo.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{wo.title}</p>
                        {wo.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {wo.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[wo.priority as keyof typeof priorityConfig]?.color}>
                        {priorityConfig[wo.priority as keyof typeof priorityConfig]?.label || wo.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[wo.status as keyof typeof statusConfig]?.color}>
                        {statusConfig[wo.status as keyof typeof statusConfig]?.label || wo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {wo.assignedEngineer ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {wo.assignedEngineer.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(wo.createdAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {wo.signatures.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <PenLine className="h-4 w-4 text-green-600" />
                          <span>{wo.signatures.length}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {wo.status !== 'COMPLETED' && wo.status !== 'CANCELLED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSigningWorkOrder(wo)}
                        >
                          <PenLine className="h-4 w-4 mr-1" />
                          Sign
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </ResponsiveTableShell>
        </CardContent>
      </Card>

      {/* Sign Work Order Dialog */}
      <Dialog open={!!signingWorkOrder} onOpenChange={() => setSigningWorkOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sign Work Order</DialogTitle>
            <DialogDescription>
              Please sign to acknowledge completion of this work order.
            </DialogDescription>
          </DialogHeader>
          
          {signingWorkOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">{signingWorkOrder.title}</h4>
                {signingWorkOrder.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {signingWorkOrder.description}
                  </p>
                )}
              </div>
              
              <DigitalSignaturePad
                onSignatureChange={setSignatureData}
                width={400}
                height={150}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSigningWorkOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleSignWorkOrder} disabled={!signatureData}>
              Submit Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  )
}
