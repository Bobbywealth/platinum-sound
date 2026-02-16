"use client"

import { DashboardPageShell } from "@/components/dashboard-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Bell,
    Calendar,
    Check,
    CheckCheck,
    DollarSign,
    FileText,
    Filter,
    LogIn,
    LogOut,
    Mail,
    Music,
    Search,
    Trash2,
    User,
    UserPlus,
    Users,
    X,
    Building,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Notification types and their configurations
const NOTIFICATION_TYPES: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    NEW_BOOKING: { icon: Calendar, color: "bg-green-500", label: "New Booking" },
    BOOKING_CONFIRMED: { icon: CheckCircle, color: "bg-blue-500", label: "Booking Confirmed" },
    BOOKING_CANCELLED: { icon: XCircle, color: "bg-red-500", label: "Booking Cancelled" },
    PAYMENT_RECEIVED: { icon: DollarSign, color: "bg-green-500", label: "Payment Received" },
    PAYMENT_OVERDUE: { icon: AlertCircle, color: "bg-red-500", label: "Payment Overdue" },
    INVOICE_CREATED: { icon: FileText, color: "bg-yellow-500", label: "Invoice Created" },
    CHECK_IN: { icon: LogIn, color: "bg-green-500", label: "Check-in" },
    CHECK_OUT: { icon: LogOut, color: "bg-gray-500", label: "Check-out" },
    SESSION_COMPLETE: { icon: Music, color: "bg-purple-500", label: "Session Complete" },
    CLIENT_ADDED: { icon: UserPlus, color: "bg-blue-500", label: "Client Added" },
    STAFF_ASSIGNED: { icon: Users, color: "bg-indigo-500", label: "Staff Assigned" },
    STUDIO_UPDATE: { icon: Building, color: "bg-orange-500", label: "Studio Update" },
    MARKETING_CAMPAIGN: { icon: Mail, color: "bg-pink-500", label: "Marketing Campaign" },
}

// Destination URLs for each notification type
const NOTIFICATION_DESTINATIONS: Record<string, string> = {
    NEW_BOOKING: "/dashboard/bookings",
    BOOKING_CONFIRMED: "/dashboard/bookings",
    BOOKING_CANCELLED: "/dashboard/bookings",
    PAYMENT_RECEIVED: "/dashboard/invoices",
    PAYMENT_OVERDUE: "/dashboard/invoices",
    INVOICE_CREATED: "/dashboard/invoices",
    CHECK_IN: "/dashboard/check-in",
    CHECK_OUT: "/dashboard/bookings",
    SESSION_COMPLETE: "/dashboard/bookings",
    CLIENT_ADDED: "/dashboard/clients",
    STAFF_ASSIGNED: "/dashboard/teams",
    STUDIO_UPDATE: "/dashboard/studios",
    MARKETING_CAMPAIGN: "/dashboard/marketing",
}

interface Notification {
    id: string
    type: string
    title: string
    message: string
    time: string
    read: boolean
    timestamp: Date
}

// Extended mock notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "NEW_BOOKING",
        title: "New Booking Request",
        message: "John Doe requested Studio A for tomorrow at 2 PM",
        time: "5 min ago",
        read: false,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
        id: "2",
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        message: "Invoice #1234 has been paid by Acme Corp ($500.00)",
        time: "1 hour ago",
        read: false,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
        id: "3",
        type: "CHECK_IN",
        title: "Client Check-in",
        message: "Sarah Smith has checked in for their recording session",
        time: "2 hours ago",
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: "4",
        type: "SESSION_COMPLETE",
        title: "Session Complete",
        message: "Recording session in Studio B has been marked as complete",
        time: "3 hours ago",
        read: true,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
        id: "5",
        type: "CLIENT_ADDED",
        title: "New Client",
        message: "Mike Johnson has been added to your client list",
        time: "5 hours ago",
        read: true,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: "6",
        type: "INVOICE_CREATED",
        title: "Invoice Created",
        message: "Invoice #5678 has been created for TechStart Inc",
        time: "Yesterday",
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: "7",
        type: "STAFF_ASSIGNED",
        title: "Staff Assigned",
        message: "Engineer Alex Chen assigned to Studio B session",
        time: "Yesterday",
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: "8",
        type: "PAYMENT_OVERDUE",
        title: "Payment Overdue",
        message: "Invoice #1200 for SoundWave Studios is now overdue",
        time: "2 days ago",
        read: true,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
        id: "9",
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        message: "Rock Band XYZ confirmed their Studio A booking for Friday",
        time: "2 days ago",
        read: true,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
    {
        id: "10",
        type: "MARKETING_CAMPAIGN",
        title: "Campaign Sent",
        message: "Your 'Summer Session' email campaign has been sent to 500 clients",
        time: "3 days ago",
        read: true,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    },
    {
        id: "11",
        type: "STUDIO_UPDATE",
        title: "Studio Maintenance",
        message: "Studio B will undergo maintenance next Monday",
        time: "3 days ago",
        read: true,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    },
    {
        id: "12",
        type: "BOOKING_CANCELLED",
        title: "Booking Cancelled",
        message: "Jazz Trio cancelled their Studio A booking for Saturday",
        time: "4 days ago",
        read: true,
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
    },
]

// Animation variants
const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.03, duration: 0.2 },
    }),
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    // Filter notifications based on selected filters
    const filteredNotifications = notifications.filter((n) => {
        // Search filter
        if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !n.message.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false
        }

        // Read/unread filter
        if (filter === "unread" && n.read) return false
        if (filter === "read" && !n.read) return false

        // Type filter
        if (typeFilter !== "all" && n.type !== typeFilter) return false

        return true
    })

    const unreadCount = notifications.filter((n) => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const clearAll = () => {
        setNotifications([])
    }

    return (
        <DashboardPageShell>
            {/* Header */}
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        Stay updated with your studio activity
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button variant="ghost" onClick={clearAll} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("all")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notifications.length}</div>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("unread")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread</CardTitle>
                        <div className="w-2 h-2 rounded-full bg-[#C4A77D]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#C4A77D]">{unreadCount}</div>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter("read")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Read</CardTitle>
                        <Check className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-56 md:w-72">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                    <value.icon className="h-4 w-4" />
                                    {value.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 border-b pb-2">
                {(["all", "unread", "read"] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter(f)}
                        className="rounded-b-none"
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === "unread" && unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                                {unreadCount}
                            </Badge>
                        )}
                    </Button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => {
                            const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.NEW_BOOKING
                            const Icon = typeConfig.icon
                            const href = NOTIFICATION_DESTINATIONS[notification.type] || "/dashboard"

                            return (
                                <motion.div
                                    key={notification.id}
                                    custom={index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit={{ opacity: 0, x: -20 }}
                                    layout
                                >
                                    <Link
                                        href={href}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`block p-4 rounded-lg border transition-all hover:shadow-md ${
                                            notification.read
                                                ? "bg-white hover:bg-gray-50"
                                                : "bg-white border-l-4 border-l-[#C4A77D]"
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full ${typeConfig.color} bg-opacity-10`}>
                                                <Icon className={`h-5 w-5 ${typeConfig.color.replace("bg-", "text-")}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 rounded-full bg-[#C4A77D]" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-gray-400">{notification.time}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {typeConfig.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            markAsRead(notification.id)
                                                        }}
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        deleteNotification(notification.id)
                                                    }}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                            <p className="text-gray-500">
                                {searchQuery || typeFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "You're all caught up!"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardPageShell>
    )
}
