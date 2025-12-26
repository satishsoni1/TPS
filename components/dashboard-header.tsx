"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  user: {
    id: string
    email: string
    role: string
    name: string
  }
  onLogout: () => void
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter()

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    operations: "bg-blue-100 text-blue-800",
    accounts: "bg-green-100 text-green-800",
    transport: "bg-purple-100 text-purple-800",
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary">TMS</h1>
          <div>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user.role as keyof typeof roleColors]}`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
          {user.role === "admin" && (
            <Button variant="outline" onClick={() => router.push("/dashboard/analytics")}>
              Analytics
            </Button>
          )}
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
