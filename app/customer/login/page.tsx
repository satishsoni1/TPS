"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CustomerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Mock customer authentication
    const customers = [
      { id: "c1", email: "abc.traders@email.com", password: "abc123", name: "ABC Traders", company: "ABC Trading Co" },
      {
        id: "c2",
        email: "tech.sol@email.com",
        password: "tech123",
        name: "Tech Solutions",
        company: "Tech Solutions Ltd",
      },
      { id: "c3", email: "retail.hub@email.com", password: "retail123", name: "Retail Hub", company: "Retail Hub Inc" },
    ]

    try {
      const customer = customers.find((c) => c.email === email && c.password === password)

      if (!customer) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Store customer session
      localStorage.setItem("customer_session", JSON.stringify(customer))
      router.push("/customer/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">TMS</h1>
            <p className="text-muted-foreground">Customer Portal</p>
            <p className="text-sm text-muted-foreground mt-2">Track your shipments in real-time</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-blue-800 text-xs">
              <p>
                <strong>Consigner 1:</strong> abc.traders@email.com / abc123
              </p>
              <p>
                <strong>Consigner 2:</strong> tech.sol@email.com / tech123
              </p>
              <p>
                <strong>Consigner 3:</strong> retail.hub@email.com / retail123
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800 border border-yellow-200">
            This is a customer portal where consigners can track their shipments and invoices.
          </div>
        </div>
      </Card>
    </div>
  )
}
