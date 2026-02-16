"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResponsiveChartShell } from '@/components/ui/responsive-chart-shell'
import { ResponsiveTableShell } from '@/components/ui/responsive-table-shell'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, Download, Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface ReportData {
  type: string
  period: string
  startDate: Date
  endDate: Date
  data: {
    summary: {
      totalBookings: number
      completedBookings: number
      cancelledBookings: number
      pendingBookings: number
      confirmedBookings: number
      totalRevenue: number
    }
    bookings: any[]
    roomUtilization: {
      room: string
      totalHours: number
      availableHours: number
      utilizationRate: number
    }[]
    engineerHours: {
      name: string
      hours: number
      sessions: number
    }[]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>('END_OF_DAY')
  const [reportDate, setReportDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [report, setReport] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/reports?type=${reportType}&date=${reportDate}`)
      if (res.ok) {
        const data = await res.json()
        setReport({
          ...data,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        })
      } else {
        throw new Error('Failed to generate report')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    if (!report) return
    
    const reportText = `
PLATINUM SOUND STUDIOS - ${report.type.replace(/_/g, ' ')}
Period: ${format(report.startDate, 'MMMM d, yyyy')} - ${format(report.endDate, 'MMMM d, yyyy')}
Generated: ${format(new Date(), 'MMMM d, yyyy h:mm a')}

SUMMARY
=======
Total Bookings: ${report.data.summary.totalBookings}
Completed: ${report.data.summary.completedBookings}
Pending: ${report.data.summary.pendingBookings}
Confirmed: ${report.data.summary.confirmedBookings}
Cancelled: ${report.data.summary.cancelledBookings}
Total Revenue: $${report.data.summary.totalRevenue.toFixed(2)}

ROOM UTILIZATION
================
${report.data.roomUtilization.map(r => 
  `${r.room}: ${r.utilizationRate.toFixed(1)}% (${r.totalHours}/${r.availableHours} hours)`
).join('\n')}

ENGINEER HOURS
==============
${report.data.engineerHours.map(e => 
  `${e.name}: ${e.hours} hours (${e.sessions} sessions)`
).join('\n')}

BOOKINGS
========
${report.data.bookings.map(b => 
  `${b.clientName} | ${format(new Date(b.date), 'MMM d')} | ${b.startTime}-${b.endTime} | ${b.studio} | ${b.status}`
).join('\n')}
    `
    
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `platinum-sound-report-${format(report.startDate, 'yyyy-MM-dd')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 bg-[#FAFAF8] min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Reports
          </h1>
          <p className="text-muted-foreground">
            Generate end-of-day and weekly session reports
          </p>
        </div>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="END_OF_DAY">End of Day Report</SelectItem>
                  <SelectItem value="WEEKLY_SESSION_LOG">Weekly Session Log</SelectItem>
                  <SelectItem value="MONTHLY_SUMMARY">Monthly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={generateReport} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
              
              {report && (
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.data.summary.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {report.data.summary.confirmedBookings} confirmed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${report.data.summary.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  From {report.data.summary.completedBookings} completed sessions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.data.summary.totalBookings > 0 
                    ? ((report.data.summary.completedBookings / report.data.summary.totalBookings) * 100).toFixed(1)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.data.summary.cancelledBookings} cancelled
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engineer Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {report.data.engineerHours.reduce((sum, e) => sum + e.hours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total logged hours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Room Utilization Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Room Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChartShell>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.data.roomUtilization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="room" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="utilizationRate" fill="#8884d8" name="Utilization %" />
                    </BarChart>
                  </ResponsiveContainer>
                </ResponsiveChartShell>
              </CardContent>
            </Card>

            {/* Engineer Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Engineer Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChartShell>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.data.engineerHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#82ca9d" name="Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </ResponsiveChartShell>
              </CardContent>
            </Card>
          </div>

          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveChartShell
                chartClassName="h-64 sm:h-72"
                legend={[
                  'Completed',
                  'Confirmed',
                  'Pending',
                  'Cancelled',
                ].map((name, index) => (
                  <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    {name}
                  </span>
                ))}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: report.data.summary.completedBookings },
                        { name: 'Confirmed', value: report.data.summary.confirmedBookings },
                        { name: 'Pending', value: report.data.summary.pendingBookings },
                        { name: 'Cancelled', value: report.data.summary.cancelledBookings },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ResponsiveChartShell>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableShell tableMinWidthClassName="min-w-[760px]" stickyFirstColumn>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>
                      <span className="sm:hidden">Session</span>
                      <span className="hidden sm:inline">Type</span>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.bookings.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{booking.clientName}</TableCell>
                      <TableCell>{format(new Date(booking.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                      <TableCell>{booking.studio}</TableCell>
                      <TableCell>{booking.sessionType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${booking.totalPaid.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </ResponsiveTableShell>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
