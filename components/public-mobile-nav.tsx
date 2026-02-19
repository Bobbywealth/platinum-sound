"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "#studios", label: "STUDIOS" },
  { href: "#team", label: "TEAM" },
  { href: "#services", label: "SERVICES" },
  { href: "#clients", label: "CLIENTS" },
  { href: "/dashboard/bookings", label: "BOOKING" },
]

const sheetId = "public-mobile-nav-drawer"

export function PublicMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (open) {
      setOpen(false)
    }
  }, [pathname, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
          aria-controls={sheetId}
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        id={sheetId}
        className="top-0 right-0 left-auto h-screen w-[85vw] max-w-sm translate-x-0 translate-y-0 rounded-none border-l border-y-0 border-r-0 p-6"
      >
        <DialogTitle className="text-left text-base uppercase tracking-wide text-royal">Menu</DialogTitle>

        <div className="mt-4 flex flex-col gap-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-2 text-base font-semibold text-foreground/85 hover:bg-royal/5 hover:text-royal transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/booking" onClick={() => setOpen(false)}>
            <Button className="w-full bg-yellow-300 text-black hover:bg-yellow-400 font-semibold">Book a Session</Button>
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full">Log In</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
