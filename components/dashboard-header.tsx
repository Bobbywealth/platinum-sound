"use client"

import { Button } from "@/components/ui/button"
import { MobileSearchSheet } from "@/components/mobile-search-sheet"
import { ThemeToggle } from "@/components/theme-toggle"
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
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { roleDisplayNames } from "@/lib/permissions"
import { useRolePreview } from "@/lib/role-preview-context"
import { Role } from "@prisma/client"

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

const notifications: Notification[] = []

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
  const { data: session } = useSession()
  const { previewRole, isPreviewActive, setPreviewRole } = useRolePreview()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const mobileNotificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const mobileUserMenuRef = useRef<HTMLDivElement>(null)

  const userName = session?.user?.name ?? "Studio Manager"
  const userEmail = session?.user?.email ?? "manager@platinumsound.com"
  const effectiveRole: Role = (previewRole ?? session?.user?.role ?? "ADMIN") as Role
  const effectiveRoleLabel = roleDisplayNames[effectiveRole] ?? effectiveRole

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
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (mobileNotificationRef.current && !mobileNotificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileUserMenuRef.current && !mobileUserMenuRef.current.contains(event.target as Node)) {
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

  const closeMobileSearch = () => {
    setShowMobileSearch(false)
    clearSearch()
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

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-white px-4 md:px-6"
    >
      {/* Left side - Page title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 shrink-0 lg:hidden" aria-hidden="true" />
        <motion.h1
          key={getPageTitle()}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="truncate text-lg font-semibold text-gray-900 md:text-xl"
        >
          {getPageTitle()}
        </motion.h1>
      </div>

      {/* Center - Search (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl" ref={searchRef}>
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
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Button */}
      <div className="lg:hidden flex-1 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSearchOpen(true)}
          className="h-9 w-9"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Right side - Theme, Notifications, Settings, Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />
        
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
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
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

        {/* User Menu */}
        <div className="relative flex items-center gap-3 border-l pl-4 ml-1" ref={userMenuRef}>
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{userName}</span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                {effectiveRoleLabel}
                {isPreviewActive && (
                  <span className="rounded bg-amber-100 px-1 py-px text-[10px] font-semibold text-amber-700">
                    preview
                  </span>
                )}
              </span>
            </div>
            <div className="relative h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
              {isPreviewActive && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-400" />
              )}
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
                className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                  {isPreviewActive && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Previewing
                      </span>
                      <span className="text-xs text-gray-600">{effectiveRoleLabel}</span>
                      <button
                        onClick={() => { setPreviewRole(null); setShowUserMenu(false) }}
                        className="ml-auto text-[10px] text-gray-400 underline hover:text-gray-600"
                      >
                        Reset
                      </button>
                    </div>
                  )}
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

      {/* Mobile Search Sheet */}
      <MobileSearchSheet
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </motion.header>
  )
}
