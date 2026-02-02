"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
    Bell,
    ChevronDown,
    LogOut,
    Menu,
    Search,
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
  title: string
  message: string
  time: string
  read: boolean
}

// Mock notifications - in production, fetch from API
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Booking",
    message: "John Doe booked Studio A for tomorrow at 2 PM",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Invoice #1234 has been paid by Acme Corp",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Session Complete",
    message: "Recording session in Studio B has completed",
    time: "3 hours ago",
    read: true,
  },
]

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left side - Mobile menu button and Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>

      {/* Right side - Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients, bookings, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            className="h-9 w-64 rounded-lg border bg-muted/50 pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && searchQuery.length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg overflow-hidden">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <Link
                      key={`${result.type}-${result.title}-${index}`}
                      href={result.href}
                      onClick={() => {
                        setShowResults(false)
                        setSearchQuery("")
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full ${getTypeColor(result.type)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.length > 0 ? (
                  mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-muted transition-colors ${
                        !notification.read ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-transparent" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t">
                <Link
                  href="/dashboard/notifications"
                  className="text-sm text-primary hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 border-l pl-3 ml-1 hover:bg-muted/50 rounded-lg pr-2 py-1 transition-colors"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium">Studio Manager</span>
              <span className="text-xs text-muted-foreground">manager@platinumsound.com</span>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </Button>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">Studio Manager</p>
                <p className="text-xs text-muted-foreground">manager@platinumsound.com</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
              <div className="border-t py-1">
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
