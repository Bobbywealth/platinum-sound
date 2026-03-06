"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Circle,
  Clock,
  GripVertical,
  LayoutGrid,
  List,
  Plus,
  RotateCw,
} from "lucide-react"
import { useEffect, useState } from "react"

interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: string
  isRecurring: boolean
  recurrencePattern?: "daily" | "weekly" | "biweekly" | "monthly"
  createdAt: string
}

type ViewMode = "kanban" | "list"
type TaskStatus = "todo" | "in_progress" | "completed"

type Priority = "low" | "medium" | "high" | "urgent"
type RecurrencePattern = "daily" | "weekly" | "biweekly" | "monthly"

const statusConfig = {
  todo: { label: "To Do", color: "bg-gray-100 border-gray-300", icon: Circle },
  in_progress: { label: "In Progress", color: "bg-blue-50 border-blue-300", icon: Clock },
  completed: { label: "Completed", color: "bg-green-50 border-green-300", icon: CheckCircle2 },
}

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
}

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskList, setTaskList] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<{id: string, name: string}[]>([])
  
  // Edit/View dialog state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    assignee: "",
    status: "todo" as TaskStatus,
    isRecurring: false,
    recurrencePattern: "weekly" as RecurrencePattern,
  })
  
  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setTaskList(rows.map((t: any) => ({ ...t, status: String(t.status).toLowerCase(), priority: String(t.priority).toLowerCase(), assignee: t.assignee?.name }))))
  }, [])
  
  // Fetch team members for assignee dropdown
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.team) {
          setTeamMembers(data.team.map((m: any) => ({ id: m.id, name: m.name })))
        }
      })
      .catch(() => {})
  }, [])

  const [newTask, setNewTask] = useState<{
    title: string
    description: string
    priority: Priority
    assignee: string
    isRecurring: boolean
    recurrencePattern: RecurrencePattern
  }>({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    isRecurring: false,
    recurrencePattern: "weekly",
  })

  const handleCreateTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority.toUpperCase(),
          status: 'TODO',
          isRecurring: newTask.isRecurring,
          recurrencePattern: newTask.isRecurring ? newTask.recurrencePattern.toUpperCase() : null,
          assigneeName: newTask.assignee || null,
        }),
      })
      
      if (response.ok) {
        const savedTask = await response.json()
        const task: Task = {
          id: savedTask.id,
          title: savedTask.title,
          description: savedTask.description,
          priority: savedTask.priority.toLowerCase(),
          assignee: savedTask.assignee?.name,
          status: savedTask.status.toLowerCase(),
          isRecurring: savedTask.isRecurring,
          recurrencePattern: savedTask.recurrencePattern?.toLowerCase(),
          createdAt: savedTask.createdAt,
        }
        setTaskList([...taskList, task])
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    }
    
    setIsDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      isRecurring: false,
      recurrencePattern: "weekly",
    })
  }

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistically update UI
    setTaskList(taskList.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    
    // Save to database
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      })
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const getTasksByStatus = (status: TaskStatus) =>
    taskList.filter((task) => task.status === status)

  return (
    <DashboardPageShell>
      {/* Header */}
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage studio tasks and workflows</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task for your studio team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: Priority) =>
                        setNewTask({ ...newTask, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      value={newTask.assignee}
                      onValueChange={(value) =>
                        setNewTask({ ...newTask, assignee: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newTask.isRecurring}
                    onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="recurring">Recurring task</Label>
                </div>
                {newTask.isRecurring && (
                  <div className="space-y-2">
                    <Label>Recurrence Pattern</Label>
                    <Select
                      value={newTask.recurrencePattern}
                      onValueChange={(value: RecurrencePattern) =>
                        setNewTask({ ...newTask, recurrencePattern: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Task Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  View and edit task details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editForm.status}
                      onValueChange={(value: TaskStatus) =>
                        setEditForm({ ...editForm, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={editForm.priority}
                      onValueChange={(value: Priority) =>
                        setEditForm({ ...editForm, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select
                    value={editForm.assignee}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, assignee: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-recurring"
                    checked={editForm.isRecurring}
                    onChange={(e) => setEditForm({ ...editForm, isRecurring: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="edit-recurring">Recurring task</Label>
                </div>
                {editForm.isRecurring && (
                  <div className="space-y-2">
                    <Label>Recurrence Pattern</Label>
                    <Select
                      value={editForm.recurrencePattern}
                      onValueChange={(value: RecurrencePattern) =>
                        setEditForm({ ...editForm, recurrencePattern: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter className="justify-between">
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    if (selectedTask && confirm("Are you sure you want to delete this task?")) {
                      try {
                        await fetch(`/api/tasks/${selectedTask.id}`, { method: 'DELETE' })
                        setTaskList(taskList.filter(t => t.id !== selectedTask.id))
                        setIsEditDialogOpen(false)
                      } catch (error) {
                        console.error('Failed to delete task:', error)
                      }
                    }
                  }}
                >
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={async () => {
                      if (!selectedTask || !editForm.title.trim()) return
                      
                      try {
                        const response = await fetch(`/api/tasks/${selectedTask.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: editForm.title,
                            description: editForm.description,
                            priority: editForm.priority.toUpperCase(),
                            status: editForm.status.toUpperCase(),
                            isRecurring: editForm.isRecurring,
                            recurrencePattern: editForm.isRecurring ? editForm.recurrencePattern.toUpperCase() : null,
                          }),
                        })
                        
                        if (response.ok) {
                          const updatedTask = await response.json()
                          setTaskList(taskList.map(t => 
                            t.id === selectedTask.id 
                              ? {
                                  ...t,
                                  title: updatedTask.title,
                                  description: updatedTask.description,
                                  priority: updatedTask.priority.toLowerCase(),
                                  status: updatedTask.status.toLowerCase(),
                                  isRecurring: updatedTask.isRecurring,
                                  recurrencePattern: updatedTask.recurrencePattern?.toLowerCase(),
                                }
                              : t
                          ))
                          setIsEditDialogOpen(false)
                        }
                      } catch (error) {
                        console.error('Failed to update task:', error)
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskList.length}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTasksByStatus("todo").length}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{getTasksByStatus("in_progress").length}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{getTasksByStatus("completed").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid gap-4 md:grid-cols-3">
          {(Object.keys(statusConfig) as TaskStatus[]).map((status) => {
            const config = statusConfig[status]
            const statusTasks = getTasksByStatus(status)
            const StatusIcon = config.icon

            return (
              <div>
                <div className={cn("flex items-center justify-between p-4 rounded-lg border", config.color)}>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    <h3 className="font-semibold">{config.label}</h3>
                  </div>
                  <Badge variant="secondary">{statusTasks.length}</Badge>
                </div>
                <div className="space-y-3 min-h-[400px]">
                  {statusTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedTask(task)
                        setEditForm({
                          title: task.title,
                          description: task.description || "",
                          priority: task.priority,
                          assignee: task.assignee || "",
                          status: task.status,
                          isRecurring: task.isRecurring,
                          recurrencePattern: (task.recurrencePattern as RecurrencePattern) || "weekly",
                        })
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={cn(priorityColors[task.priority])} variant="secondary">
                            {task.priority}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-4 w-4">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                        <h4 className="font-medium mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            {task.assignee && (
                              <span className="flex items-center gap-1">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                  {task.assignee.charAt(0)}
                                </div>
                                {task.assignee}
                              </span>
                            )}
                          </div>
                          {task.isRecurring && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <RotateCw className="h-3 w-3" />
                              {task.recurrencePattern}
                            </span>
                          )}
                        </div>
                        {/* Status Change Buttons */}
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          {status !== "todo" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => updateTaskStatus(task.id, "todo")}
                            >
                              Move to To Do
                            </Button>
                          )}
                          {status !== "in_progress" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => updateTaskStatus(task.id, "in_progress")}
                            >
                              In Progress
                            </Button>
                          )}
                          {status !== "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() => updateTaskStatus(task.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      task.status === "completed" ? "bg-green-100" :
                      task.status === "in_progress" ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : task.status === "in_progress" ? (
                        <Clock className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn("font-medium", task.status === "completed" && "line-through text-muted-foreground")}>
                          {task.title}
                        </p>
                        {task.isRecurring && (
                          <RotateCw className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.assignee && `Assigned to ${task.assignee}`}
                        {task.assignee && task.description && " • "}
                        {task.description && task.description.slice(0, 50)}
                        {task.description && task.description.length > 50 && "..."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={cn(priorityColors[task.priority])} variant="secondary">
                      {task.priority}
                    </Badge>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="text-sm border rounded-md px-2 py-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardPageShell>
  )
}
