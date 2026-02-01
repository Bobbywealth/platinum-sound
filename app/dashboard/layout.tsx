import { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { DashboardSkeleton } from "@/components/skeletons"
import DashboardSidebar from "@/components/dashboard-sidebar"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Studio management dashboard overview",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardSidebar>
        {children}
      </DashboardSidebar>
    </Suspense>
  )
}
