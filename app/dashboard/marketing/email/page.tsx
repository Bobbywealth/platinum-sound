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
  Mail,
  Send,
  Users,
  Clock,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Play,
  Pause,
  UserPlus,
} from "lucide-react"

const emailCampaigns = [
  {
    id: "EC001",
    name: "Holiday Session Promotion",
    subject: "25% Off Holiday Studio Sessions",
    status: "sent",
    sentDate: "2024-01-10",
    recipients: 156,
    openRate: 45.2,
    clickRate: 12.8,
  },
  {
    id: "EC002",
    name: "New Year New Album",
    subject: "Start Your 2024 Album at Platinum Sound",
    status: "draft",
    sentDate: null,
    recipients: 0,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: "EC003",
    name: "VIP Client Update",
    subject: "Exclusive VIP Perks for 2024",
    status: "scheduled",
    scheduledDate: "2024-02-01",
    recipients: 89,
    openRate: 0,
    clickRate: 0,
  },
]

const emailTemplates = [
  {
    id: "ET001",
    name: "Booking Confirmation",
    subject: "Your Studio Session is Confirmed",
    lastUsed: "2024-01-14",
  },
  {
    id: "ET002",
    name: "Session Reminder",
    subject: "Reminder: Your Session Tomorrow",
    lastUsed: "2024-01-13",
  },
  {
    id: "ET003",
    name: "Invoice Receipt",
    subject: "Payment Received - Thank You",
    lastUsed: "2024-01-12",
  },
  {
    id: "ET004",
    name: "Follow Up",
    subject: "How Was Your Session?",
    lastUsed: "2024-01-10",
  },
]

type Subscriber = {
  id: string
  name: string
  email: string
  status: "Active" | "Unsubscribed"
  dateAdded: string
}

const initialSubscribers: Subscriber[] = [
  { id: "SUB001", name: "Drake", email: "drake@octobersveryown.com", status: "Active", dateAdded: "2023-08-15" },
  { id: "SUB002", name: "Rihanna", email: "rihanna@fentybeauty.com", status: "Active", dateAdded: "2023-09-02" },
  { id: "SUB003", name: "The Weeknd", email: "abel@xo.com", status: "Active", dateAdded: "2023-09-18" },
  { id: "SUB004", name: "Bad Bunny", email: "badbunny@rimas.com", status: "Active", dateAdded: "2023-10-05" },
  { id: "SUB005", name: "Kendrick Lamar", email: "kendrick@pglanation.com", status: "Active", dateAdded: "2023-10-22" },
  { id: "SUB006", name: "Beyoncé", email: "beyonce@parkwood.com", status: "Unsubscribed", dateAdded: "2023-11-01" },
  { id: "SUB007", name: "J. Cole", email: "jcole@dreamville.com", status: "Active", dateAdded: "2023-11-14" },
  { id: "SUB008", name: "SZA", email: "sza@tde.com", status: "Active", dateAdded: "2023-12-03" },
  { id: "SUB009", name: "Travis Scott", email: "travis@cactusjack.com", status: "Unsubscribed", dateAdded: "2023-12-20" },
  { id: "SUB010", name: "Doja Cat", email: "doja@kemosabe.com", status: "Active", dateAdded: "2024-01-08" },
]

export default function EmailCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [subscriberSearch, setSubscriberSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSubscriberName, setNewSubscriberName] = useState("")
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("")

  const filteredCampaigns = emailCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.name.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
      sub.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  )

  const handleAddSubscriber = () => {
    if (!newSubscriberName.trim() || !newSubscriberEmail.trim()) return
    const newSub: Subscriber = {
      id: `SUB${String(subscribers.length + 1).padStart(3, "0")}`,
      name: newSubscriberName.trim(),
      email: newSubscriberEmail.trim(),
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setSubscribers((prev) => [newSub, ...prev])
    setNewSubscriberName("")
    setNewSubscriberEmail("")
    setIsAddDialogOpen(false)
  }

  return (
    <DashboardPageShell>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Campaigns</h2>
          <p className="text-muted-foreground">Manage email marketing campaigns</p>
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
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailCampaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailCampaigns.filter((c) => c.status === "sent").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailCampaigns.reduce((acc, c) => acc + c.recipients, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                emailCampaigns
                  .filter((c) => c.openRate > 0)
                  .reduce((acc, c) => acc + c.openRate, 0) /
                  emailCampaigns.filter((c) => c.openRate > 0).length
              )}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
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
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Campaign
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Status
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Recipients
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Open Rate
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Click Rate
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {campaign.subject}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
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
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{campaign.recipients}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={
                              campaign.openRate > 0
                                ? "text-green-500 font-medium"
                                : "-"
                            }
                          >
                            {campaign.openRate > 0 ? `${campaign.openRate}%` : "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={
                              campaign.clickRate > 0
                                ? "text-primary font-medium"
                                : "-"
                            }
                          >
                            {campaign.clickRate > 0 ? `${campaign.clickRate}%` : "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {campaign.status === "draft" && (
                              <Button variant="ghost" size="icon" title="Send">
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            {campaign.status === "scheduled" && (
                              <Button variant="ghost" size="icon" title="Pause">
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {emailTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.subject}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Last used: {template.lastUsed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                className="pl-10"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Subscriber
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Subscriber</DialogTitle>
                  <DialogDescription>
                    Add a new subscriber to your email marketing list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sub-name">Name</Label>
                    <Input
                      id="sub-name"
                      placeholder="e.g. Drake"
                      value={newSubscriberName}
                      onChange={(e) => setNewSubscriberName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sub-email">Email</Label>
                    <Input
                      id="sub-email"
                      type="email"
                      placeholder="e.g. artist@label.com"
                      value={newSubscriberEmail}
                      onChange={(e) => setNewSubscriberEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubscriber} disabled={!newSubscriberName.trim() || !newSubscriberEmail.trim()}>
                    Add Subscriber
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Subscribers</CardTitle>
              <CardDescription>
                {filteredSubscribers.length} of {subscribers.length} subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground text-sm">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium">{sub.name}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">{sub.email}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant={sub.status === "Active" ? "success" : "secondary"}>
                              {sub.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(sub.dateAdded).toLocaleDateString()}
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
