"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface Driver {
  id: string
  name: string
  licenseNumber: string
  phone: string
  email: string
  licenseExpiry: string
  aadharNumber: string
  address: string
  status: "active" | "inactive" | "suspended"
  totalTrips: number
  avgRating: number
  onTimePercentage: number
  joiningDate: string
}

interface DriverDetailViewProps {
  driver: Driver
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (driverId: string, newStatus: string) => void
  userRole: string
}

export default function DriverDetailView({
  driver,
  open,
  onOpenChange,
  onStatusChange,
  userRole,
}: DriverDetailViewProps) {
  const isLicenseExpired = new Date(driver.licenseExpiry) < new Date()
  const isLicenseExpiringSoon =
    new Date(driver.licenseExpiry).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Driver Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Driver Header */}
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div className="text-2xl font-bold mt-1">{driver.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">License Number</div>
                <div className="text-lg font-mono mt-1">{driver.licenseNumber}</div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div className="text-lg font-semibold mt-1">{driver.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-lg font-semibold mt-1">{driver.email}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm font-medium text-muted-foreground">Address</div>
                <div className="text-lg font-semibold mt-1">{driver.address}</div>
              </div>
            </div>
          </Card>

          {/* Documentation */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Documentation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium">License Expiry</div>
                  <div className="text-sm text-muted-foreground">{driver.licenseExpiry}</div>
                </div>
                <div className="flex items-center gap-2">
                  {isLicenseExpired ? (
                    <>
                      <AlertCircle className="text-red-600 w-5 h-5" />
                      <Badge className="bg-red-100 text-red-800">Expired</Badge>
                    </>
                  ) : isLicenseExpiringSoon ? (
                    <>
                      <AlertCircle className="text-orange-600 w-5 h-5" />
                      <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="text-green-600 w-5 h-5" />
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="font-medium">Aadhar Number</div>
                <div className="text-lg font-mono mt-1">{driver.aadharNumber}</div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Total Trips</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{driver.totalTrips}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Avg Rating</div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">★ {driver.avgRating.toFixed(1)}</div>
              </div>
              <div className="col-span-2 p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">On-Time Delivery %</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{driver.onTimePercentage}%</div>
              </div>
            </div>
          </Card>

          {/* Employment Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Employment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Joining Date</div>
                <div className="text-lg font-semibold mt-1">{driver.joiningDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge
                    className={
                      driver.status === "active"
                        ? "bg-green-100 text-green-800"
                        : driver.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {driver.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Status Update */}
          {(userRole === "admin" || userRole === "operations") && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Update Status</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Change Driver Status</label>
                <Select onValueChange={(value) => onStatusChange(driver.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={driver.status} />
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
