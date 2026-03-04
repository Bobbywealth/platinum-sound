"use client"

import { useState, useEffect } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Plus, Edit, Trash2, DollarSign, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Room = {
  id: string
  name: string
  description: string | null
  baseRate: number
  rateWithEngineer: number
  rateWithoutEngineer: number
  amenities: string[] | null
  images: string[] | null
  status: string
  createdAt: string
}

const AMENITIES_OPTIONS = [
  "SSL Console",
  "Neve Console",
  "Pro Tools",
  "Logic Pro",
  "Live Room",
  "Vocal Booth",
  "Guitar Amps",
  "Drum Kit",
  "Piano",
  "WiFi",
  "Parking",
  "Lounge",
]

export default function StudiosPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseRate: "",
    rateWithEngineer: "",
    rateWithoutEngineer: "",
    amenities: [] as string[],
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/rooms?includeUnavailable=true')
      if (res.ok) {
        const data = await res.json()
        setRooms(data)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateDialog() {
    setEditingRoom(null)
    setFormData({
      name: "",
      description: "",
      baseRate: "",
      rateWithEngineer: "",
      rateWithoutEngineer: "",
      amenities: [],
    })
    setIsCreateDialogOpen(true)
  }

  function openEditDialog(room: Room) {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      description: room.description || "",
      baseRate: room.baseRate.toString(),
      rateWithEngineer: room.rateWithEngineer?.toString() || "",
      rateWithoutEngineer: room.rateWithoutEngineer?.toString() || "",
      amenities: room.amenities || [],
    })
    setIsCreateDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        baseRate: parseFloat(formData.baseRate) || 0,
        rateWithEngineer: parseFloat(formData.rateWithEngineer) || null,
        rateWithoutEngineer: parseFloat(formData.rateWithoutEngineer) || null,
        amenities: formData.amenities.length > 0 ? formData.amenities : null,
        images: null,
      }

      const url = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms'
      const method = editingRoom ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({ title: editingRoom ? 'Studio updated' : 'Studio created' })
        fetchRooms()
        setIsCreateDialogOpen(false)
      } else {
        toast({ title: 'Failed to save studio', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error saving room:', error)
      toast({ title: 'Failed to save studio', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(room: Room) {
    if (!confirm(`Are you sure you want to delete "${room.name}"?`)) return

    try {
      const response = await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Studio deleted' })
        fetchRooms()
      } else {
        toast({ title: 'Failed to delete studio', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      toast({ title: 'Failed to delete studio', variant: 'destructive' })
    }
  }

  function toggleAmenity(amenity: string) {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
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
    <DashboardPageShell className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Studios
          </h1>
          <p className="text-muted-foreground">Manage your recording studios</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Studio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingRoom ? 'Edit Studio' : 'Add New Studio'}</DialogTitle>
                <DialogDescription>
                  {editingRoom ? 'Update the studio details below.' : 'Enter the details for your new recording studio.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Studio Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Studio A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the studio..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="baseRate">Base Rate ($)</Label>
                    <Input
                      id="baseRate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rateWithEngineer">With Engineer</Label>
                    <Input
                      id="rateWithEngineer"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.rateWithEngineer}
                      onChange={(e) => setFormData({ ...formData, rateWithEngineer: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rateWithoutEngineer">Without Engineer</Label>
                    <Input
                      id="rateWithoutEngineer"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.rateWithoutEngineer}
                      onChange={(e) => setFormData({ ...formData, rateWithoutEngineer: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_OPTIONS.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.amenities.includes(amenity)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingRoom ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No studios yet. Click "Add Studio" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{room.description || 'No description'}</p>
                  </div>
                  <Badge variant={room.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                    {room.status === 'AVAILABLE' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Available</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Unavailable</>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${room.baseRate}/hr</span>
                  </div>
                  {room.rateWithEngineer && (
                    <span className="text-muted-foreground">+${room.rateWithEngineer}/hr w/ engineer</span>
                  )}
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.amenities.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(room)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(room)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
