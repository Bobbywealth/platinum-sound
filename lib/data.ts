// Mock data for the Platinum Sound CRM

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  label: string
  project: string
  budget: number
  status: "active" | "pending" | "completed"
  createdAt: string
  avatar?: string
}

export interface Booking {
  id: string
  clientId: string
  clientName: string
  studio: "Studio A" | "Studio B"
  date: string
  startTime: string
  endTime: string
  engineer: string
  sessionType: "Recording" | "Mixing" | "Mastering" | "Production"
  status: "confirmed" | "pending" | "in-progress" | "completed" | "cancelled"
  notes?: string
  isVip?: boolean
  totalCost: number
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  amount: number
  status: "paid" | "pending" | "overdue"
  dueDate: string
  issuedDate: string
  items: { description: string; amount: number }[]
}

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

export const expenses: Expense[] = [
  { id: "E001", category: "Equipment", description: "Microphone maintenance", amount: 3200, date: "2024-01-05" },
  { id: "E002", category: "Utilities", description: "Electricity & HVAC", amount: 5800, date: "2024-01-08" },
  { id: "E003", category: "Staff", description: "Engineer payroll", amount: 22000, date: "2024-01-15" },
  { id: "E004", category: "Software", description: "Pro Tools & plugins licenses", amount: 1800, date: "2024-01-10" },
  { id: "E005", category: "Facilities", description: "Studio lease", amount: 18000, date: "2024-01-01" },
  { id: "E006", category: "Equipment", description: "SSL console servicing", amount: 4500, date: "2024-01-12" },
  { id: "E007", category: "Marketing", description: "Website & social media", amount: 2200, date: "2024-01-14" },
  { id: "E008", category: "Utilities", description: "Internet & phone", amount: 900, date: "2024-01-08" },
]

export interface StaffMember {
  id: string
  name: string
  role: string
  specialty: string
  status: "available" | "in-session" | "off"
  currentAssignment?: string
  email: string
  phone: string
}

// Mock Clients
export const clients: Client[] = [
  {
    id: "001",
    name: "Jerry 'Wonda' Duplessis",
    email: "jerry@platinumsound.com",
    phone: "212-265-6060",
    label: "Platinum Sound",
    project: "Internal",
    budget: 0,
    status: "active",
    createdAt: "2004-01-15",
  },
  {
    id: "002",
    name: "The Weeknd",
    email: "abel@xo.com",
    phone: "416-555-0123",
    label: "XO Records / Republic",
    project: "New Album",
    budget: 120000,
    status: "active",
    createdAt: "2023-08-10",
  },
  {
    id: "003",
    name: "Drake",
    email: "contact@ovo.com",
    phone: "416-555-0456",
    label: "OVO Sound",
    project: "For All The Dogs Sessions",
    budget: 250000,
    status: "active",
    createdAt: "2023-06-20",
  },
  {
    id: "004",
    name: "Rihanna",
    email: "riri@rocnation.com",
    phone: "310-555-0789",
    label: "Roc Nation",
    project: "R9 Album",
    budget: 180000,
    status: "active",
    createdAt: "2023-09-05",
  },
  {
    id: "005",
    name: "Bad Bunny",
    email: "bad@bunny.com",
    phone: "787-555-0321",
    label: "Rimas Entertainment",
    project: "Overdubs & Mixing",
    budget: 60000,
    status: "pending",
    createdAt: "2023-11-01",
  },
  {
    id: "006",
    name: "A$AP Rocky",
    email: "rocky@awge.com",
    phone: "212-555-0654",
    label: "AWGE / RCA",
    project: "Don't Be Dumb",
    budget: 45000,
    status: "active",
    createdAt: "2023-10-15",
  },
  {
    id: "007",
    name: "SZA",
    email: "sza@tde.com",
    phone: "310-555-0987",
    label: "Top Dawg / RCA",
    project: "SOS Deluxe",
    budget: 85000,
    status: "completed",
    createdAt: "2023-07-22",
  },
  {
    id: "008",
    name: "Travis Scott",
    email: "travis@cactusjack.com",
    phone: "713-555-0147",
    label: "Cactus Jack / Epic",
    project: "UTOPIA Sessions",
    budget: 200000,
    status: "completed",
    createdAt: "2023-04-10",
  },
]

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: "B001",
    clientId: "003",
    clientName: "Drake",
    studio: "Studio A",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "22:00",
    engineer: "Noel Cadastre",
    sessionType: "Recording",
    status: "in-progress",
    isVip: true,
    notes: "Full day lockout - No interruptions",
    totalCost: 30000,
  },
  {
    id: "B002",
    clientId: "004",
    clientName: "Rihanna",
    studio: "Studio B",
    date: "2024-01-15",
    startTime: "14:00",
    endTime: "20:00",
    engineer: "Young Guru",
    sessionType: "Recording",
    status: "confirmed",
    totalCost: 18000,
  },
  {
    id: "B003",
    clientId: "002",
    clientName: "The Weeknd",
    studio: "Studio A",
    date: "2024-01-16",
    startTime: "18:00",
    endTime: "02:00",
    engineer: "Illangelo",
    sessionType: "Production",
    status: "confirmed",
    isVip: true,
    totalCost: 25000,
  },
  {
    id: "B004",
    clientId: "006",
    clientName: "A$AP Rocky",
    studio: "Studio B",
    date: "2024-01-16",
    startTime: "12:00",
    endTime: "18:00",
    engineer: "Hector Delgado",
    sessionType: "Mixing",
    status: "pending",
    totalCost: 9000,
  },
  {
    id: "B005",
    clientId: "005",
    clientName: "Bad Bunny",
    studio: "Studio B",
    date: "2024-01-17",
    startTime: "10:00",
    endTime: "16:00",
    engineer: "Tainy",
    sessionType: "Recording",
    status: "confirmed",
    totalCost: 12000,
  },
  {
    id: "B006",
    clientId: "003",
    clientName: "Drake",
    studio: "Studio A",
    date: "2024-01-18",
    startTime: "14:00",
    endTime: "23:00",
    engineer: "40",
    sessionType: "Mixing",
    status: "confirmed",
    isVip: true,
    totalCost: 15000,
  },
]

