"use client"

import { Role } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Eye, EyeOff, RotateCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRef, useState, useEffect } from "react"
import { roleDisplayNames } from "@/lib/permissions"
import { useRolePreview } from "@/lib/role-preview-context"

const ALL_ROLES = Object.keys(roleDisplayNames) as Role[]

const roleColors: Record<Role, string> = {
  ADMIN: "bg-red-500",
  MANAGER: "bg-blue-500",
  BOOKING_AGENT: "bg-green-500",
  ENGINEER: "bg-purple-500",
  INTERN: "bg-yellow-500",
  FINANCE: "bg-orange-500",
  MARKETING: "bg-pink-500",
  FRONT_DESK: "bg-teal-500",
}

export function AdminRoleSwitcher() {
  const { data: session } = useSession()
  const { previewRole, setPreviewRole, isPreviewActive } = useRolePreview()
  const [open, setOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Only show in development and only for ADMIN users
  if (process.env.NODE_ENV !== "development") return null
  if (!session?.user || session.user.role !== "ADMIN") return null

  const effectiveRole = previewRole ?? session.user.role
  const dotColor = roleColors[effectiveRole] ?? "bg-gray-500"

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2"
        >
          {/* Main switcher pill */}
          <div
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-lg text-sm"
            ref={dropdownRef}
          >
            {/* Dev badge */}
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              DEV
            </span>

            <span className="text-gray-400 text-xs">Viewing as</span>

            {/* Role picker button */}
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                {roleDisplayNames[effectiveRole]}
                <ChevronDown
                  className={`h-3 w-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute bottom-full mb-2 left-0 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
                  >
                    {ALL_ROLES.map((role) => {
                      const isSelected = effectiveRole === role
                      const isActual = role === "ADMIN"
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            setPreviewRole(role === "ADMIN" ? null : role)
                            setOpen(false)
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                            isSelected
                              ? "bg-gray-100 font-semibold text-gray-900"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${roleColors[role]}`} />
                          {roleDisplayNames[role]}
                          {isActual && (
                            <span className="ml-auto text-[10px] text-gray-400">(you)</span>
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset button when previewing */}
            {isPreviewActive && (
              <button
                onClick={() => setPreviewRole(null)}
                title="Reset to Admin"
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}

            {/* Hide button */}
            <button
              onClick={() => setIsVisible(false)}
              title="Hide switcher"
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Restore button when hidden */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 shadow-md hover:bg-amber-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          Role Switcher
          {isPreviewActive && (
            <span className={`h-2 w-2 rounded-full ${roleColors[previewRole!]}`} />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
