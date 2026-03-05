"use client"

import { useState, useEffect } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare,
  User,
  TrendingUp,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  sessionType: string | null
  studio: string | null
  preferredDate: string | null
  preferredTime: string | null
  message: string | null
  referralSource: string | null
  status: string
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("ALL")

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads")
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLeads(leads.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ))
      }
    } catch (error) {
      console.error("Failed to update lead:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500">New</Badge>
      case "CONTACTED":
        return <Badge className="bg-yellow-500">Contacted</Badge>
      case "BOOKED":
        return <Badge className="bg-green-500">Booked</Badge>
      case "LOST":
        return <Badge className="bg-red-500">Lost</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredLeads = filter === "ALL" 
    ? leads 
    : leads.filter(lead => lead.status === filter)

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "NEW").length,
    contacted: leads.filter(l => l.status === "CONTACTED").length,
    booked: leads.filter(l => l.status === "BOOKED").length,
  }

  return (
    <DashboardPageShell>
      <div className="space-y-6">
        <PageHeader
          title="Leads"
          description="Track and manage booking inquiries"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-royal" />
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">New</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.new}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Contacted</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.contacted}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Booked</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.booked}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "NEW", "CONTACTED", "BOOKED", "LOST"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No leads found</div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-card rounded-lg border p-4 hover:border-royal/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{lead.name || "Anonymous"}</h3>
                      {getStatusBadge(lead.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.studio && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {lead.studio}
                        </div>
                      )}
                      {lead.preferredDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(lead.preferredDate).toLocaleDateString()}
                        </div>
                      )}
                      {lead.preferredTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lead.preferredTime}
                        </div>
                      )}
                    </div>

                    {lead.message && (
                      <div className="flex items-start gap-2 text-sm mt-2">
                        <MessageSquare className="h-4 w-4 mt-0.5" />
                        <span className="text-muted-foreground">{lead.message}</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(lead.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {lead.status === "NEW" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateLeadStatus(lead.id, "CONTACTED")}
                      >
                        Mark Contacted
                      </Button>
                    )}
                    {lead.status === "CONTACTED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-500"
                          onClick={() => updateLeadStatus(lead.id, "BOOKED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Booked
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => updateLeadStatus(lead.id, "LOST")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Lost
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
