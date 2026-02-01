import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic2,
  Headphones,
  Sliders,
  Music,
  Clock,
  Users,
  Activity,
  Settings,
  Plus,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Studios",
  description: "Manage Platinum Sound recording studios",
}

const studios = [
  {
    id: "studio-a",
    name: "Studio A",
    console: "Neve 88R Console",
    type: "Flagship Recording",
    status: "available",
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
    status: "in-session",
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Studios</h1>
          <p className="text-muted-foreground">
            Manage your world-class recording facilities
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Studio
        </Button>
      </div>

      {/* Studio Status Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        {studios.map((studio) => (
          <Card key={studio.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{studio.name}</CardTitle>
                <Badge
                  variant={
                    studio.status === "available"
                      ? "success"
                      : studio.status === "in-session"
                      ? "info"
                      : "secondary"
                  }
                >
                  {studio.status === "available" ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      In Session
                    </span>
                  ) : studio.status === "in-session" ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      In Session
                    </span>
                  ) : (
                    "Maintenance"
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {studio.console} • {studio.type}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Session */}
              {studio.currentSession && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Session</span>
                    <Badge variant="outline">{studio.currentSession.type}</Badge>
                  </div>
                  <p className="font-semibold">{studio.currentSession.artist}</p>
                  <p className="text-sm text-muted-foreground">
                    Since {studio.currentSession.startTime}
                  </p>
                </div>
              )}

              {/* Next Booking */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Booking</span>
                <span className="font-medium">{studio.nextBooking}</span>
              </div>

              {/* Engineer */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Engineer</span>
                <span className="font-medium">{studio.engineer}</span>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Activity className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Studio Information */}
      <Tabs defaultValue="studio-a" className="space-y-4">
        <TabsList>
          <TabsTrigger value="studio-a">Studio A Details</TabsTrigger>
          <TabsTrigger value="studio-b">Studio B Details</TabsTrigger>
        </TabsList>

        {studios.map((studio) => (
          <TabsContent key={studio.id} value={studio.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {studio.name} - Equipment & Features
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-muted-foreground" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {studio.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <feature.icon className="h-4 w-4 text-primary" />
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment List */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-muted-foreground" />
                    Equipment
                  </h4>
                  <ul className="space-y-1">
                    {studio.equipment.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Active Studios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Engineers On Duty</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Sessions This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
