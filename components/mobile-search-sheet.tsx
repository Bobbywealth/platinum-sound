"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"

interface SearchResult {
  type: string
  title: string
  subtitle: string
  href: string
}

interface MobileSearchSheetProps {
  open: boolean
  onClose: () => void
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

function getTypeColor(type: string) {
  switch (type) {
    case "client":
      return "bg-blue-500"
    case "booking":
      return "bg-green-500"
    case "invoice":
      return "bg-yellow-500"
    case "studio":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

// Mock search function - in production, this would call an API
async function performSearch(query: string): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const mockData: SearchResult[] = [
    {
      type: "client",
      title: "John Doe",
      subtitle: "john@example.com • Last session: 2 days ago",
      href: "/dashboard/clients",
    },
    {
      type: "booking",
      title: "Studio A Session",
      subtitle: "Tomorrow at 2:00 PM • John Doe",
      href: "/dashboard/bookings",
    },
    {
      type: "invoice",
      title: "Invoice #1234",
      subtitle: "$450 • Due in 5 days",
      href: "/dashboard/invoices",
    },
    {
      type: "client",
      title: "Sarah Smith",
      subtitle: "sarah@example.com • VIP Client",
      href: "/dashboard/clients",
    },
    {
      type: "studio",
      title: "Studio B",
      subtitle: "Available • 5-star rating",
      href: "/dashboard/studios",
    },
  ]

  return mockData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  )
}

export function MobileSearchSheet({ open, onClose }: MobileSearchSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Clear search when closed
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setResults([])
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      const searchResults = await performSearch(searchQuery)
      setResults(searchResults)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-full m-0 p-0 flex flex-col gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search clients, bookings, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-11 text-base outline-none focus:ring-2 focus:ring-[#C4A77D] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </DialogHeader>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                Start typing to search clients, bookings, invoices, and more...
              </p>
            </div>
          ) : isSearching ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-3" />
              <p className="text-sm">Searching...</p>
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
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[3rem]"
                  >
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${getTypeColor(
                        result.type
                      )}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate">
                        {result.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">
                No results found for &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Try searching for a different term
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
