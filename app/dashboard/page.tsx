"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LRManagementEnhanced from "@/components/lr-management-enhanced"
import ChallanManagementEnhanced from "@/components/challan-management-enhanced"
import InvoiceManagementEnhanced from "@/components/invoice-management-enhanced"
import DashboardHeader from "@/components/dashboard-header"
import VehicleManagementEnhanced from "@/components/vehicle-management-enhanced"
import DriverManagementEnhanced from "@/components/driver-management-enhanced"
import CustomerManagementEnhanced from "@/components/customer-management-enhanced"
import RouteManagementEnhanced from "@/components/route-management-enhanced"
import PaymentManagementEnhanced from "@/components/payment-management-enhanced"

interface User {
  id: string
  email: string
  role: string
  name: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("user_session")
    console.log("User session:", session)
    if (!session) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(session))
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

  if (!user) return null
  const TAB_CONFIG = [
    {
      value: "lr",
      label: "LR",
      roles: ["admin", "operations", "accounts"],
    },
    {
      value: "challan",
      label: "Challan",
      roles: ["admin", "operations"],
    },
    {
      value: "vehicles",
      label: "Vehicles",
      roles: ["admin", "operations"],
    },
    {
      value: "drivers",
      label: "Drivers",
      roles: ["admin", "operations"],
    },
    {
      value: "routes",
      label: "Routes",
      roles: ["admin", "operations"],
    },
    {
      value: "invoice",
      label: "Invoice",
      roles: ["admin", "accounts"],
    },
    {
      value: "customers",
      label: "Customers",
      roles: ["admin", "accounts"],
    },
    {
      value: "payments",
      label: "Payments",
      roles: ["admin", "accounts"],
    },
  ]


  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto p-6">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Active LRs</div>
              <div className="text-2xl font-bold mt-2">24</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending Chillans</div>
              <div className="text-2xl font-bold mt-2">8</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Pending Invoices</div>
              <div className="text-2xl font-bold mt-2">5</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-bold mt-2">₹2.4L</div>
            </Card>
          </div>
          <Card className="rounded-xl">
            <Tabs defaultValue="lr" className="w-full">

              <TabsList
                className="
    flex w-full gap-3
    border-b bg-background
    px-4 py-3
    overflow-x-auto
    scrollbar-hide
  "
              >
                {TAB_CONFIG.filter(tab => tab.roles.includes(user.role)).map(tab => (
                  <TabsTrigger
                    value={tab.value}
                    className="
    h-11 min-w-[110px]
    rounded-full
    px-6
    text-sm font-medium
    transition-all duration-200

    border border-border
    bg-muted text-muted-foreground

    hover:bg-accent hover:text-accent-foreground

    data-[state=active]:bg-primary
    data-[state=active]:text-primary-foreground
    data-[state=active]:shadow-sm
  "
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="p-2">
                <TabsContent value="lr">
                  <LRManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="challan">
                  <ChallanManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="vehicles">
                  <VehicleManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="drivers">
                  <DriverManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="routes">
                  <RouteManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="invoice">
                  <InvoiceManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="customers">
                  <CustomerManagementEnhanced userRole={user.role} />
                </TabsContent>

                <TabsContent value="payments">
                  <PaymentManagementEnhanced userRole={user.role} />
                </TabsContent>
              </div>

            </Tabs>
          </Card>

          {/* <Card>
            <Tabs defaultValue="lr" className="w-full">
              <TabsList className="border-b rounded-none px-6 pt-4 w-full justify-start overflow-x-auto">
                <TabsTrigger value="lr">LR Management</TabsTrigger>
                {(user.role === "admin" || user.role === "operations") && (
                  <>
                    <TabsTrigger value="challan">Challan</TabsTrigger>
                    <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                    <TabsTrigger value="drivers">Drivers</TabsTrigger>
                    <TabsTrigger value="routes">Routes</TabsTrigger>
                  </>
                )}
                {(user.role === "admin" || user.role === "accounts") && (
                  <>
                    <TabsTrigger value="invoice">Invoice</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                  </>
                )}
              </TabsList>

              <div className="p-6">
                <TabsContent value="lr">
                  <LRManagementEnhanced userRole={user.role} />
                </TabsContent>

                {(user.role === "admin" || user.role === "operations") && (
                  <>
                    <TabsContent value="challan">
                      <ChallanManagementEnhanced userRole={user.role} />
                    </TabsContent>

                    <TabsContent value="vehicles">
                      <VehicleManagementEnhanced userRole={user.role} />
                    </TabsContent>

                    <TabsContent value="drivers">
                      <DriverManagementEnhanced userRole={user.role} />
                    </TabsContent>

                    <TabsContent value="routes">
                      <RouteManagementEnhanced userRole={user.role} />
                    </TabsContent>
                  </>
                )}

                {(user.role === "admin" || user.role === "accounts") && (
                  <>
                    <TabsContent value="invoice">
                      <InvoiceManagementEnhanced userRole={user.role} />
                    </TabsContent>

                    <TabsContent value="customers">
                      <CustomerManagementEnhanced userRole={user.role} />
                    </TabsContent>

                    <TabsContent value="payments">
                      <PaymentManagementEnhanced userRole={user.role} />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </Card> */}
        </div>
      </main>
    </div>
  )
}
