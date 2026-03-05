"use client"

import { useEffect, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { MasterCalendar } from "@/components/master-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { Calendar, Users, Clock, Music, DollarSign, CheckSquare, Wrench } from "lucide-react"

interface Booking {
  id: string
  clientName: string
  date: string
  startTime: string
  endTime: string
  studio: string
  sessionType: string
  status: string
  engineer: string
}

interface Room {
  id: string
  name: string
  status: string
}

interface Engineer {
  id: string
  name: string
  isAvailable?: boolean
}

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assignee?: string
  dueDate?: string
  createdAt: string
}

interface WorkOrder {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  assignedEngineerId?: string
  assignedEngineer?: { name: string }
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Availability {
  id: string
  engineerId: string
  date: string
  status: string
  engineer?: {
    id: string
    name: string
  }
}

export default function CalendarPage() {
  // For now, we'll use a simpler approach without route params
  // The master calendar functionality can be extended later
  const isMasterCalendar = true
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDateDetail, setShowDateDetail] = useState(false)

  // Check if user has master calendar access - simplified for now

  useEffect(() => {
    // First get current user
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setCurrentUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [
          fetch('/api/bookings').then(r => r.ok ? r.json() : []),
          fetch('/api/rooms').then(r => r.ok ? r.json() : []),
          fetch('/api/engineers').then(r => r.ok ? r.json() : []),
          fetch('/api/availability').then(r => r.ok ? r.json() : []),
        ]
        
        // Only fetch tasks and work orders for master calendar
        if (isMasterCalendar) {
          promises.push(
            fetch('/api/tasks').then(r => r.ok ? r.json() : []),
            fetch('/api/work-orders').then(r => r.ok ? r.json() : [])
          )
        }
        
        const results = await Promise.all(promises)
        
        setBookings(results[0] || [])
        setRooms(results[1] || [])
        setEngineers(results[2] || [])
        
        if (isMasterCalendar && results[4]) {
          setTasks(results[3] || [])
          setWorkOrders(results[4] || [])
        }
        // Set availability
        if (results[3]) {
          setAvailability(results[3] || [])
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isMasterCalendar])

  const formattedBookings = bookings.map(b => ({
    ...b,
    date: new Date(b.date),
  }))
  
  // Format tasks with due dates
  const formattedTasks = Array.isArray(tasks)
    ? tasks
        .filter(t => t.dueDate)
        .map(t => ({
          id: t.id,
          title: t.title,
          date: new Date(t.dueDate!),
          type: 'task' as const,
          status: t.status,
          priority: t.priority,
          assignee: t.assignee,
        }))
    : []
  
  // Format work orders (use createdAt as the date)
  const formattedWorkOrders = Array.isArray(workOrders)
    ? workOrders.map(wo => ({
        id: wo.id,
        title: wo.title,
        date: new Date(wo.createdAt),
        type: 'work-order' as const,
        status: wo.status,
        priority: wo.priority,
        assignee: wo.assignedEngineer?.name,
      }))
    : []

  // Filter for personal calendar (non-admin/non-manager users)
  const isAdminOrManager = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER'
  const showMasterCalendar = isMasterCalendar && (isAdminOrManager || currentUser?.role === undefined)
  
  // For personal calendar, filter to show only user's assigned tasks
  const personalTasks = !showMasterCalendar && currentUser
    ? formattedTasks.filter(t => t.assignee === currentUser.name)
    : formattedTasks

  // Get items for selected date (for detail dialog)
  const getDayBookings = (date: Date) => formattedBookings.filter(b => isSameDay(new Date(b.date), date))
  const getDayTasks = (date: Date) => personalTasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date))
  const getDayWorkOrders = (date: Date) => formattedWorkOrders.filter(wo => isSameDay(new Date(wo.createdAt), date))

  if (loading) {
    return (
      <DashboardPageShell className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardPageShell>
    )
  }

  return (
    <DashboardPageShell className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {showMasterCalendar ? 'Master Calendar' : 'My Calendar'}
        </h1>
        <p className="text-muted-foreground">
          {showMasterCalendar 
            ? 'Master calendar view of all bookings, tasks, work orders, and schedules.'
            : 'Your personal calendar showing your assigned tasks and bookings.'}
        </p>
      </div>
      
      <MasterCalendar
        bookings={formattedBookings}
        rooms={rooms}
        engineers={engineers}
        tasks={showMasterCalendar ? [...personalTasks, ...formattedWorkOrders] : personalTasks}
        isMasterCalendar={showMasterCalendar}
        availability={availability}
        onDateSelect={(date) => {
          setSelectedDate(date)
          setShowDateDetail(true)
        }}
      />

      {/* Date Detail Dialog */}
      <Dialog open={showDateDetail} onOpenChange={setShowDateDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDate && (
            <div className="space-y-6">
              {/* Bookings for the day */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Sessions ({getDayBookings(selectedDate).length})
                </h3>
                {getDayBookings(selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No sessions scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {getDayBookings(selectedDate).map(booking => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{booking.clientName}</p>
                            <p className="text-sm text-muted-foreground">{booking.studio} • {booking.sessionType}</p>
                          </div>
                          <Badge variant={booking.status === 'CONFIRMED' ? 'default' : booking.status === 'COMPLETED' ? 'secondary' : 'outline'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {booking.engineer || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tasks for the day */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Tasks ({getDayTasks(selectedDate).length})
                </h3>
                {getDayTasks(selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tasks due</p>
                ) : (
                  <div className="space-y-2">
                    {getDayTasks(selectedDate).map(task => (
                      <div key={task.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.assignee && (
                              <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                            )}
                          </div>
                          <Badge variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Work Orders for the day */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Work Orders ({getDayWorkOrders(selectedDate).length})
                </h3>
                {getDayWorkOrders(selectedDate).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No work orders</p>
                ) : (
                  <div className="space-y-2">
                    {getDayWorkOrders(selectedDate).map(wo => (
                      <div key={wo.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{wo.title}</p>
                            {wo.assignedEngineer && (
                              <p className="text-sm text-muted-foreground">Assigned to: {wo.assignedEngineer.name}</p>
                            )}
                          </div>
                          <Badge variant={wo.priority === 'HIGH' ? 'destructive' : wo.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                            {wo.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Day Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sessions</p>
                    <p className="text-2xl font-bold">{getDayBookings(selectedDate).length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="text-2xl font-bold">{getDayTasks(selectedDate).length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Work Orders</p>
                    <p className="text-2xl font-bold">{getDayWorkOrders(selectedDate).length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground">No bookings found.</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{b.clientName || 'Unknown Client'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.date).toLocaleDateString()} • {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{b.studio}</p>
                    <p className="text-xs text-muted-foreground">{b.engineer}</p>
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
