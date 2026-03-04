"use client"

import { Role } from "@prisma/client"
import { createContext, useContext, useEffect, useState } from "react"

const STORAGE_KEY = "dev_role_preview"

interface RolePreviewContextValue {
  previewRole: Role | null
  setPreviewRole: (role: Role | null) => void
  isPreviewActive: boolean
}

const RolePreviewContext = createContext<RolePreviewContextValue>({
  previewRole: null,
  setPreviewRole: () => {},
  isPreviewActive: false,
})

export function RolePreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewRole, setPreviewRoleState] = useState<Role | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && Object.values(Role).includes(stored as Role)) {
      setPreviewRoleState(stored as Role)
    }
  }, [])

  const setPreviewRole = (role: Role | null) => {
    setPreviewRoleState(role)
    if (role) {
      localStorage.setItem(STORAGE_KEY, role)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <RolePreviewContext.Provider
      value={{ previewRole, setPreviewRole, isPreviewActive: previewRole !== null }}
    >
      {children}
    </RolePreviewContext.Provider>
  )
}

export function useRolePreview() {
  return useContext(RolePreviewContext)
}
