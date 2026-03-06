"use client"

import { useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  BarChart3,
  MousePointerClick,
  Eye,
  ArrowUpRight,
  Calendar,
  Target,
  Megaphone
} from "lucide-react"

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
  type: "email" | "sms"
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Mock data - in production this would come from an API
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Summer Studio Discount",
      subject: "Get 20% Off Your Next Recording Session!",
      status: "sent",
      sentCount: 245,
      openRate: 42.5,
      clickRate: 12.3,
      createdAt: "2024-01-15",
      type: "email",
    },
    {
      id: "2",
      name: "New Year Promotion",
      subject: "Start 2024 with a Professional Recording",
      status: "scheduled",
      sentCount: 0,
      scheduledAt: "2024-01-01",
      createdAt: "2023-12-20",
      type: "email",
    },
    {
      id: "3",
      name: "Last Minute Availability",
      subject: "Studio available this weekend - Book now!",
      status: "sent",
      sentCount: 156,
      openRate: 68.2,
      clickRate: 24.5,
      createdAt: "2024-01-10",
      type: "sms",
    },
    {
      id: "4",
      name: "Holiday Special",
      subject: "Book before Dec 25th and get a free hour!",
      status: "draft",
      sentCount: 0,
      createdAt: "2024-01-12",
      type: "email",
    },
  ]

  const emailCampaigns = campaigns.filter(c => c.type === "email")
  const smsCampaigns = campaigns.filter(c => c.type === "sms")
  const sentCampaigns = campaigns.filter(c => c.status === "sent")
  const avgOpenRate = sentCampaigns.length > 0 
    ? sentCampaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / sentCampaigns.length 
    : 0
  const avgClickRate = sentCampaigns.length > 0 
    ? sentCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / sentCampaigns.length 
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-500"
      case "scheduled": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <DashboardPageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="h-8 w-8 text-[#C4A77D]" />
              Marketing Center
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage your email and SMS marketing campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              New SMS
            </Button>
            <Button className="bg-[#C4A77D] hover:bg-[#B3966D] gap-2">
              <Mail className="h-4 w-4" />
              New Email Campaign
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Sent</CardTitle>
              <Send className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sentCampaigns.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {campaigns.filter(c => c.status === "scheduled").length} scheduled
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgOpenRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+5.2%</span> industry avg
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Click Rate</CardTitle>
              <MousePointerClick className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgClickRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+3.1%</span> industry avg
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="overview" className="gap-1">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1">
              <Mail className="h-4 w-4" />
              Email Campaigns
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              SMS Campaigns
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Campaigns
                </CardTitle>
                <CardDescription>Your latest marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.slice(0, 4).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${campaign.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {campaign.type === 'email' ? (
                            <Mail className="h-5 w-5 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        {campaign.status === "sent" && (
                          <div className="text-right text-sm">
                            <p className="font-medium">{campaign.sentCount} sent</p>
                            <p className="text-muted-foreground">{campaign.openRate}% open</p>
                          </div>
                        )}
                        {campaign.status === "scheduled" && campaign.scheduledAt && (
                          <div className="text-right text-sm">
                            <p className="font-medium">Scheduled</p>
                            <p className="text-muted-foreground">{campaign.scheduledAt}</p>
                          </div>
                        )}
                        {campaign.status === "draft" && (
                          <div className="text-right text-sm">
                            <p className="font-medium">Draft</p>
                            <p className="text-muted-foreground">Not sent yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Campaign</h3>
                  <p className="text-sm text-muted-foreground">Create a new email campaign to your subscriber list</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">SMS Campaign</h3>
                  <p className="text-sm text-muted-foreground">Send quick updates to your SMS subscribers</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Audience Segments</h3>
                  <p className="text-sm text-muted-foreground">Create and manage audience segments</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Email Campaigns Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Email Campaigns</h3>
              <Button className="bg-[#C4A77D] hover:bg-[#B3966D] gap-2">
                <Plus className="h-4 w-4" />
                New Email Campaign
              </Button>
            </div>
            
            <div className="space-y-4">
              {emailCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground mt-2">Created: {campaign.createdAt}</p>
                        </div>
                      </div>
                      
                      {campaign.status === "sent" && (
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-2xl font-bold">{campaign.sentCount}</p>
                            <p className="text-xs text-muted-foreground">Sent</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{campaign.openRate}%</p>
                            <p className="text-xs text-muted-foreground">Opened</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{campaign.clickRate}%</p>
                            <p className="text-xs text-muted-foreground">Clicked</p>
                          </div>
                        </div>
                      )}
                      
                      {campaign.status === "scheduled" && campaign.scheduledAt && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Scheduled for {campaign.scheduledAt}</span>
                        </div>
                      )}
                      
                      {campaign.status === "draft" && (
                        <Button variant="outline" size="sm">Edit Draft</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* SMS Campaigns Tab */}
          <TabsContent value="sms" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">SMS Campaigns</h3>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New SMS Campaign
              </Button>
            </div>
            
            <div className="space-y-4">
              {smsCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <MessageSquare className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{campaign.name}</h4>
                            <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground mt-2">Created: {campaign.createdAt}</p>
                        </div>
                      </div>
                      
                      {campaign.status === "sent" && (
                        <div className="text-center">
                          <p className="text-2xl font-bold">{campaign.sentCount}</p>
                          <p className="text-xs text-muted-foreground">Recipients</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {smsCampaigns.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No SMS campaigns yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first SMS campaign to reach customers quickly</p>
                    <Button className="bg-[#C4A77D] hover:bg-[#B3966D]">Create SMS Campaign</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardPageShell>
  )
}
