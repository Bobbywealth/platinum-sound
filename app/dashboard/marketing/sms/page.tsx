import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
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
  Phone,
  Eye,
} from "lucide-react"

export const metadata: Metadata = {
  title: "SMS Campaigns",
  description: "Manage SMS marketing campaigns",
}

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
  {
    id: "sms-4",
    name: "VIP Client Early Access",
    message: "Exclusive opportunity: Book your preferred studio time before we open bookings to the public.",
    status: "draft",
    recipients: 0,
    delivered: 0,
  },
]

export default function SMSCampaignsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SMS Campaigns</h1>
          <p className="text-muted-foreground">
            Send SMS notifications and marketing messages to clients
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New SMS Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">47</p>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Recipients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Send Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quick SMS Send
          </CardTitle>
          <CardDescription>
            Send a quick SMS to a client or group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipients</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select recipient(s)...</option>
                <option value="all">All Clients (89)</option>
                <option value="vip">VIP Clients (8)</option>
                <option value="active">Active Clients (24)</option>
                <option value="individual">Individual Client</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Template (Optional)</label>
              <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">No template</option>
                <option value="reminder">Session Reminder</option>
                <option value="confirmation">Booking Confirmation</option>
                <option value="promo">Promotional</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Enter your message (max 160 characters for single SMS)..."
                maxLength={320}
              />
              <p className="text-xs text-muted-foreground text-right">0/320 characters</p>
            </div>
            <div className="md:col-span-2">
              <Button className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent SMS Campaigns</CardTitle>
              <CardDescription>
                View and manage your SMS marketing campaigns
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
            {smsCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      campaign.status === "sent"
                        ? "bg-green-100 text-green-600"
                        : campaign.status === "scheduled"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="max-w-xl">
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {campaign.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {campaign.recipients} recipient(s)
                      </span>
                      {campaign.status === "sent" && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Sent {campaign.sentDate}
                        </span>
                      )}
                      {campaign.status === "scheduled" && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Scheduled for {campaign.scheduledDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {campaign.status === "sent" && campaign.delivered === campaign.recipients && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Delivered
                    </Badge>
                  )}
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
