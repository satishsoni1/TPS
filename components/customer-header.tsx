"use client"

import { Button } from "@/components/ui/button"

interface CustomerHeaderProps {
  customer: {
    id: string
    email: string
    name: string
    company: string
  }
  onLogout: () => void
}

export default function CustomerHeader({ customer, onLogout }: CustomerHeaderProps) {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">TMS</h1>
            <p className="text-xs text-muted-foreground">Customer Portal</p>
          </div>
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="font-semibold">{customer.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome</p>
            <p className="font-semibold">{customer.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
