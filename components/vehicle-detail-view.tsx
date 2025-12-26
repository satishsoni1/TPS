"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

interface Vehicle {
  id: string
  vehicleNumber: string
  type: string
  capacity: number
  owner: string
  registrationDate: string
  insuranceExpiry: string
  pollutionCertExpiry: string
  status: "active" | "maintenance" | "inactive"
  totalTrips: number
  avgLoad: number
  lastMaintenance: string
}

interface VehicleDetailViewProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (vehicleId: string, newStatus: string) => void
  userRole: string
}

export default function VehicleDetailView({
  vehicle,
  open,
  onOpenChange,
  onStatusChange,
  userRole,
}: VehicleDetailViewProps) {
  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (date: string) => {
    const expiryDate = new Date(date)
    const today = new Date()
    return expiryDate < today
  }

  const getExpiryStatus = (date: string) => {
    if (isExpired(date)) {
      return { icon: AlertCircle, color: "text-red-600", label: "Expired" }
    }
    if (isExpiringSoon(date)) {
      return { icon: AlertTriangle, color: "text-orange-600", label: "Expiring Soon" }
    }
    return { icon: CheckCircle2, color: "text-green-600", label: "Valid" }
  }

  const insuranceStatus = getExpiryStatus(vehicle.insuranceExpiry)
  const pollutionStatus = getExpiryStatus(vehicle.pollutionCertExpiry)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vehicle Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Vehicle Header */}
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Vehicle Number</div>
                <div className="text-2xl font-bold font-mono mt-1">{vehicle.vehicleNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <div className="text-xl font-semibold mt-1">{vehicle.type}</div>
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Capacity</div>
                <div className="text-lg font-semibold mt-1">{vehicle.capacity.toLocaleString()} kg</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Owner</div>
                <div className="text-lg font-semibold mt-1">{vehicle.owner}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Registration Date</div>
                <div className="text-lg font-semibold mt-1">{vehicle.registrationDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="mt-1">
                  <Badge
                    className={
                      vehicle.status === "active"
                        ? "bg-green-100 text-green-800"
                        : vehicle.status === "maintenance"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {vehicle.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Documentation Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Documentation Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium">Insurance Certificate</div>
                  <div className="text-sm text-muted-foreground">Expires: {vehicle.insuranceExpiry}</div>
                </div>
                <div className="flex items-center gap-2">
                  {insuranceStatus.icon && <insuranceStatus.icon className={`${insuranceStatus.color} w-5 h-5`} />}
                  <Badge variant="outline">{insuranceStatus.label}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium">Pollution Certificate</div>
                  <div className="text-sm text-muted-foreground">Expires: {vehicle.pollutionCertExpiry}</div>
                </div>
                <div className="flex items-center gap-2">
                  {pollutionStatus.icon && <pollutionStatus.icon className={`${pollutionStatus.color} w-5 h-5`} />}
                  <Badge variant="outline">{pollutionStatus.label}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Statistics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Usage Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Total Trips</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{vehicle.totalTrips}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Avg Load</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{vehicle.avgLoad.toLocaleString()} kg</div>
              </div>
              <div className="col-span-2 p-3 bg-yellow-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Last Maintenance</div>
                <div className="text-lg font-semibold text-yellow-700 mt-1">{vehicle.lastMaintenance}</div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {(userRole === "admin" || userRole === "operations") && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Change Vehicle Status</label>
                  <Select onValueChange={(value) => onStatusChange(vehicle.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={vehicle.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
