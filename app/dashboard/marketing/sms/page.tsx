"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function SmsCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("campaigns")

  const filteredCampaigns = smsCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>SMS Contacts</CardTitle>
              <CardDescription>
                Manage contacts who receive SMS notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Contact management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
