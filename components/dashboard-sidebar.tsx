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
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState } from "react"
import { Role } from "@prisma/client"
import { useRolePreview } from "@/lib/role-preview-context"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  roles?: Role[] // if undefined, visible to all roles
}

interface NavSection {
  label: string
  items: NavItem[]
  expandable?: boolean
  expandIcon?: React.ElementType
}

// Which pages each role can access. ADMIN sees everything.
const rolePageAccess: Record<Role, string[]> = {
  ADMIN: ["*"], // Admin sees all pages
  MANAGER: [
    "/dashboard",
    "/dashboard/calendar",
    "/dashboard/availability",
    "/dashboard/schedule",
    "/dashboard/bookings",
    "/dashboard/tasks",
    "/dashboard/studios",
    "/dashboard/services",
    "/dashboard/inventory",
    "/dashboard/work-orders",
    "/dashboard/reports",
    "/dashboard/analytics",
    "/dashboard/invoices",
    "/dashboard/expenses",
    "/dashboard/leads",
    "/dashboard/clients",
    "/dashboard/teams",
    "/dashboard/settings",
    "/dashboard/staff",
  ],
  BOOKING_AGENT: [
    "/dashboard/calendar",
    "/dashboard/bookings",
    "/dashboard/leads",
    "/dashboard/clients",
  ],
  ENGINEER: [
    "/dashboard/availability",
    "/dashboard/schedule",
    "/dashboard/bookings",
  ],
  INTERN: [
    "/dashboard/calendar",
    "/dashboard/inventory",
    "/dashboard/work-orders",
  ],
  FINANCE: [
    "/dashboard",
    "/dashboard/reports",
    "/dashboard/analytics",
    "/dashboard/invoices",
    "/dashboard/expenses",
  ],
  MARKETING: [
    "/dashboard/marketing",
    "/dashboard/marketing/email",
    "/dashboard/marketing/sms",
    "/dashboard/analytics",
  ],
  FRONT_DESK: [
    "/dashboard/calendar",
    "/dashboard/bookings",
    "/dashboard/leads",
  ],
}

// Section icons for visual reference
const sectionIcons: Record<string, React.ElementType> = {
  "DASHBOARD": LayoutDashboard,
  "CALENDAR & SCHEDULING": Calendar,
  "OPERATIONS": Building2,
  "FINANCE & REPORTS": DollarSign,
  "MARKETING": Mail,
  "PEOPLE": Users,
  "SYSTEM": Settings,
}

const navSections: NavSection[] = [
  {
    label: "MAIN",
    items: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "CALENDAR",
    expandable: true,
    expandIcon: Calendar,
    items: [
      { href: "/dashboard/calendar", label: "Master Calendar", icon: Calendar },
      { href: "/dashboard/availability", label: "Availability", icon: Clock },
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
    label: "FINANCE",
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
    label: "GROWTH",
    expandable: true,
    expandIcon: Mail,
    items: [
      { href: "/dashboard/marketing", label: "Marketing Overview", icon: Mail },
      { href: "/dashboard/marketing/email", label: "Email Campaigns", icon: Mail },
      { href: "/dashboard/marketing/sms", label: "SMS Campaigns", icon: Mail },
      { href: "/dashboard/leads", label: "Leads", icon: Users },
      { href: "/dashboard/clients", label: "Clients", icon: Users },
      { href: "/dashboard/teams", label: "Teams", icon: Users },
    ],
  },
  {
    label: "SETTINGS",
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

function canSeeHref(role: Role, href: string): boolean {
  const allowed = rolePageAccess[role]
  if (!allowed) return false
  if (allowed.includes("*")) return true
  return allowed.includes(href)
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { previewRole } = useRolePreview()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "CALENDAR": true,
    "FINANCE": true,
  })

  const effectiveRole: Role = (previewRole ?? session?.user?.role ?? "ADMIN") as Role

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

  // Filter sections and items by effective role (memoized for performance)
  const filteredSections = useMemo(
    () =>
      navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canSeeHref(effectiveRole, item.href)),
        }))
        .filter((section) => section.items.length > 0),
    [effectiveRole]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex flex-col items-center justify-center gap-2" onClick={onClose}>
          <Image
            src="/Platinum Sound logo with 3D effect.png"
            alt="Platinum Sound"
            width={140}
            height={140}
            className="h-28 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {filteredSections.map((section) => (
            <div key={section.label} className="mb-2">
              {section.expandable ? (
                <>
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center justify-between w-full px-3 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {sectionIcons[section.label] && (
                        <motion.div
                          animate={{ rotate: expandedSections[section.label] ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          {React.createElement(sectionIcons[section.label], { className: "h-3.5 w-3.5" })}
                        </motion.div>
                      )}
                      <span>{section.label}</span>
                    </div>
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
                        <div className="space-y-0.5 mt-1 ml-1">
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
                                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                  isActive
                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                }`}
                              >
                                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
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
                  <div className="px-3 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    {sectionIcons[section.label] && React.createElement(sectionIcons[section.label], { className: "h-3.5 w-3.5" })}
                    {section.label}
                  </div>
                  <div className="space-y-0.5 ml-1">
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
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
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
