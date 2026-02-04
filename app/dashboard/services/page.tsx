"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic2, Music2, Pencil, Plus } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: string
  icon: React.ElementType
}

const services: Service[] = [
  {
    id: "1",
    name: "Recording",
    description: "Professional audio recording with state-of-the-art equipment",
    price: "From $50/hr",
    icon: Mic2,
  },
  {
    id: "2",
    name: "Mixing",
    description: "Expert mixing services to bring your tracks to life",
    price: "From $75/hr",
    icon: Music2,
  },
]

export default function ServicesPage() {
  return (
    <div className="space-y-6 bg-[#FAFAF8] min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your studio services</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.price}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
