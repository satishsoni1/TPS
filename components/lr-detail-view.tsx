"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface LRDetailViewProps {
  lr: {
    id: string
    lrNumber: string
    consigner: string
    consignee: string
    origin: string
    destination: string
    weight: number
    rate: number
    status: "created" | "in_transit" | "delivered" | "pending"
    date: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (lrId: string, newStatus: string) => void
  userRole: string
}

export default function LRDetailView({ lr, open, onOpenChange, onStatusChange, userRole }: LRDetailViewProps) {
  const totalValue = lr.weight * (lr.rate / 1000)

  const statusProgression = ["created", "in_transit", "delivered"]
  const currentStatusIndex = statusProgression.indexOf(lr.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>{lr.lrNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Badge className="bg-blue-100 text-blue-800">{lr.status.replace("_", " ")}</Badge>
            </div>
          </div>

          <Separator />

          {/* Shipment Details */}
          <div>
            <h3 className="font-semibold mb-3">Shipment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Consigner</div>
                <div className="font-semibold">{lr.consigner}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Consignee</div>
                <div className="font-semibold">{lr.consignee}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Origin</div>
                <div className="font-semibold">{lr.origin}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Destination</div>
                <div className="font-semibold">{lr.destination}</div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Weight and Rate */}
          <div>
            <h3 className="font-semibold mb-3">Charge Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Weight</div>
                <div className="text-xl font-bold">{lr.weight} kg</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Rate/1000kg</div>
                <div className="text-xl font-bold">₹{lr.rate.toLocaleString()}</div>
              </Card>
              <Card className="p-4 bg-green-100">
                <div className="text-xs text-green-800 mb-1">Total Value</div>
                <div className="text-xl font-bold text-green-800">₹{totalValue.toLocaleString()}</div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Status Update Actions */}
          {(userRole === "admin" || userRole === "operations") && lr.status !== "delivered" && (
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex gap-2">
                {statusProgression.map((status, index) => (
                  <Button
                    key={status}
                    variant={status === lr.status ? "default" : "outline"}
                    disabled={index <= currentStatusIndex}
                    onClick={() => onStatusChange?.(lr.id, status)}
                    className="flex-1"
                  >
                    {status.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Additional Info */}
          <div>
            <h3 className="font-semibold mb-3">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created Date:</span>
                <div className="font-semibold mt-1">{lr.date}</div>
              </div>
              <div>
                <span className="text-muted-foreground">LR ID:</span>
                <div className="font-semibold mt-1">{lr.id}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
