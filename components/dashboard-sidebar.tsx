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
    Settings,
    Users,
    X
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
    label: "OPERATIONS",
    expandable: true,
    expandIcon: Calendar,
    items: [
      { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
      { href: "/dashboard/schedule", label: "Schedule", icon: Clock },
      { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
      { href: "/dashboard/studios", label: "Studios", icon: Building2 },
      { href: "/dashboard/services", label: "Services", icon: Music2 },
    ],
  },
  {
    label: "FINANCE",
    expandable: true,
    expandIcon: DollarSign,
    items: [
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
  hover: { x: 4 },
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const isSectionActive = (section: NavSection) => {
    return section.items.some((item) => isActive(item.href))
  }

  const NavLink = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const active = isActive(item.href)
    const isHovered = hoveredItem === item.href

    return (
      <motion.div
        variants={navItemVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setHoveredItem(item.href)}
        onHoverEnd={() => setHoveredItem(null)}
        className={isChild ? "relative" : "relative"}
      >
        <Link
          href={item.href}
          onClick={(e) => {
            onClose?.()
            // Add quick visual feedback before navigation
            e.preventDefault()
            const link = e.currentTarget
            link.style.transform = "scale(0.95)"
            setTimeout(() => {
              link.style.transform = ""
              window.location.href = item.href
            }, 80)
          }}
          className={`
            relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            ${isChild ? "ml-4" : ""}
            ${active
              ? "bg-[#E8DCC8] text-gray-900"
              : "text-gray-600"
            }
          `}
          style={{ transformOrigin: "center" }}
        >
          {/* Active indicator bar */}
          {active && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C9A962] rounded-r-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
          )}

          {/* Hover background */}
          {!active && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            />
          )}

          <item.icon
            className={`h-5 w-5 flex-shrink-0 relative z-10 ${
              active ? "text-gray-900" : "text-gray-500"
            }`}
          />
          <span className="relative z-10">{item.label}</span>
        </Link>
      </motion.div>
    )
  }

  const ExpandableSection = ({ section }: { section: NavSection }) => {
    const isExpanded = expandedSections[section.label]
    const active = isSectionActive(section)

    return (
      <div>
        <motion.button
          onClick={() => toggleSection(section.label)}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            w-full relative overflow-hidden
            ${isExpanded || active
              ? "bg-[#E8DCC8] text-gray-900"
              : "text-gray-600 hover:bg-gray-100"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative z-10 flex items-center gap-3 w-full">
            {section.expandIcon && (
              <section.expandIcon className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{section.label.charAt(0) + section.label.slice(1).toLowerCase()}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="ml-auto"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="ml-4 space-y-1 mt-1 pt-1">
                {section.items.map((item) => (
                  <NavLink key={item.href} item={item} isChild />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 pb-6">
        <Link href="/dashboard" className="flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Image
              src="/Platinum Sound logo with 3D effect.png"
              alt="Platinum Sound Logo"
              width={180}
              height={60}
              className="h-auto w-full max-w-[160px]"
              priority
            />
          </motion.div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-6">
          {navSections.map((section) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.expandable ? (
                  <ExpandableSection section={section} />
                ) : (
                  // Non-expandable sections
                  section.items.map((item) => (
                    <NavLink key={item.href} item={item} />
                  ))
                )}
              </div>
            </motion.div>
          ))}

            {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              ACCOUNT
            </h3>
            <motion.button
              onClick={async () => {
                await signOut({ redirect: false })
                router.push("/")
                router.refresh()
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </nav>
    </div>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Check if we're on mobile based on window width
  const [isMobile, setIsMobile] = useState(false)

  // Update isMobile on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="hidden lg:flex lg:flex-col lg:w-64 lg:h-full lg:border-r bg-white"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border shadow-sm"
        aria-label="Open menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="lg:hidden fixed inset-0 z-50"
              onClick={() => setMobileOpen(false)}
            />
            {/* Mobile Sidebar */}
            <motion.aside
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="lg:hidden absolute left-0 top-0 bottom-0 w-72 bg-white h-full flex flex-col shadow-xl z-50"
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <X className="h-5 w-5" />
              </motion.button>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
