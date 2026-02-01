"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
} from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  title: string
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left side - Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right side - Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-lg border bg-muted/50 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 border-l pl-3 ml-1">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">Studio Manager</span>
            <span className="text-xs text-muted-foreground">manager@platinumsound.com</span>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </Button>
        </div>

        {/* Sign Out */}
        <Link href="/">
          <Button variant="ghost" size="icon" title="Sign Out">
            <LogOut className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
