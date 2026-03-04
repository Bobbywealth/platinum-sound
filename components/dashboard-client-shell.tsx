"use client"

import { AdminRoleSwitcher } from "@/components/admin-role-switcher"
import { RolePreviewProvider } from "@/lib/role-preview-context"

export function DashboardClientShell({ children }: { children: React.ReactNode }) {
  return (
    <RolePreviewProvider>
      {children}
      <AdminRoleSwitcher />
    </RolePreviewProvider>
  )
}
