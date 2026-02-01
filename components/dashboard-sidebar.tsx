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
  Mic2,
  Building2,
  Mail,
  MessageSquare,
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
      { href: "/dashboard/marketing/email", label: "Email Campaigns", icon: Mail },
      { href: "/dashboard/marketing/sms", label: "SMS Campaigns", icon: MessageSquare },
    ],
  },
  {
    label: "PEOPLE",
    items: [
      { href: "/dashboard/clients", label: "Clients", icon: Users },
      { href: "/dashboard/staff", label: "Staff", icon: Mic2 },
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen lg:border-r bg-card">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/platinum_sound_transparent.png"
            alt="Platinum Sound Logo"
            width={180}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
            SM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Studio Manager</p>
            <p className="text-xs text-muted-foreground truncate">
              manager@platinumsound.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
