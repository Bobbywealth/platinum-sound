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
  Search,
  Download
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
4. The dashboard shows an overview of your responsibilities

**Navigation:**
- Use the sidebar on the left to access different sections
- Click on any section to expand its sub-menus
- Use the search bar to quickly find pages
- Your user profile is accessible from the top right

**Key Concepts:**
- Studios: Physical recording spaces with different equipment
- Engineers: Audio professionals who operate the equipment
- Bookings: Reserved time slots for recording sessions
- Tasks: Work items that need to be completed
- Work Orders: Maintenance or equipment requests`
  },
  {
    id: "roles",
    title: "Understanding Roles & Permissions",
    category: "Basics",
    icon: Users,
    content: `Your access level is determined by your role:

**Admin** - Full access to everything
- Manage all bookings, clients, and team members
- Configure system settings and user permissions
- View all reports and financial data
- Manage studios, services, and pricing
- Access marketing tools and campaigns
- Create and manage other users

**Manager** - Manage bookings, staff, reports, and studio operations
- Create and manage bookings
- View reports and analytics
- Manage inventory and work orders
- Assign tasks to team members
- Handle client communications
- Configure studio settings

**Booking Agent** - Create and manage bookings
- Create new bookings for clients
- View and manage the calendar
- Handle client inquiries
- Apply discounts within limits
- View client history

**Engineer** - Manage sessions and availability
- Update personal availability
- View assigned bookings
- Apply discounts to sessions
- Sign work orders
- Update session notes

**Intern** - Limited access
- View assigned tasks
- Sign off on inventory
- Sign work orders`
  },
  {
    id: "deep-dive-bookings",
    title: "Booking Deep Dive",
    category: "Training",
    icon: Calendar,
    content: `This comprehensive guide covers the entire booking lifecycle.

**Step 1: Client Selection**
- Search for existing clients by name, email, or phone
- Create a new client if needed (requires name and contact info)
- View client history, past bookings, and notes
- Check for any special requirements or preferences

**Step 2: Studio Selection**
- Studio A: Large format, ideal for full bands
- Studio B: Mid-size, perfect for small groups
- Studio C: Intimate, great for voiceover/solo artists
- Each studio has different hourly rates and equipment

**Step 3: Date & Time**
- Check real-time availability on the calendar
- Buffer time is automatically added between sessions
- Multi-day bookings can be created for albums/projects
- Recurring bookings supported for regular clients

**Step 4: Session Type**
- Tracking: Basic recording with engineer
- Mixing: Post-production audio mixing
- Mastering: Final audio polishing
- Voiceover: Voice recording sessions
- Podcast: Recording for podcasts
- Custom: Special session types

**Step 5: Engineer Assignment**
- Select from available engineers
- Consider engineer specialties and experience
- Check engineer availability for the time slot
- Engineer rates affect total price

**Step 6: Pricing & Payment**
- Base studio rate + engineer fee + add-ons
- Apply discounts if authorized
- Collect deposit or full payment
- Generate invoice automatically

**Step 7: Confirmation**
- Send confirmation email to client
- Add session notes or special instructions
- Create tasks for preparation if needed
- Set reminders for the session day`
  },
  {
    id: "deep-dive-checkin",
    title: "Check-In Process Deep Dive",
    category: "Training",
    icon: CheckSquare,
    content: `The check-in process ensures smooth session starts and accurate tracking.

**Pre-Session Preparation (Before Client Arrives)**
1. Review the day's bookings in the calendar
2. Check if any special equipment is needed
3. Verify engineer availability
4. Ensure studio is clean and ready
5. Prepare any paperwork or contracts

**Upon Client Arrival**
1. Greet client and verify identity
2. Confirm booking details (studio, time, rate)
3. Collect any outstanding payments
4. Review any special requests
5. Get client signature on release form if needed

**During Check-In**
1. Log into the system
2. Search for the booking
3. Click "Check In" button
4. Record any changes or notes
5. Assign specific room if not pre-assigned
6. Note equipment rental or additional services

**Post-Check-In**
1. Escort client to studio
2. Brief engineer on session goals
3. Ensure all equipment is working
4. Set up any additional requests
5. Note session start time

**Common Check-In Issues**
- Client not found: Search by name or booking ID
- Payment issues: Contact finance team
- Equipment problems: Create work order
- Schedule conflicts: Contact manager immediately

**Best Practices**
- Check-in 15 minutes before session start
- Verify payment before starting session
- Document any issues immediately
- Communicate any delays to all parties`
  },
  {
    id: "deep-dive-inventory",
    title: "Inventory Management Training",
    category: "Training",
    icon: Package,
    content: `Complete guide to managing studio inventory.

**Inventory Categories**
- Microphones: Various types for different applications
- Instruments: Guitars, keyboards, drums
- Cables & Connectors: All audio connections
- Accessories: Stands, pop filters, headphones
- Consumables: Tape, markers, etc.

