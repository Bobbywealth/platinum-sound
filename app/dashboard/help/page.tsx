"use client"

import { useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Music, 
  Building2, 
  Package, 
  BarChart3, 
  FileText, 
  Mail, 
  Settings,
  CheckSquare,
  Clock,
  DollarSign,
  HelpCircle,
  ChevronRight,
  Search
} from "lucide-react"

interface HelpTopic {
  id: string
  title: string
  category: string
  content: string
  icon: React.ElementType
}

const helpTopics: HelpTopic[] = [
  // Getting Started
  {
    id: "getting-started",
    title: "Getting Started",
    category: "Basics",
    icon: BookOpen,
    content: `Welcome to Platinum Sound Studios! This guide will help you understand the basics.

**First Steps:**
1. Log in with your credentials
2. Your role determines what you can see and do
3. Use the sidebar to navigate between sections
4. The dashboard shows an overview of your responsibilities`
  },
  {
    id: "roles",
    title: "Understanding Roles & Permissions",
    category: "Basics",
    icon: Users,
    content: `Your access level is determined by your role:

**Admin** - Full access to everything
**Manager** - Manage bookings, staff, reports, and studio operations
**Booking Agent** - Create and manage bookings, view calendar
**Engineer** - Update availability, manage sessions, apply discounts
**Intern** - Inventory sign-offs, work order signing
**Finance** - View invoices, expenses, and financial reports
**Marketing** - Email/SMS campaigns and client communications
**Front Desk** - View calendar and bookings, assist with check-in`
  },

  // Calendar & Scheduling
  {
    id: "calendar",
    title: "Using the Calendar",
    category: "Scheduling",
    icon: Calendar,
    content: `The calendar shows all bookings, tasks, and work orders.

**Features:**
- View bookings by day, week, or month
- See availability for studios and engineers
- Color-coded by status (confirmed, pending, in-progress, completed)
- Click on any booking to view details

**Master Calendar (Admin/Manager):**
- See all bookings across all studios
- View tasks and work orders by date
- Filter by studio, engineer, or status

**Personal Calendar:**
- See only your assigned tasks
- View your bookings and schedule`
  },
  {
    id: "availability",
    title: "Managing Availability",
    category: "Scheduling",
    icon: Clock,
    content: `Engineers can manage their availability:

1. Go to the Calendar section
2. Click on your profile or availability settings
3. Block off dates when you're unavailable
4. Set recurring availability patterns

**Important:**
- Blocked dates show as unavailable to booking agents
- You can override your availability for specific bookings`
  },

  // Bookings
  {
    id: "creating-bookings",
    title: "Creating Bookings",
    category: "Bookings",
    icon: Calendar,
    content: `To create a new booking:

1. Click "New Booking" from the Bookings page
2. Select a client (or create a new one)
3. Choose a studio and date
4. Select time slots and session type
5. Assign an engineer (optional)
6. Review pricing and confirm

**Pricing:**
- Base rate varies by studio and time
- Engineer fee may apply
- Add-ons like equipment rental cost extra`
  },
  {
    id: "managing-bookings",
    title: "Managing Bookings",
    category: "Bookings",
    icon: Calendar,
    content: `Booking management features:

**View All Bookings:**
- Filter by status (confirmed, pending, completed, cancelled)
- Search by client name or date
- View calendar or list format

**Edit Booking:**
- Click on any booking to view details
- Modify date, time, studio, or engineer
- Change status or add notes

**Booking Actions:**
- Confirm - Approve a pending booking
- Cancel - Cancel with reason
- Reschedule - Move to different time
- Extend - Add more time to session`
  },
  {
    id: "check-in",
    title: "Check-In Process",
    category: "Bookings",
    icon: CheckSquare,
    content: `The check-in system tracks client arrivals:

1. Client receives booking confirmation
2. On arrival, they can check in via the booking page
3. Staff can manually check in from the dashboard
4. Check-in updates booking status to "in-progress"

**Benefits:**
- Real-time status tracking
- Know when clients arrive
- Automatic notifications`
  },

  // Studios & Services
  {
    id: "studios",
    title: "Managing Studios",
    category: "Operations",
    icon: Building2,
    content: `Studios (formerly Rooms) are the recording spaces:

**Studio Features:**
- Name and description
- Base hourly rate
- Rate with/without engineer
- Amenities list
- Status (available, maintenance, unavailable)

**Managing Studios:**
- Add new studios with rates
- Update pricing and amenities
- Mark as under maintenance
- Lock rooms for specific dates`
  },
  {
    id: "services",
    title: "Managing Services",
    category: "Operations",
    icon: Music,
    content: `Services define what clients can book:

**Service Types:**
- Recording Session
- Mixing
- Mastering
- Voice Over
- Podcast
- And custom services

**Service Details:**
- Name and description
- Session mode (in-person or remote)
- Default duration
- Pricing tiers`
  },

  // Inventory
  {
    id: "inventory",
    title: "Inventory Management",
    category: "Operations",
    icon: Package,
    content: `Track equipment and supplies:

**Inventory Features:**
- Add equipment with quantity
- Set reorder points
- Track serial numbers
- Categorize items

**Categories:**
- Microphones
- Instruments
- Computers
- Software
- Accessories
- Other

**Low Stock Alerts:**
- System notifies when items reach reorder point
- Track what's running low`
  },

  // Tasks
  {
    id: "tasks",
    title: "Using Tasks",
    category: "Operations",
    icon: CheckSquare,
    content: `Tasks help manage studio workflows:

**Creating Tasks:**
1. Go to Tasks in the sidebar
2. Click "New Task"
3. Enter title and description
4. Set priority (low, medium, high, urgent)
5. Assign to team member
6. Set as recurring if needed

**Task Views:**
- Kanban board (To Do, In Progress, Completed)
- List view

**Task Details:**
- Click any task to view/edit
- Update status by dragging
- Mark complete when done`
  },
  {
    id: "work-orders",
    title: "Work Orders",
    category: "Operations",
    icon: FileText,
    content: `Work orders track maintenance and projects:

**Creating Work Orders:**
1. Go to Work Orders
2. Click to create new order
3. Title and description
4. Priority level
5. Assign to engineer

**Workflow:**
- Created → Assigned → In Progress → Completed
- Engineers can sign off when done
- Clients can sign for approval`
  },

  // Finance
  {
    id: "invoices",
    title: "Invoices",
    category: "Finance",
    icon: FileText,
    content: `Create and manage invoices:

**Creating Invoices:**
1. From a booking, generate invoice
2. Add line items (session time, equipment, etc.)
3. Apply discounts if needed
4. Send to client

**Invoice Status:**
- Draft - Not yet sent
- Sent - Awaiting payment
- Paid - Payment received
- Overdue - Past due date

**Payment Tracking:**
- Record payments
- Partial payments supported
- Payment history per invoice`
  },
  {
    id: "expenses",
    title: "Tracking Expenses",
    category: "Finance",
    icon: DollarSign,
    content: `Record studio expenses:

**Expense Categories:**
- Equipment purchases
- Maintenance
- Supplies
- Utilities
- Marketing
- Other

**Adding Expenses:**
1. Go to Expenses
2. Click Add Expense
3. Enter amount and category
4. Add description
5. Attach receipt if needed

**Reports:**
- View expenses by date range
- Export for accounting`
  },
  {
    id: "reports",
    title: "Financial Reports",
    category: "Finance",
    icon: BarChart3,
    content: `View financial performance:

**Available Reports:**
- Revenue by period
- Expense breakdown
- Profit margins
- Booking trends
- Client analysis

**Export Options:**
- View on screen
- Export to CSV/PDF
- Schedule automated reports`
  },

  // Clients & Leads
  {
    id: "clients",
    title: "Managing Clients",
    category: "Clients",
    icon: Users,
    content: `Client database management:

**Adding Clients:**
1. Go to Clients & Leads
2. Click Add Client
3. Enter contact information
4. Add project details
5. Set budget range

**Client Profile:**
- Contact info and history
- Past bookings
- Notes and preferences
- Total revenue`

  },
  {
    id: "leads",
    title: "Tracking Leads",
    category: "Clients",
    icon: Users,
    content: `Lead management for conversions:

**Lead Statuses:**
- New - Just added
- Contacted - Initial outreach done
- Booked - Converted to booking
- Lost - Not pursuing

**Lead Actions:**
- Add new leads
- Update status
- Add notes
- Convert to client when booked`
  },

  // Marketing
  {
    id: "marketing",
    title: "Marketing Campaigns",
    category: "Marketing",
    icon: Mail,
    content: `Integrated marketing tools:

**Email Campaigns:**
- Create email campaigns
- Select recipient lists
- Design email content
- Schedule or send immediately
- Track open rates

**SMS Campaigns:**
- Text message marketing
- Character limit (160)
- Quick sends
- Delivery tracking

**Performance:**
- Open rates
- Click rates
- Delivery success`
  },

  // Settings
  {
    id: "settings",
    title: "Settings & Configuration",
    category: "Settings",
    icon: Settings,
    content: `System configuration:

**Studio Settings:**
- Business name and logo
- Contact information
- Default pricing

**Team Management:**
- Add/remove team members
- Set roles and permissions
- Manage user accounts

**Billing:**
- Payment methods
- Invoice templates
- Tax rates

**Notifications:**
- Email alerts
- SMS notifications
- In-app notifications`
  }
]

