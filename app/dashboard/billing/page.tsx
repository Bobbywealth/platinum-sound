"use client"

import { useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  TrendingUp, 
  UserPlus, 
  Banknote, 
  RotateCcw, 
  Wallet,
  RefreshCw, 
  Printer, 
  Plus,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"

// Mock data for the billing dashboard
const mockMetrics = {
  totalRevenue: 12580,
  mrr: 1173,
  activeSubscribers: 3,
  grossVolume: 15200,
  newCustomers: 12,
  totalPayouts: 15,
  refunded: 0,
  availableBalance: 143.19,
}

const mockTopCustomers = [
  { id: "1", name: "Shakira", company: "Musk Music", spend: 5200 },
  { id: "2", name: "Wyclef Jean", company: "Carnival Records", spend: 3800 },
  { id: "3", name: "French Montana", company: "Cokeworld", spend: 2400 },
  { id: "4", name: "A$AP Rocky", company: "AWGE", spend: 1800 },
]

const mockPaymentStatus = [
  { status: "Succeeded", value: 45, color: "bg-green-500" },
  { status: "Pending", value: 8, color: "bg-yellow-500" },
  { status: "Failed", value: 3, color: "bg-red-500" },
  { status: "Refunded", value: 2, color: "bg-orange-500" },
]

const mockRecentCharges = [
  { id: "ch_1", customer: "Shakira", amount: 5200, date: "2026-03-05", status: "succeeded" },
  { id: "ch_2", customer: "Wyclef Jean", amount: 2400, date: "2026-03-04", status: "succeeded" },
  { id: "ch_3", customer: "French Montana", amount: 1800, date: "2026-03-03", status: "succeeded" },
  { id: "ch_4", customer: "A$AP Rocky", amount: 1200, date: "2026-03-02", status: "succeeded" },
]

const mockRecentPayouts = [
  { id: "po_1", amount: 15.00, currency: "USD", status: "paid", arrivalDate: "2026-02-28", createdAt: "5 days ago" },
  { id: "po_2", amount: 250.00, currency: "USD", status: "paid", arrivalDate: "2026-02-21", createdAt: "12 days ago" },
  { id: "po_3", amount: 500.00, currency: "USD", status: "paid", arrivalDate: "2026-02-14", createdAt: "19 days ago" },
]

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Metric Card Component
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  gradient 
}: { 
  icon: any, 
  label: string, 
  value: string | number, 
  subtext?: string,
  gradient?: string
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${gradient || 'bg-primary/10'}`}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Status Breakdown Row
function StatusRow({ status, value, color, bgColor }: { status: string, value: number, color: string, bgColor: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="font-medium">{status}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

// Recent Charge Row
function ChargeRow({ charge }: { charge: typeof mockRecentCharges[0] }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{charge.customer}</p>
          <p className="text-xs text-muted-foreground">{charge.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCurrency(charge.amount)}</p>
        <div className="flex items-center gap-1 justify-end">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600">Succeeded</span>
        </div>
      </div>
    </div>
  )
}

// Recent Payout Row
function PayoutRow({ payout }: { payout: typeof mockRecentPayouts[0] }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
            {payout.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Arrival: {payout.arrivalDate}</p>
        <p className="text-xs text-muted-foreground">Created: {payout.createdAt}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg">{formatCurrency(payout.amount)}</p>
        <p className="text-xs text-muted-foreground">{payout.currency}</p>
      </div>
    </div>
  )
}

// Top Customer Row
function CustomerRow({ customer, rank }: { customer: typeof mockTopCustomers[0], rank: number }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          rank === 1 ? 'bg-yellow-500/20 text-yellow-600' :
          rank === 2 ? 'bg-gray-400/20 text-gray-600' :
          rank === 3 ? 'bg-orange-500/20 text-orange-600' :
          'bg-muted text-muted-foreground'
        }`}>
          {rank}
        </div>
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-xs text-muted-foreground">{customer.company}</p>
        </div>
      </div>
      <p className="font-semibold">{formatCurrency(customer.spend)}</p>
    </div>
  )
}

