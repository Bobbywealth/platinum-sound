import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Music className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">Platinum Sound Studios</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Recording Studio Management System
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
