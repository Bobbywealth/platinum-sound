import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  MessageSquare,
  Send,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Email Campaigns",
  description: "Manage email marketing campaigns",
}

// Mock email campaigns data
const emailCampaigns = [
  {
    id: "email-1",
    name: "New Year Studio Promotion",
    subject: "Start 2024 with Platinum Sound - Special Rates!",
    status: "sent",
    sentDate: "2024-01-15",
    recipients: 245,
    opens: 189,
    clicks: 67,
    openRate: "77.1%",
    clickRate: "27.3%",
  },
  {
    id: "email-2",
    name: "VIP Client Early Access",
    subject: "Exclusive: Book Your Sessions Before Anyone Else",
    status: "draft",
    recipients: 0,
    opens: 0,
    clicks: 0,
    openRate: "0%",
    clickRate: "0%",
  },
  {
    id: "email-3",
    name: "Studio A Upgrade Announcement",
    subject: "Our Flagship Studio Just Got Better",
    status: "scheduled",
    scheduledDate: "2024-02-01",
    recipients: 312,
    opens: 0,
    clicks: 0,
    openRate: "0%",
    clickRate: "0%",
  },
]

// Mock SMS campaigns data
const smsCampaigns = [
  {
    id: "sms-1",
    name: "Session Reminder - Drake",
    message: "Reminder: Your session at Platinum Sound Studio A is tomorrow at 10AM. See you there!",
    status: "sent",
    sentDate: "2024-01-14",
    recipients: 1,
    delivered: 1,
  },
  {
    id: "sms-2",
    name: "Booking Confirmation - Rihanna",
    message: "Your studio booking at Platinum Sound is confirmed for Jan 15th, 2PM-8PM in Studio B.",
    status: "sent",
    sentDate: "2024-01-10",
    recipients: 1,
    delivered: 1,
  },
  {
    id: "sms-3",
    name: "Last Minute Availability",
    message: "Studio A just opened up tonight at Platinum Sound. Want to book? Call 212-265-6060",
    status: "scheduled",
    scheduledDate: "2024-01-20",
    recipients: 45,
    delivered: 0,
  },
]

export default function EmailCampaignsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage email marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Email Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">557</p>
                <p className="text-sm text-muted-foreground">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">77.1%</p>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">312</p>
                <p className="text-sm text-muted-foreground">Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                View and manage your email marketing campaigns
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="pl-9 pr-4 py-2 text-sm border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      campaign.status === "sent"
                        ? "bg-green-100 text-green-600"
                        : campaign.status === "scheduled"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {campaign.subject}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.recipients}</p>
                    <p className="text-xs text-muted-foreground">Recipients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.openRate}</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{campaign.clickRate}</p>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                  </div>
                  <Badge
                    variant={
                      campaign.status === "sent"
                        ? "success"
                        : campaign.status === "scheduled"
                        ? "info"
                        : "secondary"
                    }
                  >
                    {campaign.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
