"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Challan {
  id: string
  challanNumber: string
  lrNumber: string
  vehicleNumber: string
  driverName: string
  driverContact: string
  route: string
  departure: string
  expectedArrival: string
  actualArrival?: string
  status: "pending" | "in_transit" | "delivered"
  date: string
}

interface ChallanDetailViewProps {
  challan: Challan
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (challanId: string, newStatus: string) => void
  userRole: string
}

export default function ChallanDetailView({
  challan,
  open,
  onOpenChange,
  onStatusChange,
  userRole,
}: ChallanDetailViewProps) {
  const statusProgression = ["pending", "in_transit", "delivered"]
  const currentStatusIndex = statusProgression.indexOf(challan.status)

  const calculateDelay = () => {
    if (!challan.actualArrival) return null
    const expected = new Date(challan.expectedArrival).getTime()
    const actual = new Date(challan.actualArrival).getTime()
    const delayHours = Math.round((actual - expected) / (1000 * 60 * 60))
    return delayHours
  }

  const delay = calculateDelay()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>{challan.challanNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Badge
                className={`${challan.status === "delivered" ? "bg-green-100 text-green-800" : challan.status === "in_transit" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {challan.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* LR and Vehicle */}
          <div>
            <h3 className="font-semibold mb-3">Assignment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">LR Number</div>
                <div className="font-semibold">{challan.lrNumber}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Vehicle Number</div>
                <div className="font-semibold font-mono">{challan.vehicleNumber}</div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Driver Information */}
          <div>
            <h3 className="font-semibold mb-3">Driver Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Driver Name</div>
                <div className="font-semibold">{challan.driverName}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Contact Number</div>
                <div className="font-semibold">{challan.driverContact}</div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold mb-3">Journey Timeline</h3>
            <div className="space-y-3">
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="text-xs font-medium text-blue-600 mb-1">Departure</div>
                <div className="font-semibold text-blue-900">{challan.departure.replace("T", " ")}</div>
              </Card>
              <Card className="p-3 bg-purple-50 border-purple-200">
                <div className="text-xs font-medium text-purple-600 mb-1">Expected Arrival</div>
                <div className="font-semibold text-purple-900">{challan.expectedArrival.replace("T", " ")}</div>
              </Card>
              {challan.actualArrival && (
                <Card
                  className={`p-3 ${delay && delay > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
                >
                  <div className={`text-xs font-medium ${delay && delay > 0 ? "text-red-600" : "text-green-600"} mb-1`}>
                    Actual Arrival {delay && delay > 0 ? `(${delay}h late)` : "(On time)"}
                  </div>
                  <div className={`font-semibold ${delay && delay > 0 ? "text-red-900" : "text-green-900"}`}>
                    {challan.actualArrival.replace("T", " ")}
                  </div>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Status Update */}
          {(userRole === "admin" || userRole === "operations") && challan.status !== "delivered" && (
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex gap-2">
                {statusProgression.map((status, index) => (
                  <Button
                    key={status}
                    variant={status === challan.status ? "default" : "outline"}
                    disabled={index <= currentStatusIndex}
                    onClick={() => onStatusChange?.(challan.id, status)}
                    className="flex-1"
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
