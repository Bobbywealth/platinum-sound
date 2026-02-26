"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    Activity,
    Clock,
    DollarSign,
    Edit,
    Headphones,
    Info,
    Mic2,
    Music,
    Plus,
    Sliders,
    Users,
} from "lucide-react"
import { useState } from "react"

type StudioStatus = "available" | "in-session" | "maintenance" | "offline"

interface Studio {
  id: string
  name: string
  console: string
  type: string
  status: StudioStatus
  hourlyRate: number
  capacity: number
  features: { icon: React.ElementType; text: string }[]
  equipment: string[]
  currentSession: { artist: string; type: string; startTime: string } | null
  nextBooking: string
  engineer: string
  availability: { day: string; slots: string }[]
}

const initialStudios: Studio[] = [
  {
    id: "studio-a",
    name: "Studio A",
    console: "Neve 88R Console",
    type: "Flagship Recording",
    status: "available",
    hourlyRate: 350,
    capacity: 20,
    features: [
      { icon: Mic2, text: "Large live room with isolation booths" },
      { icon: Headphones, text: "5.1 Surround monitoring" },
      { icon: Sliders, text: "Vintage outboard gear collection" },
    ],
    equipment: [
      "Neve 88R Console (72-channel)",
      "SSL 9000K J Series",
      "Pro Tools HDX System",
      "Universal Audio Apollo x16",
      "Neumann U47, U67, C12 Mics",
      "Manley, SSL, Neve Preamps",
    ],
    currentSession: null,
    nextBooking: "2:00 PM - Drake",
    engineer: "Noel Cadastre",
    availability: [
      { day: "Monday", slots: "10:00 AM – 6:00 PM" },
      { day: "Tuesday", slots: "10:00 AM – 10:00 PM" },
      { day: "Wednesday", slots: "12:00 PM – 8:00 PM" },
      { day: "Thursday", slots: "10:00 AM – 6:00 PM" },
      { day: "Friday", slots: "2:00 PM – 12:00 AM" },
      { day: "Saturday", slots: "12:00 PM – 12:00 AM" },
      { day: "Sunday", slots: "Closed" },
    ],
  },
  {
    id: "studio-b",
    name: "Studio B",
    console: "SSL 9000K Console",
    type: "Mixing Suite",
    status: "in-session",
    hourlyRate: 275,
    capacity: 10,
    features: [
      { icon: Mic2, text: "Dedicated vocal booth" },
      { icon: Headphones, text: "Stereo & surround monitoring" },
      { icon: Sliders, text: "Full Pro Tools HDX system" },
    ],
    equipment: [
      "SSL 9000K Console (64-channel)",
      "Avid S6 Control Surface",
      "Pro Tools HDX System",
      "B&W 802 D4 Monitors",
      "Dangerous Music D-G EQ",
      "Manley Massive Passive",
    ],
    currentSession: {
      artist: "Rihanna",
      type: "Recording",
      startTime: "10:00 AM",
    },
    nextBooking: "6:00 PM - A$AP Rocky",
    engineer: "Young Guru",
    availability: [
      { day: "Monday", slots: "9:00 AM – 9:00 PM" },
      { day: "Tuesday", slots: "9:00 AM – 9:00 PM" },
      { day: "Wednesday", slots: "9:00 AM – 9:00 PM" },
      { day: "Thursday", slots: "9:00 AM – 9:00 PM" },
      { day: "Friday", slots: "9:00 AM – 3:00 AM" },
      { day: "Saturday", slots: "10:00 AM – 3:00 AM" },
      { day: "Sunday", slots: "12:00 PM – 10:00 PM" },
    ],
  },
]

