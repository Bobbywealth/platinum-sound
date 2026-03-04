"use client"

import { useState, useEffect } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mic2, Music2, Pencil, Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Service {
  id: string
  serviceType: string
  description: string | null
  basePrice: number
  sessionMode: string
  isActive: boolean
}

const SESSION_MODES = [
  { value: 'RECORDING', label: 'Recording' },
  { value: 'MIXING', label: 'Mixing' },
  { value: 'MASTERING', label: 'Mastering' },
  { value: 'PRODUCTION', label: 'Production' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    basePrice: "",
    sessionMode: "RECORDING",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingService(null)
    setFormData({
      serviceType: "",
      description: "",
      basePrice: "",
      sessionMode: "RECORDING",
    })
    setIsDialogOpen(true)
  }

  function openEditDialog(service: Service) {
    setEditingService(service)
    setFormData({
      serviceType: service.serviceType,
      description: service.description || "",
      basePrice: service.basePrice?.toString() || "",
      sessionMode: service.sessionMode,
    })
    setIsDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({ title: editingService ? 'Service updated' : 'Service created' })
        fetchServices()
        setIsDialogOpen(false)
      } else {
        toast({ title: 'Failed to save service', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error saving service:', error)
      toast({ title: 'Failed to save service', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(service: Service) {
    if (!confirm(`Delete "${service.serviceType}"?`)) return

    try {
      const res = await fetch(`/api/services/${service.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Service deleted' })
        fetchServices()
      } else {
        toast({ title: 'Failed to delete service', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast({ title: 'Failed to delete service', variant: 'destructive' })
    }
  }

  if (isLoading) {
    return (
      <DashboardPageShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardPageShell>
    )
  }

  return (
    <DashboardPageShell>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your studio services</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update the service details.' : 'Enter the details for your new service.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Input
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="e.g., Recording, Mixing"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sessionMode">Session Mode</Label>
                <Select
                  value={formData.sessionMode}
                  onValueChange={(value) => setFormData({ ...formData, sessionMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the service..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingService ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No services yet. Click "Add Service" to create one.</p>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {service.sessionMode === 'MIXING' || service.sessionMode === 'MASTERING' ? (
                        <Music2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Mic2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.serviceType}</h3>
                      <p className="text-sm text-muted-foreground">
                        {service.basePrice ? `$${service.basePrice}/hr` : 'Price on request'}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{service.description || 'No description'}</p>
                <p className="text-xs text-muted-foreground mb-4">{service.sessionMode}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(service)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardPageShell>
  )
}
