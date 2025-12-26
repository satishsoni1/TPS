"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomerHeader from "@/components/customer-header"
import CustomerShipments from "@/components/customer-shipments"
import CustomerInvoices from "@/components/customer-invoices"
import CustomerSupport from "@/components/customer-support"

interface Customer {
  id: string
  email: string
  name: string
  company: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("customer_session")
    if (!session) {
      router.push("/customer/login")
      return
    }
    setCustomer(JSON.parse(session))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("customer_session")
    router.push("/customer/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <CustomerHeader customer={customer} onLogout={handleLogout} />

      <main className="container mx-auto p-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm font-medium text-muted-foreground">Active Shipments</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">12</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="text-sm font-medium text-muted-foreground">Delivered</div>
              <div className="text-2xl font-bold text-green-600 mt-2">45</div>
            </Card>
            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="text-sm font-medium text-muted-foreground">Pending Invoices</div>
              <div className="text-2xl font-bold text-orange-600 mt-2">3</div>
            </Card>
          </div>

          <Card>
            <Tabs defaultValue="shipments" className="w-full">
              <TabsList className="border-b rounded-none px-6 pt-4">
                <TabsTrigger value="shipments">My Shipments</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="shipments">
                  <CustomerShipments customerName={customer.name} />
                </TabsContent>

                <TabsContent value="invoices">
                  <CustomerInvoices customerName={customer.name} />
                </TabsContent>

                <TabsContent value="support">
                  <CustomerSupport />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}
