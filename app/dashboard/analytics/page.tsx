"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import AnalyticsCharts from "@/components/analytics-charts"
import RevenueMetrics from "@/components/revenue-metrics"
import PerformanceMetrics from "@/components/performance-metrics"

interface User {
  id: string
  email: string
  role: string
  name: string
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("user_session")
    if (!session) {
      router.push("/auth/login")
      return
    }
    const parsedUser = JSON.parse(session)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user_session")
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Admin Analytics</h2>
          <p className="text-muted-foreground mt-1">System-wide performance and financial metrics</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueMetrics />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