// Mock Invoices
export const invoices: Invoice[] = [
  {
    id: "INV-001",
    clientId: "003",
    clientName: "Drake",
    amount: 45000,
    status: "paid",
    dueDate: "2024-01-10",
    issuedDate: "2023-12-27",
    items: [
      { description: "Studio A Lockout (3 days)", amount: 30000 },
      { description: "Engineering - Noel Cadastre", amount: 12000 },
      { description: "Equipment Rental", amount: 3000 },
    ],
  },
  {
    id: "INV-002",
    clientId: "004",
    clientName: "Rihanna",
    amount: 28000,
    status: "pending",
    dueDate: "2024-01-25",
    issuedDate: "2024-01-10",
    items: [
      { description: "Studio B Sessions (2 days)", amount: 16000 },
      { description: "Engineering - Young Guru", amount: 10000 },
      { description: "Pro Tools Operator", amount: 2000 },
    ],
  },
  {
    id: "INV-003",
    clientId: "002",
    clientName: "The Weeknd",
    amount: 85000,
    status: "pending",
    dueDate: "2024-02-01",
    issuedDate: "2024-01-12",
    items: [
      { description: "Studio A Lockout (5 days)", amount: 50000 },
      { description: "Production - Illangelo", amount: 25000 },
      { description: "Session Musicians", amount: 10000 },
    ],
  },
  {
    id: "INV-004",
    clientId: "006",
    clientName: "A$AP Rocky",
    amount: 15000,
    status: "overdue",
    dueDate: "2024-01-05",
    issuedDate: "2023-12-20",
    items: [
      { description: "Mixing Sessions (2 days)", amount: 12000 },
      { description: "Assistant Engineer", amount: 3000 },
    ],
  },
  {
    id: "INV-005",
    clientId: "007",
    clientName: "SZA",
    amount: 52000,
    status: "paid",
    dueDate: "2023-12-15",
    issuedDate: "2023-12-01",
    items: [
      { description: "Studio B Sessions (4 days)", amount: 32000 },
      { description: "Vocal Production", amount: 15000 },
      { description: "Equipment Rental", amount: 5000 },
    ],
  },
]

