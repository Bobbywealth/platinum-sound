"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const mobileMenuVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "tween" as const,
      duration: 0.3,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "tween" as const,
      duration: 0.3,
    },
  },
}

const backdropVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "STUDIOS", href: "#studios" },
  { name: "TEAM", href: "#team" },
  { name: "SERVICES", href: "#services" },
  { name: "CLIENTS", href: "#clients" },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      // Smooth scroll to section
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 h-11 w-11 bg-background/80 backdrop-blur-sm hover:bg-background"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-background z-40 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header Space (for close button) */}
                <div className="h-20 flex-shrink-0" />

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4">
                  <ul className="space-y-1">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        {link.href.startsWith("#") ? (
                          <button
                            onClick={() => handleLinkClick(link.href)}
                            className="w-full text-left py-4 text-lg font-medium hover:text-primary transition-colors border-b border-border/50 min-h-[3rem] flex items-center"
                          >
                            {link.name}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            className="block py-4 text-lg font-medium hover:text-primary transition-colors border-b border-border/50 min-h-[3rem] flex items-center"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* CTA Buttons */}
                <div className="px-6 py-6 space-y-3 border-t">
                  <Link href="/booking" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                      Book a Session
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full h-12">
                      Staff Login
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
