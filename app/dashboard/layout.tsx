import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Music, Users, Calendar, BarChart, Settings, CreditCard } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
  { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Bookings", href: "/dashboard/bookings", icon: Music },
  { name: "Invoices", href: "/dashboard/invoices", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-card">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Music className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Platinum Sound</span>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">Sign Out</Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