const categories = ["All", "Basics", "Scheduling", "Bookings", "Operations", "Finance", "Clients", "Marketing", "Settings"]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredTopics = helpTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardPageShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Help Center</h2>
          <p className="text-muted-foreground">
            Find answers to common questions and learn how to use Platinum Sound Studios
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#C4A77D]"
          />
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Calendar</p>
                <p className="text-xs text-muted-foreground">Schedule & bookings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Clients</p>
                <p className="text-xs text-muted-foreground">Manage clients</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Finance</p>
                <p className="text-xs text-muted-foreground">Invoices & reports</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-xs text-muted-foreground">Configure system</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Help Topics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <topic.icon className="h-5 w-5 text-[#C4A77D]" />
                  <Badge variant="outline" className="text-xs">
                    {topic.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {topic.content.split('\n')[0]}
                </p>
                <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
                  Read more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Role-Based Help */}
        <Card>
          <CardHeader>
            <CardTitle>Help by Role</CardTitle>
            <CardDescription>
              Find specific help for your user role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="manager">Manager</TabsTrigger>
                <TabsTrigger value="booking">Booking Agent</TabsTrigger>
                <TabsTrigger value="engineer">Engineer</TabsTrigger>
              </TabsList>
              <TabsContent value="admin" className="mt-4">
                <div className="space-y-2">
                  <p><strong>Administrator</strong> has full access to all features:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Manage all bookings, clients, and team members</li>
                    <li>Configure system settings and user permissions</li>
                    <li>View all reports and financial data</li>
                    <li>Manage studios, services, and pricing</li>
                    <li>Access marketing tools and campaigns</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="manager" className="mt-4">
                <div className="space-y-2">
                  <p><strong>Manager</strong> oversees daily operations:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Create and manage bookings</li>
                    <li>View reports and analytics</li>
                    <li>Manage inventory and work orders</li>
                    <li>Assign tasks to team members</li>
                    <li>Handle client communications</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="booking" className="mt-4">
                <div className="space-y-2">
                  <p><strong>Booking Agent</strong> handles client bookings:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Create new bookings for clients</li>
                    <li>View and manage the calendar</li>
                    <li>Handle client inquiries</li>
                    <li>Apply discounts within limits</li>
                    <li>View client history</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="engineer" className="mt-4">
                <div className="space-y-2">
                  <p><strong>Engineer</strong> manages sessions:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Set your availability</li>
                    <li>View assigned bookings</li>
                    <li>Sign work orders</li>
                    <li>Apply session discounts</li>
                    <li>Update booking status</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-[#C4A77D]/10 border-[#C4A77D]">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium">Still need help?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Contact our support team for additional assistance
            </p>
            <Button className="mt-4 bg-[#C4A77D] hover:bg-[#B3966D]">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  )
}
