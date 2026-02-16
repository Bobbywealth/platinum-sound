"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
    BarChart3,
    Building2,
    Calendar,
    CheckSquare,
    ChevronDown,
    Clock,
    DollarSign,
    FileText,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    Music2,
    Package,
    Settings,
    Users,
    X,
} from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface NavSection {
  label: string
  items: NavItem[]
  expandable?: boolean
  expandIcon?: React.ElementType
}

const navSections: NavSection[] = [
  {
    label: "DASHBOARD",
    items: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "CALENDAR & SCHEDULING",
    expandable: true,
    expandIcon: Calendar,
    items: [
      { href: "/dashboard/calendar", label: "Master Calendar", icon: Calendar },
      { href: "/dashboard/availability", label: "Availability", icon: Clock },
      { href: "/dashboard/schedule", label: "Daily Schedule", icon: Clock },
    ],
  },
  {
    label: "OPERATIONS",
    expandable: true,
    expandIcon: Building2,
    items: [
      { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
      { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/dashboard/studios", label: "Studios", icon: Building2 },
      { href: "/dashboard/services", label: "Services", icon: Music2 },
      { href: "/dashboard/inventory", label: "Inventory", icon: Package },
      { href: "/dashboard/work-orders", label: "Work Orders", icon: FileText },
    ],
  },
  {
    label: "FINANCE & REPORTS",
    expandable: true,
    expandIcon: DollarSign,
    items: [
      { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/dashboard/expenses", label: "Expenses", icon: DollarSign },
    ],
  },
  {
    label: "MARKETING",
    items: [
      { href: "/dashboard/marketing", label: "Marketing", icon: Mail },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      { href: "/dashboard/clients", label: "Clients", icon: Users },
      { href: "/dashboard/teams", label: "Teams", icon: Users },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ href: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
]

// Animation variants
const navItemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  tap: { scale: 0.98 },
}

const sectionVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn" as const,
    },
  },
}

const mobileMenuVariants = {
  closed: { x: "-100%", opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
}

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
  exit: { opacity: 0 },
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "CALENDAR & SCHEDULING": true,
    "FINANCE & REPORTS": true,
  })

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <Image
            src="/Platinum Sound logo with 3D effect.png"
            alt="Platinum Sound"
            width={60}
            height={40}
            className="h-10 w-auto"
          />
          <div>
            <span className="font-bold text-lg block">Platinum Sound</span>
            <span className="text-xs text-muted-foreground">Studio Management</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navSections.map((section) => (
            <div key={section.label} className="mb-2">
              {section.expandable ? (
                <>
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                  >
                    <span>{section.label}</span>
                    <motion.div
                      animate={{ rotate: expandedSections[section.label] ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections[section.label] && (
                      <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-1">
                          {section.items.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                              <motion.button
                                key={item.href}
                                variants={navItemVariants}
                                initial="initial"
                                animate="animate"
                                whileTap="tap"
                                onClick={() => handleNavClick(item.href)}
                                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </motion.button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.label}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      return (
                        <motion.button
                          key={item.href}
                          variants={navItemVariants}
                          initial="initial"
                          animate="animate"
                          whileTap="tap"
                          onClick={() => handleNavClick(item.href)}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 p-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-background border shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.aside
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-xl"
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:bg-background">
        <SidebarContent />
      </aside>
    </>
  )
}
