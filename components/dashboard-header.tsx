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
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface DashboardHeaderProps {
  title: string
}

interface SearchResult {
  type: string
  title: string
  subtitle: string
  href: string
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left side - Page title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Right side - Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3">
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
