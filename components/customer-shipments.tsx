"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Shipment {
  id: string
  lrNumber: string
  destination: string
  weight: number
  status: "created" | "in_transit" | "delivered"
  shipDate: string
  expectedDelivery: string
  vehicleNumber?: string
  driverName?: string
}

const customerShipments: { [key: string]: Shipment[] } = {
  "ABC Traders": [
    {
      id: "1",
      lrNumber: "LR-2024-001",
      destination: "Delhi",
      weight: 2500,
      status: "in_transit",
      shipDate: "2024-12-20",
      expectedDelivery: "2024-12-22",
      vehicleNumber: "MH-01-AB-1234",
      driverName: "Rajesh Kumar",
    },
    {
      id: "2",
      lrNumber: "LR-2024-005",
      destination: "Bangalore",
      weight: 1800,
      status: "delivered",
      shipDate: "2024-12-15",
      expectedDelivery: "2024-12-17",
    },
  ],
  "Tech Solutions": [
    {
      id: "3",
      lrNumber: "LR-2024-002",
      destination: "Chennai",
      weight: 1200,
      status: "delivered",
      shipDate: "2024-12-19",
      expectedDelivery: "2024-12-20",
    },
  ],
  "Retail Hub": [
    {
      id: "4",
      lrNumber: "LR-2024-003",
      destination: "Hyderabad",
      weight: 3600,
      status: "created",
      shipDate: "2024-12-21",
      expectedDelivery: "2024-12-24",
    },
  ],
}

interface CustomerShipmentsProps {
  customerName: string
}

export default function CustomerShipments({ customerName }: CustomerShipmentsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const shipments = customerShipments[customerName] || []

  const filteredShipments = shipments.filter(
    (s) =>
      s.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "created":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Search Shipments</label>
        <Input
          placeholder="Search by LR number or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Destination</TableHead>
              <TableHead className="font-semibold">Weight</TableHead>
              <TableHead className="font-semibold">Ship Date</TableHead>
              <TableHead className="font-semibold">Expected Delivery</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <TableRow key={shipment.id} className="hover:bg-muted/50">
                  <TableCell className="font-semibold text-primary">{shipment.lrNumber}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>{shipment.weight} kg</TableCell>
                  <TableCell>{shipment.shipDate}</TableCell>
                  <TableCell>{shipment.expectedDelivery}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(shipment.status)}>{shipment.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedShipment(shipment)}>
                      Track
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No shipments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedShipment && (
        <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shipment Details - {selectedShipment.lrNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Destination</div>
                <div className="font-semibold text-lg">{selectedShipment.destination}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Weight</div>
                <div className="font-semibold">{selectedShipment.weight} kg</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-sm text-muted-foreground mb-1">Current Status</div>
                <div className="mt-2">
                  <Badge className={getStatusColor(selectedShipment.status)}>
                    {selectedShipment.status.replace("_", " ")}
                  </Badge>
                </div>
              </Card>
              {selectedShipment.status === "in_transit" && selectedShipment.vehicleNumber && (
                <>
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-sm text-blue-600 mb-1 font-semibold">Live Tracking</div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-blue-700">Vehicle: </span>
                        <span className="font-semibold text-blue-900">{selectedShipment.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-sm text-blue-700">Driver: </span>
                        <span className="font-semibold text-blue-900">{selectedShipment.driverName}</span>
                      </div>
                    </div>
                  </Card>
                </>
              )}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="text-sm text-green-600 mb-2 font-semibold">Timeline</div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-green-700">Shipped: </span>
                    <span className="font-semibold text-green-900">{selectedShipment.shipDate}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Expected Delivery: </span>
                    <span className="font-semibold text-green-900">{selectedShipment.expectedDelivery}</span>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
