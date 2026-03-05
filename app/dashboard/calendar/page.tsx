"use client"

import { useEffect, useState } from "react"
import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { MasterCalendar } from "@/components/master-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function CalendarPage() {
  // For now, we'll use a simpler approach without route params
  // The master calendar functionality can be extended later
  const isMasterCalendar = true
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
        
        if (isMasterCalendar && results[3]) {
          setTasks(results[3] || [])
          setWorkOrders(results[4] || [])
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
  const formattedTasks = tasks
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
  
  // Format work orders (use createdAt as the date)
  const formattedWorkOrders = workOrders.map(wo => ({
    id: wo.id,
    title: wo.title,
    date: new Date(wo.createdAt),
    type: 'work-order' as const,
    status: wo.status,
    priority: wo.priority,
    assignee: wo.assignedEngineer?.name,
  }))

  // Filter for personal calendar (non-admin/non-manager users)
  const isAdminOrManager = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER'
  const showMasterCalendar = isMasterCalendar && (isAdminOrManager || currentUser?.role === undefined)
  
  // For personal calendar, filter to show only user's assigned tasks
  const personalTasks = !showMasterCalendar && currentUser
    ? formattedTasks.filter(t => t.assignee === currentUser.name)
    : formattedTasks

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
      />

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
