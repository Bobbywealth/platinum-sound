"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import {
    Bell,
    LogOut,
    Search,
    Settings,
    User,
    X
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface SearchResult {
  type: string
  title: string
  subtitle: string
  href: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
  href: string
}

// Mock notifications - in production, fetch from API
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "NEW_BOOKING",
    title: "New Booking",
    message: "John Doe booked Studio A for tomorrow at 2 PM",
    time: "5 min ago",
    read: false,
    href: "/dashboard/bookings",
  },
  {
    id: "2",
    type: "PAYMENT_RECEIVED",
    title: "Payment Received",
    message: "Invoice #1234 has been paid by Acme Corp",
    time: "1 hour ago",
    read: false,
    href: "/dashboard/invoices",
  },
  {
    id: "3",
    type: "CHECK_IN",
    title: "Client Check-in",
    message: "Sarah Smith has checked in for their session",
    time: "2 hours ago",
    read: false,
    href: "/dashboard/check-in",
  },
  {
    id: "4",
    type: "SESSION_COMPLETE",
    title: "Session Complete",
    message: "Recording session in Studio B has completed",
    time: "3 hours ago",
    read: true,
    href: "/dashboard/bookings",
  },
  {
    id: "5",
    type: "CLIENT_ADDED",
    title: "New Client",
    message: "Mike Johnson has been added to your client list",
    time: "5 hours ago",
    read: true,
    href: "/dashboard/clients",
  },
  {
    id: "6",
    type: "INVOICE_CREATED",
    title: "Invoice Created",
    message: "Invoice #5678 has been created for TechStart Inc",
    time: "Yesterday",
    read: true,
    href: "/dashboard/invoices",
  },
]

// Animation variants
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeIn" as const,
    },
  },
}

const notificationItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
}

const searchResultVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.15,
    },
  }),
}

export default function DashboardHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 1) return "Dashboard"
    const lastSegment = segments[segments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")
  }

  // Search functionality
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        // Fallback to empty results
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
    setShowResults(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "client": return "bg-blue-500"
      case "booking": return "bg-green-500"
      case "invoice": return "bg-yellow-500"
      case "staff": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-white px-6"
    >
      {/* Left side - Page title */}
      <div className="flex items-center gap-4">
        <motion.h1
          key={getPageTitle()}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-semibold text-gray-900"
        >
          {getPageTitle()}
        </motion.h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 flex justify-center max-w-xl" ref={searchRef}>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients, bookings, in..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#C4A77D] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchQuery.length >= 2 && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg overflow-hidden"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.title}-${index}`}
                        custom={index}
                        variants={searchResultVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={result.href}
                          onClick={() => {
                            setShowResults(false)
                            setSearchQuery("")
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <span className={`w-2 h-2 rounded-full ${getTypeColor(result.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side - Notifications, Settings, Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#C4A77D] text-[10px] text-white font-medium"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    mockNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        custom={index}
                        variants={notificationItemVariants}
                        initial="hidden"
                        animate="visible"
                        className={`${
                          !notification.read ? "bg-gray-50" : ""
                        }`}
                      >
                        <Link
                          href={notification.href}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <motion.div
                            animate={{ scale: !notification.read ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                            className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-transparent" : "bg-[#C4A77D]"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 border-t">
                  <Link
                    href="/dashboard/notifications"
                    className="text-sm text-[#C4A77D] hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors block"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </Link>
        </motion.div>

        {/* User Menu */}
        <div className="relative flex items-center gap-3 border-l pl-4 ml-1" ref={userMenuRef}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">Studio Manager</span>
              <span className="text-xs text-gray-500">manager@platinumsound.com</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </motion.button>

          {/* Logout Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/api/auth/signout"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors block"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Link>
          </motion.div>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">Studio Manager</p>
                  <p className="text-xs text-gray-500">manager@platinumsound.com</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
                <div className="border-t py-1">
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
