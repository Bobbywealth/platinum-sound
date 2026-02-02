"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StaffPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Teams page since we're consolidating
    router.replace("/dashboard/teams")
  }, [router])

  return null
}