export default function BillingPage() {
  const [dateRange, setDateRange] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleOpenStripe = () => {
    window.open('https://dashboard.stripe.com', '_blank')
  }

  return (
    <DashboardPageShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices & Billing</h1>
            <p className="text-muted-foreground mt-1">Real-time Stripe analytics and payment management</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            icon={DollarSign}
            label="Total Revenue"
            value={formatCurrency(mockMetrics.totalRevenue)}
            gradient="bg-green-500/10"
          />
          <MetricCard 
            icon={TrendingUp}
            label="MRR"
            value={formatCurrency(mockMetrics.mrr)}
            subtext="Monthly Recurring"
            gradient="bg-blue-500/10"
          />
          <MetricCard 
            icon={Users}
            label="Active Subscribers"
            value={mockMetrics.activeSubscribers}
            gradient="bg-purple-500/10"
          />
          <MetricCard 
            icon={CreditCard}
            label="Gross Volume"
            value={formatCurrency(mockMetrics.grossVolume)}
            gradient="bg-indigo-500/10"
          />
          <MetricCard 
            icon={UserPlus}
            label="New Customers"
            value={mockMetrics.newCustomers}
            subtext="This period"
            gradient="bg-teal-500/10"
          />
          <MetricCard 
            icon={Banknote}
            label="Total Payouts"
            value={formatCurrency(mockMetrics.totalPayouts)}
            gradient="bg-amber-500/10"
          />
          <MetricCard 
            icon={RotateCcw}
            label="Refunded"
            value={formatCurrency(mockMetrics.refunded)}
            gradient="bg-red-500/10"
          />
          <MetricCard 
            icon={Wallet}
            label="Available Balance"
            value={formatCurrency(mockMetrics.availableBalance)}
            gradient="bg-emerald-500/10"
          />
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Customers by Spend</CardTitle>
              <CardDescription>Highest paying customers this period</CardDescription>
            </CardHeader>
            <CardContent>
              {mockTopCustomers.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {mockTopCustomers.map((customer, index) => (
                    <CustomerRow key={customer.id} customer={customer} rank={index + 1} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customer data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status Breakdown Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Status Breakdown</CardTitle>
              <CardDescription>Overview of payment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <StatusRow status="Succeeded" value={45} color="bg-green-500" bgColor="bg-green-500/10" />
                <StatusRow status="Pending" value={8} color="bg-yellow-500" bgColor="bg-yellow-500/10" />
                <StatusRow status="Failed" value={3} color="bg-red-500" bgColor="bg-red-500/10" />
                <StatusRow status="Refunded" value={2} color="bg-orange-500" bgColor="bg-orange-500/10" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lower Sections - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Charges Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Charges</CardTitle>
              <CardDescription>Latest successful payments</CardDescription>
            </CardHeader>
            <CardContent>
              {mockRecentCharges.length > 0 ? (
                <div className="divide-y divide-border/30 -mx-2">
                  {mockRecentCharges.map((charge) => (
                    <ChargeRow key={charge.id} charge={charge} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent charges</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payouts Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Payouts</CardTitle>
              <CardDescription>Money transferred to your bank account</CardDescription>
            </CardHeader>
            <CardContent>
              {mockRecentPayouts.length > 0 ? (
                <div className="divide-y divide-border/30 -mx-2">
                  {mockRecentPayouts.map((payout) => (
                    <PayoutRow key={payout.id} payout={payout} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Banknote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent payouts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stripe CTA Card */}
        <Card className="bg-gradient-to-r from-violet-600 to-indigo-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">View Full Stripe Dashboard</h3>
                <p className="text-white/80 mt-1">
                  Access detailed analytics, reports, and settings in your Stripe account
                </p>
              </div>
              <Button 
                onClick={handleOpenStripe}
                className="bg-white text-violet-600 hover:bg-white/90 shrink-0"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Stripe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  )
}
