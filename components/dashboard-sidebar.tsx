"use client"

import {
    BarChart3,
    Building2,
    Calendar,
    ChevronDown,
    ChevronUp,
    Clock,
    DollarSign,
    FileText,
    LayoutDashboard,
    Mail,
    Menu,
    Music2,
    Settings,
    Users,
    X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createElement, useEffect, useState } from "react"

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
    items: [
      { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
      { href: "/dashboard/schedule", label: "Schedule", icon: Clock },
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    FINANCE: true,
  })

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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/Platinum Sound logo with 3D effect.png"
            alt="Platinum Sound Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.expandable ? (
                  <>
                    {/* Expandable Section Toggle Button */}
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                        expandedSections[section.label] || isSectionActive(section)
                          ? "bg-[#E8DCC8] text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {section.expandIcon && createElement(section.expandIcon, { className: "h-5 w-5 flex-shrink-0" })}
                      <span>{section.label.charAt(0) + section.label.slice(1).toLowerCase()}</span>
                      {expandedSections[section.label] ? (
                        <ChevronUp className="h-4 w-4 ml-auto" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                    {/* Expanded Items */}
                    {expandedSections[section.label] && (
                      <div className="ml-4 space-y-1 mt-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-[#E8DCC8] text-gray-900"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Non-expandable sections
                  section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-[#E8DCC8] text-gray-900"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
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
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:border-r bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Mobile Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white h-full flex flex-col shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
