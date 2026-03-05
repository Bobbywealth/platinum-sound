"use client"

import { useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Send, Users, TrendingUp, Clock } from "lucide-react"

type CampaignStatus = "draft" | "scheduled" | "sent"

interface Campaign {
  id: string
  name: string
  subject: string
  status: CampaignStatus
  sentCount: number
  openRate?: number
  clickRate?: number
  scheduledAt?: string
  createdAt: string
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Mock data for demonstration - in production this would come from an API
  const emailCampaigns: Campaign[] = [
    {
      id: "1",
      name: "Summer Studio Discount",
      subject: "Get 20% Off Your Next Recording Session!",
      status: "sent",
      sentCount: 245,
      openRate: 42.5,
      clickRate: 12.3,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "New Year Promotion",
      subject: "Start 2024 with a Professional Recording",
      status: "scheduled",
      sentCount: 0,
      scheduledAt: "2024-01-01",
      createdAt: "2023-12-20",
    },
  ]
  
  const smsCampaigns: Campaign[] = [
    {
      id: "3",
      name: "Last Minute Availability",
      subject: "Studio available this weekend - Book now!",
      status: "sent",
      sentCount: 156,
      createdAt: "2024-01-10",
    },
  ]

  return (
    <DashboardPageShell>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
        <p className="text-muted-foreground">
          Manage your email and SMS marketing campaigns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="sms">SMS Campaigns</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailCampaigns.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Campaigns</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{smsCampaigns.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.5%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sent</span>
                  <span className="font-medium">{emailCampaigns.reduce((acc, c) => acc + c.sentCount, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Open Rate</span>
                  <span className="font-medium">42.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Click Rate</span>
                  <span className="font-medium">12.3%</span>
                </div>
              </CardContent>
            </Card>
            
            {/* SMS Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Sent</span>
                  <span className="font-medium">{smsCampaigns.reduce((acc, c) => acc + c.sentCount, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Delivery Rate</span>
                  <span className="font-medium">98.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={() => setActiveTab("email")}>
              <Mail className="mr-2 h-4 w-4" />
              Create Email Campaign
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("sms")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Create SMS Campaign
            </Button>
          </div>
        </TabsContent>
        
        {/* Email Campaigns Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Email Campaign</CardTitle>
              <CardDescription>Send promotional emails to your clients and leads</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email-name">Campaign Name</Label>
                    <Input id="email-name" placeholder="e.g., Summer Special Offer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Email Subject</Label>
                    <Input id="email-subject" placeholder="e.g., Don't miss our summer sale!" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="leads">All Leads</SelectItem>
                      <SelectItem value="newsletter">Newsletter Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Email Body</Label>
                  <Textarea 
                    id="email-body" 
                    placeholder="Write your email content here..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Send Now
                  </Button>
                  <Button type="button" variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                        {campaign.status === "sent" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {campaign.sentCount} sent • {campaign.openRate}% opened
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SMS Campaigns Tab */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create SMS Campaign</CardTitle>
              <CardDescription>Send text messages to your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-name">Campaign Name</Label>
                  <Input id="sms-name" placeholder="e.g., Flash Sale Alert" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="opted-in">SMS Opted-In</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-body">Message (160 characters max)</Label>
                  <Textarea 
                    id="sms-body" 
                    placeholder="Write your SMS message..."
                    maxLength={160}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">160 characters remaining</p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Send Now
                  </Button>
                  <Button type="button" variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent SMS Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smsCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                        {campaign.status === "sent" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {campaign.sentCount} sent
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardPageShell>
  )
}
