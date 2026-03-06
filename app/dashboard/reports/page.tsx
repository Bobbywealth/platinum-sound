"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  BarChart3, 
  Calendar, 
  Mail, 
  Plus, 
  Trash2, 
  Play,
  Clock,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { format } from "date-fns"

type Booking = { 
  id: string; 
  status: string
  date: string
  client?: { name: string }
  rooms?: { room: { name: string } }[]
}
type Invoice = { id: string; amount: number; status: string }
type ScheduledReport = {
  id: string
  name: string
  reportType: string
  period: string
  frequency: string
  recipients: string[]
  enabled: boolean
  lastSentAt: string | null
  nextSendAt: string
  createdAt: string
}

type ReportData = {
  data?: {
    summary?: {
      totalBookings: number
      completedBookings: number
      cancelledBookings: number
      pendingBookings: number
      confirmedBookings: number
      totalRevenue: number
    }
    roomUtilization?: Record<string, number>
  }
}

export default function ReportsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [reportType, setReportType] = useState<string>("END_OF_DAY")
  const [reportPeriod, setReportPeriod] = useState<string>("DAILY")
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    reportType: "END_OF_DAY",
    period: "DAILY",
    frequency: "DAILY",
    recipients: ""
  })

  useEffect(() => {
    fetch('/api/bookings').then(r => r.ok ? r.json() : []).then(setBookings)
    fetch('/api/invoices').then(r => r.ok ? r.json() : []).then(setInvoices)
    fetchScheduledReports()
  }, [])

  const fetchScheduledReports = async () => {
    try {
      const res = await fetch('/api/scheduled-reports')
      if (res.ok) {
        const data = await res.json()
        setScheduledReports(data)
      }
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports?type=${reportType}&date=${reportDate}`)
      if (res.ok) {
        const data = await res.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setLoading(false)
    }
  }

  const createScheduledReport = async () => {
    try {
      const res = await fetch('/api/scheduled-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSchedule,
          recipients: newSchedule.recipients.split(',').map(e => e.trim()).filter(Boolean)
        })
      })
      if (res.ok) {
        setShowScheduleDialog(false)
        setNewSchedule({
          name: "",
          reportType: "END_OF_DAY",
          period: "DAILY",
          frequency: "DAILY",
          recipients: ""
        })
        fetchScheduledReports()
      }
    } catch (error) {
      console.error('Failed to create scheduled report:', error)
    }
  }

  const toggleScheduledReport = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/scheduled-reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled })
      })
      if (res.ok) {
        fetchScheduledReports()
      }
    } catch (error) {
      console.error('Failed to toggle scheduled report:', error)
    }
  }

  const deleteScheduledReport = async (id: string) => {
    try {
      const res = await fetch(`/api/scheduled-reports?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchScheduledReports()
      }
    } catch (error) {
      console.error('Failed to delete scheduled report:', error)
    }
  }

  const paidRevenue = useMemo(() => 
    invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0), 
  [invoices])

  return (
    <DashboardPageShell className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Reports
          </h1>
          <p className="text-muted-foreground">Generate and schedule reports</p>
        </div>
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule a Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Report Name</Label>
                <Input 
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                  placeholder="Daily Summary Report" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Report Type</Label>
                  <Select value={newSchedule.reportType} onValueChange={(v) => setNewSchedule({...newSchedule, reportType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="END_OF_DAY">End of Day</SelectItem>
                      <SelectItem value="WEEKLY_SESSION_LOG">Weekly Session Log</SelectItem>
                      <SelectItem value="MONTHLY_SUMMARY">Monthly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period</Label>
                  <Select value={newSchedule.period} onValueChange={(v) => setNewSchedule({...newSchedule, period: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={newSchedule.frequency} onValueChange={(v) => setNewSchedule({...newSchedule, frequency: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Recipients (comma-separated emails)</Label>
                <Input 
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({...newSchedule, recipients: e.target.value})}
                  placeholder="email1@example.com, email2@example.com" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
              <Button onClick={createScheduledReport} disabled={!newSchedule.name || !newSchedule.recipients}>
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Generate Report Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-48">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="END_OF_DAY">End of Day</SelectItem>
                  <SelectItem value="WEEKLY_SESSION_LOG">Weekly Session Log</SelectItem>
                  <SelectItem value="MONTHLY_SUMMARY">Monthly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label>Date</Label>
              <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Label>Period</Label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </div>

          {reportData && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.data?.summary?.totalBookings || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{reportData.data?.summary?.completedBookings || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(reportData.data?.summary?.totalRevenue || 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(() => {
                      const util = reportData.data?.roomUtilization || {}
                      const vals = Object.values(util)
                      return vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(0) : 0
                    })()}%
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards (always visible) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter(i => i.status === 'PENDING').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'COMPLETED').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduledReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled reports yet</p>
              <p className="text-sm">Create a schedule to receive reports automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.name}</span>
                      <Badge variant={report.enabled ? "default" : "secondary"}>
                        {report.enabled ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.reportType} • {report.frequency} • Next: {format(new Date(report.nextSendAt), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3" />
                      {report.recipients.join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleScheduledReport(report.id, !report.enabled)}
                    >
                      {report.enabled ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteScheduledReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  )
}