**Adding Inventory**
1. Navigate to Inventory in the sidebar
2. Click "Add Item" button
3. Fill in details:
   - Name and description
   - Category
   - Serial number (for valuable items)
   - Purchase date and cost
   - Current condition
   - Assigned location/studio
4. Upload photo if available
5. Save item

**Checking In/Out Equipment**
- Sign-out: Record who has the item, expected return
- Sign-off: Verify item condition on return
- Document any damage or issues
- Update item status accordingly

**Inventory Audits**
- Schedule regular audits (monthly recommended)
- Physical count vs. system records
- Check condition of all items
- Report missing or damaged items
- Update quantities as needed

**Low Stock Alerts**
- Set minimum quantity thresholds
- Receive notifications when low
- Create purchase requests
- Track supplier orders

**Maintenance & Repairs**
- Create work order for repairs
- Track repair costs
- Document maintenance history
- Schedule preventive maintenance`
  },
  {
    id: "deep-dive-reports",
    title: "Reports & Analytics Training",
    category: "Training",
    icon: BarChart3,
    content: `Mastering reports to understand your business.

**Available Reports**
- Daily Summary: End-of-day overview
- Weekly Session Log: Week's activities
- Monthly Summary: Comprehensive monthly view
- Revenue Reports: Income and trends
- Utilization Reports: Studio and engineer usage

**Generating Reports**
1. Navigate to Reports section
2. Select report type
3. Choose date range
4. Apply filters (studio, engineer, etc.)
5. Click Generate
6. Export or print as needed

**Understanding Metrics**
- Total Revenue: Sum of all payments received
- Session Count: Number of bookings
- Average Session Value: Revenue / Sessions
- Utilization Rate: Hours booked / Hours available
- No-show Rate: Missed sessions / Total bookings
- Cancellation Rate: Cancelled / Total bookings

**Scheduling Automated Reports**
1. Click "Schedule Report"
2. Name your schedule
3. Select report type
4. Choose frequency (daily/weekly/monthly)
5. Add email recipients
6. Set enabled to true
7. Reports will be sent automatically

**Export Options**
- PDF: For printing and sharing
- Excel: For further analysis
- CSV: For data processing

**Best Practices**
- Review reports daily for operations
- Weekly review for trends
- Monthly for strategic planning
- Compare periods for insights`
  },
  {
    id: "deep-dive-clients",
    title: "Client Management Training",
    category: "Training",
    icon: Users,
    content: `Building and maintaining client relationships.

**Client Profiles**
Each client record contains:
- Contact information
- Booking history
- Payment history
- Preferences and notes
- Referral source
- Lifetime value

**Adding New Clients**
1. Go to Clients section
2. Click "Add Client"
3. Enter required info:
   - First and last name
   - Email address
   - Phone number
4. Add optional details:
   - Company/organization
   - Preferred studio
   - Preferred engineer
   - Notes about preferences
5. Save client

**Managing Client Data**
- Keep contact info updated
- Record preferences after each session
- Note any special requirements
- Track communication history
- Update status (active, lead, inactive)

**Client Communication**
- Send booking confirmations
- Follow-up after sessions
- Birthday/holiday greetings
- Special offers for loyal clients
- Newsletter for updates

**Handling Leads**
- Track new inquiries promptly
- Note source of lead
- Follow up within 24 hours
- Convert to client when booked
- Keep notes on conversations

**Client Retention**
- Offer loyalty discounts
- Remember preferences
- Provide excellent service
- Request referrals
- Handle issues professionally`
  },
  {
    id: "deep-dive-workflow",
    title: "Daily Workflow Best Practices",
    category: "Training",
    icon: Clock,
    content: `Optimizing your daily operations.

**Morning Routine (Start of Day)**
1. Check dashboard for daily overview
2. Review upcoming bookings
3. Check engineer availability
4. Verify studio readiness
5. Address any issues from previous day

**During the Day**
- Process check-ins promptly
- Monitor booking flow
- Handle walk-ins if possible
- Address any issues immediately
- Keep client communications timely

**End of Day**
- Review completed sessions
- Send follow-up communications
- Generate daily report
- Prepare for next day
- Address any pending tasks

**Task Management**
- Check task list first thing
- Prioritize by urgency
- Complete and mark done
- Delegate if needed
- Review overdue items

**Work Orders**
- Review incoming work orders
- Prioritize by urgency
- Assign to appropriate staff
- Track progress
- Complete and document

**Communication**
- Respond to messages quickly
- Keep notes in system
- Update client statuses
- Coordinate with team
- Escalate issues properly`
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

const categories = ["All", "Basics", "Training", "Scheduling", "Bookings", "Operations", "Finance", "Clients", "Marketing", "Settings"]

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
          <a href="/dashboard/calendar" className="no-underline">
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
          </a>
          <a href="/dashboard/bookings" className="no-underline">
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
          </a>
          <a href="/dashboard/reports" className="no-underline">
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
          </a>
          <a href="/dashboard/settings" className="no-underline">
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
          </a>
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