const STATUS_CONFIG: Record<StudioStatus, { label: string; variant: "success" | "info" | "warning" | "secondary" }> = {
  "available": { label: "Available", variant: "success" },
  "in-session": { label: "In Session", variant: "info" },
  "maintenance": { label: "Maintenance", variant: "warning" },
  "offline": { label: "Offline", variant: "secondary" },
}

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>(initialStudios)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [detailStudio, setDetailStudio] = useState<Studio | null>(null)
  const [editStudio, setEditStudio] = useState<Studio | null>(null)
  const [editForm, setEditForm] = useState<Partial<Studio>>({})

  // New studio form state
  const [newStudio, setNewStudio] = useState({ name: "", console: "", type: "", engineer: "" })

  function openDetail(studio: Studio) {
    setDetailStudio(studio)
  }

  function openEdit(studio: Studio, e: React.MouseEvent) {
    e.stopPropagation()
    setEditStudio(studio)
    setEditForm({
      name: studio.name,
      console: studio.console,
      type: studio.type,
      hourlyRate: studio.hourlyRate,
      status: studio.status,
      equipment: studio.equipment,
      engineer: studio.engineer,
    })
  }

  function saveEdit() {
    if (!editStudio) return
    setStudios((prev) =>
      prev.map((s) =>
        s.id === editStudio.id
          ? {
              ...s,
              name: editForm.name ?? s.name,
              console: editForm.console ?? s.console,
              type: editForm.type ?? s.type,
              hourlyRate: editForm.hourlyRate ?? s.hourlyRate,
              status: editForm.status ?? s.status,
              equipment: editForm.equipment ?? s.equipment,
              engineer: editForm.engineer ?? s.engineer,
            }
          : s
      )
    )
    setEditStudio(null)
  }

  function changeStatus(studioId: string, newStatus: StudioStatus) {
    setStudios((prev) =>
      prev.map((s) => (s.id === studioId ? { ...s, status: newStatus } : s))
    )
  }

  return (
    <DashboardPageShell className="space-y-8">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studios</h1>
          <p className="text-muted-foreground">Manage your world-class recording facilities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Studio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Studio</DialogTitle>
              <DialogDescription>Add a new recording studio to your facility</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="studioName">Studio Name</Label>
                <Input
                  id="studioName"
                  placeholder="e.g., Studio C"
                  value={newStudio.name}
                  onChange={(e) => setNewStudio({ ...newStudio, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioConsole">Console</Label>
                <Input
                  id="studioConsole"
                  placeholder="e.g., Neve 8078"
                  value={newStudio.console}
                  onChange={(e) => setNewStudio({ ...newStudio, console: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioType">Type</Label>
                <Input
                  id="studioType"
                  placeholder="e.g., Recording, Mixing"
                  value={newStudio.type}
                  onChange={(e) => setNewStudio({ ...newStudio, type: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioEngineer">Primary Engineer</Label>
                <Input
                  id="studioEngineer"
                  placeholder="Engineer name"
                  value={newStudio.engineer}
                  onChange={(e) => setNewStudio({ ...newStudio, engineer: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (newStudio.name) {
                    const id = `studio-${Date.now()}`
                    setStudios((prev) => [
                      ...prev,
                      {
                        id,
                        name: newStudio.name,
                        console: newStudio.console || "TBD",
                        type: newStudio.type || "Recording",
                        status: "available",
                        hourlyRate: 200,
                        capacity: 8,
                        features: [],
                        equipment: [],
                        currentSession: null,
                        nextBooking: "None",
                        engineer: newStudio.engineer || "TBD",
                        availability: [],
                      },
                    ])
                    setNewStudio({ name: "", console: "", type: "", engineer: "" })
                  }
                  setIsAddDialogOpen(false)
                }}
              >
                Add Studio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground/80">Studio Status</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <Card
              key={studio.id}
              className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
              onClick={() => openDetail(studio)}
            >
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    {studio.name}
                  </CardTitle>
                  {/* BUG #9 FIX: Clickable status dropdown */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={studio.status}
                      onValueChange={(val) => changeStatus(studio.id, val as StudioStatus)}
                    >
                      <SelectTrigger className="w-auto h-auto border-0 p-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:hidden gap-0">
                        <Badge variant={STATUS_CONFIG[studio.status].variant} className="cursor-pointer">
                          {STATUS_CONFIG[studio.status].label}
                          <svg className="ml-1 h-3 w-3 opacity-60" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-session">In Session</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{studio.console} - {studio.type}</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {studio.currentSession && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Session</span>
                      <Badge variant="outline">{studio.currentSession.type}</Badge>
                    </div>
                    <p className="font-semibold">{studio.currentSession.artist}</p>
                    <p className="text-sm text-muted-foreground">Since {studio.currentSession.startTime}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Booking</span>
                  <span className="font-medium">{studio.nextBooking}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Engineer</span>
                  <span className="font-medium">{studio.engineer}</span>
                </div>
                <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => { e.stopPropagation(); openDetail(studio) }}
                  >
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => openEdit(studio, e)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* BUG #11 FIX: Studio Detail Modal */}
      <Dialog open={!!detailStudio} onOpenChange={(open) => !open && setDetailStudio(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailStudio && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Music className="h-5 w-5" />
                  {detailStudio.name}
                  <Badge variant={STATUS_CONFIG[detailStudio.status].variant} className="ml-2">
                    {STATUS_CONFIG[detailStudio.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {detailStudio.console} · {detailStudio.type}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-2">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="p-3 bg-muted/40 rounded-lg text-center">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-lg font-bold">${detailStudio.hourlyRate}/hr</p>
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-lg font-bold">{detailStudio.capacity}</p>
                    <p className="text-xs text-muted-foreground">Max Capacity</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg text-center col-span-2 sm:col-span-1">
                    <Music className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-sm font-bold truncate">{detailStudio.engineer}</p>
                    <p className="text-xs text-muted-foreground">Lead Engineer</p>
                  </div>
                </div>

                {/* Current Session */}
                {detailStudio.currentSession ? (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-400">Current Session</span>
                      <Badge variant="info">{detailStudio.currentSession.type}</Badge>
                    </div>
                    <p className="font-semibold">{detailStudio.currentSession.artist}</p>
                    <p className="text-sm text-muted-foreground">Started at {detailStudio.currentSession.startTime}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-green-500">No Active Session</p>
                    <p className="text-sm text-muted-foreground mt-1">Next booking: {detailStudio.nextBooking}</p>
                  </div>
                )}

                {/* Equipment List */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    Equipment
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {detailStudio.equipment.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {detailStudio.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Headphones className="h-4 w-4" />
                      Features
                    </h3>
                    <div className="space-y-2">
                      {detailStudio.features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                          <div>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            {feature.text}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Availability Schedule */}
                {detailStudio.availability.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Weekly Availability
                    </h3>
                    <div className="space-y-1.5">
                      {detailStudio.availability.map((slot, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground w-28">{slot.day}</span>
                          <span className={`font-medium ${slot.slots === "Closed" ? "text-red-400" : ""}`}>
                            {slot.slots}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailStudio(null)}>Close</Button>
                <Button onClick={(e) => { setDetailStudio(null); openEdit(detailStudio, e as React.MouseEvent) }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Studio
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* BUG #10b FIX: Studio Edit Modal */}
      <Dialog open={!!editStudio} onOpenChange={(open) => !open && setEditStudio(null)}>
        <DialogContent className="max-w-lg">
          {editStudio && (
            <>
              <DialogHeader>
                <DialogTitle>Edit {editStudio.name}</DialogTitle>
                <DialogDescription>Update studio details and configuration</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Studio Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-console">Console</Label>
                  <Input
                    id="edit-console"
                    value={editForm.console ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, console: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Input
                    id="edit-type"
                    value={editForm.type ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rate">Hourly Rate ($)</Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    value={editForm.hourlyRate ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-engineer">Primary Engineer</Label>
                  <Input
                    id="edit-engineer"
                    value={editForm.engineer ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, engineer: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editForm.status ?? editStudio.status}
                    onValueChange={(val) => setEditForm({ ...editForm, status: val as StudioStatus })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-session">In Session</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-equipment">Equipment (one per line)</Label>
                  <textarea
                    id="edit-equipment"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    value={(editForm.equipment ?? []).join("\n")}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        equipment: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditStudio(null)}>Cancel</Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground/80">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {studios.filter((s) => s.status === "available" || s.status === "in-session").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Studios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Engineers On Duty</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Music className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Sessions This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  )
}
