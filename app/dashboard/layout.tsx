import { Metadata } from "next"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/skeletons"

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
      {children}
    </Suspense>
  )
}
