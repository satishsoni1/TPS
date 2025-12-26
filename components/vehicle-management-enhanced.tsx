"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VehicleDetailView from "./vehicle-detail-view"

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

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleNumber: "MH-01-AB-1234",
    type: "10 Wheeler",
    capacity: 18000,
    owner: "ABC Transport",
    registrationDate: "2022-01-15",
    insuranceExpiry: "2025-06-15",
    pollutionCertExpiry: "2025-03-20",
    status: "active",
    totalTrips: 145,
    avgLoad: 15600,
    lastMaintenance: "2024-12-10",
  },
  {
    id: "2",
    vehicleNumber: "KA-01-CD-5678",
    type: "7.5 Wheeler",
    capacity: 12000,
    owner: "XYZ Logistics",
    registrationDate: "2021-08-22",
    insuranceExpiry: "2025-08-22",
    pollutionCertExpiry: "2025-05-10",
    status: "active",
    totalTrips: 198,
    avgLoad: 11200,
    lastMaintenance: "2024-11-25",
  },
  {
    id: "3",
    vehicleNumber: "DL-01-EF-9012",
    type: "4 Wheeler",
    capacity: 5000,
    owner: "ABC Transport",
    registrationDate: "2023-03-10",
    insuranceExpiry: "2025-03-10",
    pollutionCertExpiry: "2025-01-15",
    status: "maintenance",
    totalTrips: 67,
    avgLoad: 4500,
    lastMaintenance: "2024-12-18",
  },
]

interface VehicleManagementEnhancedProps {
  userRole: string
}

export default function VehicleManagementEnhanced({ userRole }: VehicleManagementEnhancedProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "",
    type: "",
    capacity: "",
    owner: "",
    registrationDate: "",
    insuranceExpiry: "",
    pollutionCertExpiry: "",
  })

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateVehicle = () => {
    if (newVehicle.vehicleNumber && newVehicle.type) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        vehicleNumber: newVehicle.vehicleNumber,
        type: newVehicle.type,
        capacity: Number.parseInt(newVehicle.capacity) || 0,
        owner: newVehicle.owner,
        registrationDate: newVehicle.registrationDate,
        insuranceExpiry: newVehicle.insuranceExpiry,
        pollutionCertExpiry: newVehicle.pollutionCertExpiry,
        status: "active",
        totalTrips: 0,
        avgLoad: 0,
        lastMaintenance: new Date().toISOString().split("T")[0],
      }
      setVehicles([vehicle, ...vehicles])
      setNewVehicle({
        vehicleNumber: "",
        type: "",
        capacity: "",
        owner: "",
        registrationDate: "",
        insuranceExpiry: "",
        pollutionCertExpiry: "",
      })
    }
  }

  const handleStatusChange = (vehicleId: string, newStatus: string) => {
    setVehicles(vehicles.map((v) => (v.id === vehicleId ? { ...v, status: newStatus as Vehicle["status"] } : v)))
    setDetailOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "active").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    totalCapacity: vehicles.reduce((sum, v) => sum + v.capacity, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Vehicles</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">In Maintenance</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{stats.maintenance}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Capacity</div>
          <div className="text-2xl font-bold text-primary mt-2">{(stats.totalCapacity / 1000).toFixed(1)}k kg</div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Vehicle</label>
          <Input
            placeholder="Search by vehicle number, owner, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "operations") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Add Vehicle</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                  <Input
                    placeholder="MH-01-AB-1234"
                    value={newVehicle.vehicleNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <Select
                    value={newVehicle.type}
                    onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                      <SelectItem value="7.5 Wheeler">7.5 Wheeler</SelectItem>
                      <SelectItem value="10 Wheeler">10 Wheeler</SelectItem>
                      <SelectItem value="Bus">Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity (kg)</label>
                  <Input
                    type="number"
                    placeholder="18000"
                    value={newVehicle.capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Owner</label>
                  <Input
                    placeholder="Owner Name"
                    value={newVehicle.owner}
                    onChange={(e) => setNewVehicle({ ...newVehicle, owner: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Date</label>
                    <Input
                      type="date"
                      value={newVehicle.registrationDate}
                      onChange={(e) => setNewVehicle({ ...newVehicle, registrationDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Insurance Expiry</label>
                    <Input
                      type="date"
                      value={newVehicle.insuranceExpiry}
                      onChange={(e) => setNewVehicle({ ...newVehicle, insuranceExpiry: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pollution Cert Expiry</label>
                  <Input
                    type="date"
                    value={newVehicle.pollutionCertExpiry}
                    onChange={(e) => setNewVehicle({ ...newVehicle, pollutionCertExpiry: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateVehicle} className="w-full bg-primary text-primary-foreground">
                  Add Vehicle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Vehicle Number</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Capacity</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Total Trips</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary font-mono">{vehicle.vehicleNumber}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.capacity} kg</TableCell>
                <TableCell>{vehicle.owner}</TableCell>
                <TableCell className="text-center">{vehicle.totalTrips}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedVehicle(vehicle)
                      setDetailOpen(true)
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedVehicle && (
        <VehicleDetailView
          vehicle={selectedVehicle}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
