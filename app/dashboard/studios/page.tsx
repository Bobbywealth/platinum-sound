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
    Activity,
    Clock,
    Headphones,
    Mic2,
    Music,
    Plus,
    Sliders,
    Users
} from "lucide-react"
import { useState } from "react"

const studios = [
  {
    id: "studio-a",
    name: "Studio A",
    console: "Neve 88R Console",
    type: "Flagship Recording",
    status: "available" as const,
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
  },
  {
    id: "studio-b",
    name: "Studio B",
    console: "SSL 9000K Console",
    type: "Mixing Suite",
    status: "in-session" as const,
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
  },
]

export default function StudiosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <DashboardPageShell className="space-y-8">
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Studios</h1>
          <p className="text-muted-foreground">Manage your world-class recording facilities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Input id="studioName" placeholder="e.g., Studio C" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioConsole">Console</Label>
                <Input id="studioConsole" placeholder="e.g., Neve 8078" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioType">Type</Label>
                <Input id="studioType" placeholder="e.g., Recording, Mixing" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studioEngineer">Primary Engineer</Label>
                <Input id="studioEngineer" placeholder="Engineer name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Add Studio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground/80">Studio Status</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <Card key={studio.id} className="overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    {studio.name}
                  </CardTitle>
                  <Badge variant={studio.status === "available" ? "success" : studio.status === "in-session" ? "info" : "secondary"}>
                    {studio.status === "available" ? "Available" : studio.status === "in-session" ? "In Session" : "Maintenance"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{studio.console} - {studio.type}</p>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
                  <p className="text-2xl font-bold">2</p>
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