// Mock Staff
export const staff: StaffMember[] = [
  {
    id: "S001",
    name: "Jerry 'Wonda' Duplessis",
    role: "Founder / Producer",
    specialty: "Production",
    status: "in-session",
    currentAssignment: "Studio A (Drake)",
    email: "jerry@platinumsound.com",
    phone: "212-265-6060",
  },
  {
    id: "S002",
    name: "Young Guru",
    role: "Head Engineer",
    specialty: "Mixing / Vocal Production",
    status: "available",
    email: "guru@platinumsound.com",
    phone: "212-265-6061",
  },
  {
    id: "S003",
    name: "Noel Cadastre",
    role: "Senior Engineer",
    specialty: "Tracking / Recording",
    status: "in-session",
    currentAssignment: "Studio A (Drake)",
    email: "noel@platinumsound.com",
    phone: "212-265-6062",
  },
  {
    id: "S004",
    name: "Hector Delgado",
    role: "Engineer",
    specialty: "Hip-Hop / R&B",
    status: "available",
    email: "hector@platinumsound.com",
    phone: "212-265-6063",
  },
  {
    id: "S005",
    name: "Maria Santos",
    role: "Studio Manager",
    specialty: "Operations",
    status: "available",
    email: "maria@platinumsound.com",
    phone: "212-265-6064",
  },
  {
    id: "S006",
    name: "James Chen",
    role: "Assistant Engineer",
    specialty: "Pro Tools / Digital",
    status: "in-session",
    currentAssignment: "Studio B",
    email: "james@platinumsound.com",
    phone: "212-265-6065",
  },
]

// Dashboard stats
export const dashboardStats = {
  totalRevenue: 124500,
  revenueChange: 12,
  activeClients: 6,
  clientsChange: 2,
  activeBookings: 4,
  bookingsChange: 15,
  pendingInvoices: 3,
  pendingAmount: 128000,
}

// Today's sessions for dashboard
export const todaySessions = [
  {
    time: "10:00 AM",
    artist: "Drake",
    studio: "Studio A (Neve)",
    engineer: "Noel Cadastre",
    status: "active" as const,
  },
  {
    time: "02:00 PM",
    artist: "Rihanna",
    studio: "Studio B (SSL)",
    engineer: "Young Guru",
    status: "pending" as const,
  },
  {
    time: "09:00 PM",
    artist: "External Client",
    studio: "Studio B (SSL)",
    engineer: "TBD",
    status: "booked" as const,
  },
]

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  assigneeId?: string
  dueDate?: string
  isRecurring: boolean
  recurrencePattern?: "daily" | "weekly" | "biweekly" | "monthly"
  createdAt: string
}

export const tasks: Task[] = [
  {
    id: "T001",
    title: "Studio A Equipment Check",
    description: "Weekly check of all microphones and preamps",
    status: "todo",
    priority: "medium",
    assignee: "Noel Cadastre",
    isRecurring: true,
    recurrencePattern: "weekly",
    createdAt: "2024-01-10",
  },
  {
    id: "T002",
    title: "Update Website Homepage",
    description: "Add new featured artists and recent projects",
    status: "in_progress",
    priority: "high",
    assignee: "Maria Santos",
    isRecurring: false,
    createdAt: "2024-01-08",
  },
  {
    id: "T003",
    title: "Studio B Calibration",
    description: "Monthly calibration of SSL console and monitors",
    status: "todo",
    priority: "high",
    assignee: "Young Guru",
    isRecurring: true,
    recurrencePattern: "monthly",
    createdAt: "2024-01-05",
  },
  {
    id: "T004",
    title: "Client Follow-up Call",
    description: "Follow up with Drake's team about upcoming sessions",
    status: "completed",
    priority: "medium",
    assignee: "Jerry 'Wonda' Duplessis",
    isRecurring: false,
    createdAt: "2024-01-03",
  },
  {
    id: "T005",
    title: "Inventory Restock",
    description: "Order new XLR cables and microphone stands",
    status: "todo",
    priority: "low",
    assignee: "James Chen",
    isRecurring: false,
    createdAt: "2024-01-12",
  },
  {
    id: "T006",
    title: "Backup All Sessions",
    description: "Create backup of all January sessions to external drive",
    status: "in_progress",
    priority: "high",
    assignee: "James Chen",
    isRecurring: true,
    recurrencePattern: "weekly",
    createdAt: "2024-01-11",
  },
]
