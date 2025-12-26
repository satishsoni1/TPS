"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  gstNumber: string
  panNumber: string
  status: "active" | "inactive" | "suspended"
  totalShipments: number
  totalRevenue: number
  outstandingBalance: number
  registrationDate: string
}

interface CustomerDetailViewProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (customerId: string, newStatus: string) => void
  userRole: string
}

export default function CustomerDetailView({
  customer,
  open,
  onOpenChange,
  onStatusChange,
  userRole,
}: CustomerDetailViewProps) {
  const creditUtilization = customer.totalRevenue > 0 ? (customer.outstandingBalance / customer.totalRevenue) * 100 : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Customer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Customer Header */}
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                <div className="text-2xl font-bold mt-1">{customer.companyName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
                <div className="text-lg font-semibold mt-1">{customer.contactPerson}</div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div className="text-lg font-semibold mt-1">{customer.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-lg font-semibold mt-1">{customer.email}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Address</div>
                <div className="text-lg font-semibold mt-1">
                  {customer.address}, {customer.city}, {customer.state}
                </div>
              </div>
            </div>
          </Card>

          {/* Compliance Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Compliance Information</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded">
                <div className="text-sm font-medium text-muted-foreground">GST Number</div>
                <div className="text-lg font-mono font-semibold mt-1">{customer.gstNumber}</div>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="text-sm font-medium text-muted-foreground">PAN Number</div>
                <div className="text-lg font-mono font-semibold mt-1">{customer.panNumber}</div>
              </div>
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Total Shipments</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{customer.totalShipments}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  ₹{(customer.totalRevenue / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="col-span-2 p-3 bg-orange-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Outstanding Balance</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  ₹{customer.outstandingBalance.toLocaleString()}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Credit Utilization</div>
                <div className="w-full bg-gray-200 rounded h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded"
                    style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{creditUtilization.toFixed(1)}% utilized</div>
              </div>
            </div>
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Registration Date</div>
                <div className="text-lg font-semibold mt-1">{customer.registrationDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge
                    className={
                      customer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : customer.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {customer.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Update */}
          {(userRole === "admin" || userRole === "accounts") && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Update Status</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Change Customer Status</label>
                <Select onValueChange={(value) => onStatusChange(customer.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={customer.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
