"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  BarChart3,
  Settings,
  Clock,
  Building2,
  Mail,
  LogOut,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface NavSection {
  label: string
  items: NavItem[]
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
    ],
  },
  {
    label: "FINANCE",
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
      { href: "/dashboard/staff", label: "Staff", icon: Users },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ href: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [financeOpen, setFinanceOpen] = useState(true)

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:border-r sidebar-dark">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-full">
          <Image
            src="/platinum_sound_transparent.png"
            alt="Platinum Sound Logo"
            width={140}
            height={30}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-between px-3 py-2 bg-black">
        <div className="space-y-1">
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 mb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {section.label}
              </h3>
              <div className="space-y-0.5">
                {section.label === "FINANCE" ? (
                  <>
                    {/* Finance Toggle Button */}
                    <button
                      onClick={() => setFinanceOpen(!financeOpen)}
                      className={`flex items-center justify-center gap-2 px-3 py-3.5 rounded-lg text-xs font-medium transition-colors w-full ${
                        financeOpen
                          ? "bg-white text-black"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>Finance</span>
                      {financeOpen ? (
                        <ChevronUp className="h-3 w-3 ml-auto" />
                      ) : (
                        <ChevronDown className="h-3 w-3 ml-auto" />
                      )}
                    </button>
                    {/* Finance Dropdown Items */}
                    {financeOpen && (
                      <div className="ml-4 space-y-0.5 mt-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-xs font-medium transition-colors ${
                                isActive
                                  ? "bg-white text-black"
                                  : "text-gray-300 hover:text-white"
                              }`}
                            >
                              <item.icon className="h-4 w-4 flex-shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  section.items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-center gap-2 px-3 py-3.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-white text-black"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer - User Profile & Sign Out */}
        <div className="mt-2 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium">
              SM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Studio Manager</p>
              <p className="text-[10px] text-gray-400 truncate">
                manager@platinumsound.com
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign Out</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
