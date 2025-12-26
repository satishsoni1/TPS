"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Route {
  id: string
  routeName: string
  origin: string
  destination: string
  distance: number
  estimatedDays: number
  ratePerTon: number
  ratePerKg: number
  minimumFreight: number
  activeChallans: number
  completedShipments: number
  avgLoadPercentage: number
  status: "active" | "inactive"
  createdDate: string
}

interface RouteDetailViewProps {
  route: Route
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (routeId: string, newStatus: string) => void
  userRole: string
}

export default function RouteDetailView({ route, open, onOpenChange, onStatusChange, userRole }: RouteDetailViewProps) {
  const revenue = route.completedShipments * route.ratePerTon * 0.8

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Route Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Route Header */}
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Route Name</div>
                <div className="text-2xl font-bold mt-1">{route.routeName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Lane</div>
                <div className="text-xl font-semibold mt-1">
                  {route.origin} → {route.destination}
                </div>
              </div>
            </div>
          </Card>

          {/* Route Specifications */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Route Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Distance</div>
                <div className="text-lg font-semibold mt-1">{route.distance} km</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Est. Transit Time</div>
                <div className="text-lg font-semibold mt-1">{route.estimatedDays} day(s)</div>
              </div>
            </div>
          </Card>

          {/* Rate Master */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Rate Master</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Rate per Ton</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">₹{route.ratePerTon.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Rate per kg</div>
                <div className="text-2xl font-bold text-green-600 mt-1">₹{route.ratePerKg.toFixed(2)}</div>
              </div>
              <div className="col-span-2 p-3 bg-orange-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Minimum Freight</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">₹{route.minimumFreight.toLocaleString()}</div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Active Challans</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{route.activeChallans}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Completed Shipments</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">{route.completedShipments}</div>
              </div>
              <div className="col-span-2 p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-muted-foreground">Avg Load Utilization</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{route.avgLoadPercentage}%</div>
              </div>
            </div>
          </Card>

          {/* Revenue */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Revenue Analytics</h3>
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded">
              <div className="text-sm font-medium text-muted-foreground">Estimated Route Revenue</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                ₹{revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Based on {route.completedShipments} completed shipments
              </div>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Route Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <div className="mt-2">
                  <Badge
                    className={route.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {route.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created Date</div>
                <div className="text-lg font-semibold mt-1">{route.createdDate}</div>
              </div>
            </div>
          </Card>

          {/* Update Status */}
          {(userRole === "admin" || userRole === "operations") && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Update Status</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Change Route Status</label>
                <Select onValueChange={(value) => onStatusChange(route.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={route.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
