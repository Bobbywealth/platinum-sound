"use client"

import { useEffect, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Phone, 
  Mail, 
  Calendar, 
  Search, 
  MoreHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  source: string | null
  notes: string | null
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (id: string, status: string) => {
    // For now, we'll just refresh - you could add a PATCH endpoint
    console.log('Updating lead:', id, status)
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lead.phone && lead.phone.includes(searchQuery))
    const matchesStatus = !statusFilter || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-500",
    CONTACTED: "bg-yellow-500",
    INTERESTED: "bg-green-500",
    NOT_INTERESTED: "bg-gray-500",
    CONVERTED: "bg-purple-500",
  }

  return (
    <DashboardPageShell>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Track inquiries and potential clients from the booking page
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredLeads.length} total leads
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "NEW" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("NEW")}
            >
              New
            </Button>
            <Button
              variant={statusFilter === "CONTACTED" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("CONTACTED")}
            >
              Contacted
            </Button>
          </div>
        </div>

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No leads found. Leads will appear here when someone fills out the booking form.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status] || "bg-gray-500"}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${lead.email}`}>
                              Send Email
                            </DropdownMenuItem>
                            {lead.phone && (
                              <DropdownMenuItem onClick={() => window.location.href = `tel:${lead.phone}`}>
                                Call
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, "CONTACTED")}>
                              Mark as Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, "CONVERTED")}>
                              Mark as Converted
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        {filteredLeads.some(l => l.notes) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.filter(l => l.notes).map(lead => (
                  <div key={lead.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {lead.notes}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardPageShell>
  )
}
