"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Send,
  Users,
  Clock,
  Plus,
  Search,
  Eye,
  Edit,
  Phone,
  Calendar,
  UserPlus,
} from "lucide-react"

const smsCampaigns = [
  {
    id: "SMS001",
    name: "Session Reminder - Today",
    message: "Reminder: Your studio session is today at {time}. See you soon!",
    status: "sent",
    sentDate: "2024-01-15",
    recipients: 12,
    deliveryRate: 100,
  },
  {
    id: "SMS002",
    name: "Booking Confirmation",
    message: "Your studio booking for {date} has been confirmed. See you at Platinum Sound!",
    status: "sent",
    sentDate: "2024-01-14",
    recipients: 8,
    deliveryRate: 100,
  },
  {
    id: "SMS003",
    name: "Last Minute Opening",
    message: "Studio B just opened up for tonight! Reply to book your session.",
    status: "sent",
    sentDate: "2024-01-13",
    recipients: 45,
    deliveryRate: 95.5,
  },
  {
    id: "SMS004",
    name: "VIP Early Access",
    message: "VIP Exclusive: Early access to our new mastering suite. Book now!",
    status: "draft",
    sentDate: null,
    recipients: 0,
    deliveryRate: 0,
  },
]

const smsTemplates = [
  {
    id: "ST001",
    name: "Session Reminder",
    message: "Reminder: Your studio session is tomorrow at {time}. See you soon!",
    lastUsed: "2024-01-15",
  },
  {
    id: "ST002",
    name: "Booking Confirmation",
    message: "Your studio booking for {date} has been confirmed. See you at Platinum Sound!",
    lastUsed: "2024-01-14",
  },
  {
    id: "ST003",
    name: "Check-In Link",
    message: "Check in for your session: {checkin_url}",
    lastUsed: "2024-01-12",
  },
  {
    id: "ST004",
    name: "Session Complete",
    message: "Thanks for recording at Platinum Sound! We hope to see you again soon.",
    lastUsed: "2024-01-10",
  },
]

type Contact = {
  id: string
  name: string
  phone: string
  status: "Active" | "Opted Out"
  dateAdded: string
}

const initialContacts: Contact[] = [
  { id: "CON001", name: "Drake", phone: "+1 (416) 555-0101", status: "Active", dateAdded: "2023-08-15" },
  { id: "CON002", name: "Rihanna", phone: "+1 (246) 555-0102", status: "Active", dateAdded: "2023-09-02" },
  { id: "CON003", name: "The Weeknd", phone: "+1 (416) 555-0103", status: "Active", dateAdded: "2023-09-18" },
  { id: "CON004", name: "Bad Bunny", phone: "+1 (787) 555-0104", status: "Active", dateAdded: "2023-10-05" },
  { id: "CON005", name: "Kendrick Lamar", phone: "+1 (310) 555-0105", status: "Active", dateAdded: "2023-10-22" },
  { id: "CON006", name: "Beyoncé", phone: "+1 (713) 555-0106", status: "Opted Out", dateAdded: "2023-11-01" },
  { id: "CON007", name: "J. Cole", phone: "+1 (910) 555-0107", status: "Active", dateAdded: "2023-11-14" },
  { id: "CON008", name: "SZA", phone: "+1 (973) 555-0108", status: "Active", dateAdded: "2023-12-03" },
  { id: "CON009", name: "Travis Scott", phone: "+1 (713) 555-0109", status: "Opted Out", dateAdded: "2023-12-20" },
  { id: "CON010", name: "Doja Cat", phone: "+1 (818) 555-0110", status: "Active", dateAdded: "2024-01-08" },
]

export default function SmsCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [contactSearch, setContactSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")

  const filteredCampaigns = smsCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.phone.toLowerCase().includes(contactSearch.toLowerCase())
  )

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return
    const newContact: Contact = {
      id: `CON${String(contacts.length + 1).padStart(3, "0")}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setContacts((prev) => [newContact, ...prev])
    setNewContactName("")
    setNewContactPhone("")
    setIsAddDialogOpen(false)
  }

  return (
    <DashboardPageShell>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SMS Campaigns</h2>
          <p className="text-muted-foreground">Manage SMS marketing and notifications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsCampaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {smsCampaigns.reduce((acc, c) => acc + c.recipients, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round(
                smsCampaigns
                  .filter((c) => c.deliveryRate > 0)
                  .reduce((acc, c) => acc + c.deliveryRate, 0) /
                  smsCampaigns.filter((c) => c.deliveryRate > 0).length
              )}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {smsCampaigns.filter((c) => c.status === "scheduled").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Campaigns List */}
          <div className="grid gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{campaign.name}</h3>
                        <Badge
                          variant={
                            campaign.status === "sent"
                              ? "success"
                              : campaign.status === "scheduled"
                              ? "info"
                              : "secondary"
                          }
                        >
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {campaign.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {campaign.sentDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Sent:{" "}
                              {new Date(campaign.sentDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{campaign.recipients} recipients</span>
                        </div>
                        {campaign.deliveryRate > 0 && (
                          <span className="text-green-500">
                            {campaign.deliveryRate}% delivered
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {campaign.status === "draft" && (
                        <Button variant="outline" size="sm">
                          <Send className="mr-2 h-4 w-4" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {smsTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>Last used: {template.lastUsed}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{template.message}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                  <DialogDescription>
                    Add a new contact to your SMS marketing list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      placeholder="e.g. Drake"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact} disabled={!newContactName.trim() || !newContactPhone.trim()}>
                    Add Contact
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SMS Contacts</CardTitle>
              <CardDescription>
                {filteredContacts.length} of {contacts.length} contacts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Phone Number</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No contacts found.
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium">{contact.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {contact.phone}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={contact.status === "Active" ? "success" : "secondary"}>
                              {contact.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(contact.dateAdded).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardPageShell>
  )
}
