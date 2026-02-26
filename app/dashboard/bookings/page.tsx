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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponsiveCalendarGrid } from "@/components/ui/responsive-calendar-grid"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { bookings as initialBookings, type Booking } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  List,
  Mic2,
  Pencil,
  Plus,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"

type ViewMode = "grid" | "list" | "calendar"
type BookingStatus = Booking["status"]

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

function statusBadgeVariant(status: BookingStatus) {
  switch (status) {
    case "confirmed":   return "info"
    case "in-progress": return "success"
    case "pending":     return "warning"
    default:            return "secondary"
  }
}

function formatStatus(status: BookingStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")
}

// ─── Detail / Edit Modal ─────────────────────────────────────────────────────

interface BookingModalProps {
  booking: Booking | null
  mode: "view" | "edit"
  onClose: () => void
  onSave: (updated: Booking) => void
  onStatusChange: (id: string, status: BookingStatus) => void
  onEdit: () => void
}

function BookingModal({
  booking,
  mode,
  onClose,
  onSave,
  onStatusChange,
  onEdit,
}: BookingModalProps) {
  const [form, setForm] = useState<Booking | null>(null)

  useEffect(() => {
    setForm(booking ? { ...booking } : null)
  }, [booking])

  if (!booking || !form) return null

  const handleSave = () => {
    onSave(form)
  }

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Booking" : "Booking Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? `Editing booking ${booking.id}`
              : `Details for booking ${booking.id}`}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          /* ── VIEW MODE ── */
          <div className="space-y-4">
            {/* Client + VIP */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {booking.clientName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-base leading-tight">
                    {booking.clientName}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {booking.isVip && <Badge variant="warning">VIP</Badge>}
                <Badge variant={statusBadgeVariant(booking.status)}>
                  {formatStatus(booking.status)}
                </Badge>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Date</p>
                <p className="font-medium">{booking.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Time</p>
                <p className="font-medium">
                  {booking.startTime} – {booking.endTime}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Studio</p>
                <p className="font-medium">{booking.studio}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-0.5">Session Type</p>
                <p className="font-medium">{booking.sessionType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-0.5">Engineer</p>
                <p className="font-medium">{booking.engineer}</p>
              </div>
              {booking.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-0.5">Notes</p>
                  <p className="text-sm italic border rounded-md p-2 bg-muted/30">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Status change */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Change Status
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant={booking.status === s.value ? "default" : "outline"}
                    onClick={() => onStatusChange(booking.id, s.value)}
                    className="h-7 text-xs"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── EDIT MODE ── */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editClient">Client Name</Label>
                <Input
                  id="editClient"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editDate">Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStudio">Studio</Label>
                <Select
                  value={form.studio}
                  onValueChange={(v) =>
                    setForm({ ...form, studio: v as Booking["studio"] })
                  }
                >
                  <SelectTrigger id="editStudio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Studio A">Studio A</SelectItem>
                    <SelectItem value="Studio B">Studio B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editStart">Start Time</Label>
                <Input
                  id="editStart"
                  type="time"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editEnd">End Time</Label>
                <Input
                  id="editEnd"
                  type="time"
                  value={form.endTime}
                  onChange={(e) =>
                    setForm({ ...form, endTime: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editEngineer">Engineer</Label>
                <Input
                  id="editEngineer"
                  value={form.engineer}
                  onChange={(e) =>
                    setForm({ ...form, engineer: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editSessionType">Session Type</Label>
                <Select
                  value={form.sessionType}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      sessionType: v as Booking["sessionType"],
                    })
                  }
                >
                  <SelectTrigger id="editSessionType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      ["Recording", "Mixing", "Mastering", "Production"] as const
                    ).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as BookingStatus })
                  }
                >
                  <SelectTrigger id="editStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={form.notes ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={2}
                  placeholder="Optional notes…"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {mode === "view" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Booking
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onEdit}>
                {/* back to view */}
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main page (needs useSearchParams → wrapped in Suspense) ──────────────────

function BookingsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [bookingsList, setBookingsList] =
    useState<Booking[]>(initialBookings)
  const [filter, setFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15))

  // Modal state
  const [modalBookingId, setModalBookingId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")

  // Sync modal with ?id= URL param
  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setModalBookingId(id)
      setModalMode("view")
    } else {
      setModalBookingId(null)
    }
  }, [searchParams])

  const openBooking = useCallback(
    (id: string) => {
      router.replace(`?id=${id}`, { scroll: false })
    },
    [router]
  )

  const closeBooking = useCallback(() => {
    router.replace("?", { scroll: false })
    setModalMode("view")
  }, [router])

  const handleStatusChange = useCallback(
    (id: string, status: BookingStatus) => {
      setBookingsList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      )
    },
    []
  )

  const handleSave = useCallback((updated: Booking) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    )
    setModalMode("view")
  }, [])

  const activeBooking =
    modalBookingId
      ? bookingsList.find((b) => b.id === modalBookingId) ?? null
      : null

  const filteredBookings =
    filter === "all"
      ? bookingsList
      : bookingsList.filter((b) => b.status === filter)

  const stats = {
    total: bookingsList.length,
    confirmed: bookingsList.filter((b) => b.status === "confirmed").length,
    pending: bookingsList.filter((b) => b.status === "pending").length,
    inProgress: bookingsList.filter((b) => b.status === "in-progress").length,
  }

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getBookingsForDate = (date: number) => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const dateStr = `${year}-${month}-${String(date).padStart(2, "0")}`
    return filteredBookings.filter((b) => b.date === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  // Shared status badge + edit button row used in both grid and list cards
  const BookingActions = ({ booking }: { booking: Booking }) => (
    <div className="flex items-center gap-2">
      <Select
        value={booking.status}
        onValueChange={(v) =>
          handleStatusChange(booking.id, v as BookingStatus)
        }
      >
        <SelectTrigger className="h-7 text-xs w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value} className="text-xs">
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2"
        onClick={() => {
          openBooking(booking.id)
          setModalMode("edit")
        }}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6 bg-[#FAFAF8] min-h-screen p-4 sm:p-6">
      {/* Detail / Edit Modal */}
      <BookingModal
        booking={activeBooking}
        mode={modalMode}
        onClose={closeBooking}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
        onEdit={() =>
          setModalMode((m) => (m === "view" ? "edit" : "view"))
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bookings
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage studio session bookings
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
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
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/dashboard/bookings/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New Booking</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setFilter("all")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setFilter("confirmed")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <div className="w-2 h-2 rounded-full bg-royal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal">
              {stats.confirmed}
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setFilter("pending")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setFilter("in-progress")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {["all", "confirmed", "pending", "in-progress", "completed", "cancelled"].map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() +
                  status.slice(1).replace("-", " ")}
            </Button>
          )
        )}
      </div>

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className={cn(
                "hover:border-primary/50 transition-colors",
                booking.isVip && "border-primary/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle
                      className={booking.isVip ? "text-primary" : ""}
                    >
                      {booking.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {booking.studio}
                    </p>
                  </div>
                  {booking.isVip && <Badge variant="warning">VIP</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.engineer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mic2 className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.sessionType}</span>
                </div>
                {booking.notes && (
                  <p className="text-xs text-muted-foreground italic border-t pt-2">
                    {booking.notes}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2 border-t flex-wrap gap-2">
                  <BookingActions booking={booking} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      openBooking(booking.id)
                      setModalMode("view")
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 overflow-x-auto">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {booking.clientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{booking.clientName}</p>
                        {booking.isVip && (
                          <Badge variant="warning" className="text-xs">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.studio} • {booking.sessionType}
                      </p>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:flex items-center gap-4 flex-wrap">
                    <div className="text-center">
                      <p className="text-sm font-medium">{booking.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{booking.engineer}</p>
                      <p className="text-xs text-muted-foreground">Engineer</p>
                    </div>
                    <BookingActions booking={booking} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        openBooking(booking.id)
                        setModalMode("view")
                      }}
                    >
                      View
                    </Button>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Date & Time
                        </p>
                        <p className="font-medium">{booking.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Engineer
                        </p>
                        <p className="font-medium">{booking.engineer}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t flex-wrap gap-2">
                      <BookingActions booking={booking} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          openBooking(booking.id)
                          setModalMode("view")
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Calendar View ── */}
      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(2024, 0, 15))}
                >
                  Today
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveCalendarGrid
              weekdayHeader={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div
                    key={day}
                    className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
                  >
                    <span className="sm:hidden">{day[0]}</span>
                    <span className="hidden sm:inline">{day}</span>
                  </div>
                )
              )}
            >
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-20 sm:h-24 p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayBookings = getBookingsForDate(day)
                const isToday = day === 15 // demo marker
                return (
                  <div
                    key={day}
                    className={cn(
                      "h-20 sm:h-24 p-1 border rounded-lg transition-colors",
                      isToday && "border-primary bg-primary/5",
                      dayBookings.length > 0 && "hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "text-xs font-medium mb-1",
                        isToday && "text-primary"
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <button
                          key={booking.id}
                          className={cn(
                            "text-xs p-1 rounded truncate w-full text-left",
                            booking.status === "confirmed" &&
                              "bg-royal/10 text-royal",
                            booking.status === "in-progress" &&
                              "bg-green-500/10 text-green-600",
                            booking.status === "pending" &&
                              "bg-yellow-500/10 text-yellow-600"
                          )}
                          onClick={() => {
                            openBooking(booking.id)
                            setModalMode("view")
                          }}
                        >
                          <span className="font-medium">
                            {booking.startTime}
                          </span>{" "}
                          {booking.clientName}
                        </button>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </ResponsiveCalendarGrid>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-royal/20" />
                <span className="text-xs text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/20" />
                <span className="text-xs text-muted-foreground">
                  In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500/20" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function BookingsPage() {
  return (
    <Suspense>
      <BookingsPageInner />
    </Suspense>
  )
}
