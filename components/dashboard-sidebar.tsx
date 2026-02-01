"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
      { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
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

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen lg:border-r sidebar-dark">
      {/* Logo Section - Centered */}
      <div className="p-6 border-b bg-black">
        <Link href="/dashboard" className="flex flex-col items-center justify-center">
          <Image
            src="/platinum_sound_transparent.png"
            alt="Platinum Sound Logo"
            width={160}
            height={35}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Navigation - Centered */}
      <nav className="flex-1 flex flex-col justify-between p-4 space-y-6 bg-black">
        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

      {/* Footer - User Profile & Sign Out */}
      <div className="p-4 border-t bg-black space-y-2">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-medium">
            SM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Studio Manager</p>
            <p className="text-xs text-gray-400 truncate">
              manager@platinumsound.com
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  )
}
