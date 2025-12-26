"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DriverDetailView from "./driver-detail-view"

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

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    licenseNumber: "DL-0001-9876543",
    phone: "9876543210",
    email: "rajesh@transport.com",
    licenseExpiry: "2025-12-15",
    aadharNumber: "1234-5678-9012",
    address: "Mumbai, Maharashtra",
    status: "active",
    totalTrips: 145,
    avgRating: 4.8,
    onTimePercentage: 96,
    joiningDate: "2021-06-15",
  },
  {
    id: "2",
    name: "Amit Singh",
    licenseNumber: "HR-0002-1234567",
    phone: "9765432109",
    email: "amit@transport.com",
    licenseExpiry: "2025-08-22",
    aadharNumber: "2345-6789-0123",
    address: "Haryana",
    status: "active",
    totalTrips: 198,
    avgRating: 4.6,
    onTimePercentage: 92,
    joiningDate: "2020-03-10",
  },
  {
    id: "3",
    name: "Priya Sharma",
    licenseNumber: "KA-0003-5555555",
    phone: "9654321098",
    email: "priya@transport.com",
    licenseExpiry: "2026-05-30",
    aadharNumber: "3456-7890-1234",
    address: "Bangalore, Karnataka",
    status: "active",
    totalTrips: 167,
    avgRating: 4.7,
    onTimePercentage: 94,
    joiningDate: "2019-11-20",
  },
]

interface DriverManagementEnhancedProps {
  userRole: string
}

export default function DriverManagementEnhanced({ userRole }: DriverManagementEnhancedProps) {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
    licenseExpiry: "",
    aadharNumber: "",
    address: "",
  })

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || driver.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateDriver = () => {
    if (newDriver.name && newDriver.licenseNumber) {
      const driver: Driver = {
        id: Date.now().toString(),
        name: newDriver.name,
        licenseNumber: newDriver.licenseNumber,
        phone: newDriver.phone,
        email: newDriver.email,
        licenseExpiry: newDriver.licenseExpiry,
        aadharNumber: newDriver.aadharNumber,
        address: newDriver.address,
        status: "active",
        totalTrips: 0,
        avgRating: 0,
        onTimePercentage: 0,
        joiningDate: new Date().toISOString().split("T")[0],
      }
      setDrivers([driver, ...drivers])
      setNewDriver({
        name: "",
        licenseNumber: "",
        phone: "",
        email: "",
        licenseExpiry: "",
        aadharNumber: "",
        address: "",
      })
    }
  }

  const handleStatusChange = (driverId: string, newStatus: string) => {
    setDrivers(drivers.map((d) => (d.id === driverId ? { ...d, status: newStatus as Driver["status"] } : d)))
    setDetailOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: drivers.length,
    active: drivers.filter((d) => d.status === "active").length,
    avgRating: (drivers.reduce((sum, d) => sum + d.avgRating, 0) / drivers.length).toFixed(2),
    avgOnTime: (drivers.reduce((sum, d) => sum + d.onTimePercentage, 0) / drivers.length).toFixed(1),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Drivers</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Avg Rating</div>
          <div className="text-2xl font-bold text-yellow-600 mt-2">★ {stats.avgRating}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Avg On-Time %</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.avgOnTime}%</div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Driver</label>
          <Input
            placeholder="Search by name, license, or phone..."
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
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "operations") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Add Driver</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    placeholder="Driver Name"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Number</label>
                  <Input
                    placeholder="DL-0001-9876543"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      placeholder="10-digit number"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="driver@email.com"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">License Expiry</label>
                  <Input
                    type="date"
                    value={newDriver.licenseExpiry}
                    onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aadhar Number</label>
                  <Input
                    placeholder="XXXX-XXXX-XXXX"
                    value={newDriver.aadharNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, aadharNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    placeholder="Full Address"
                    value={newDriver.address}
                    onChange={(e) => setNewDriver({ ...newDriver, address: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateDriver} className="w-full bg-primary text-primary-foreground">
                  Add Driver
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
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">License Number</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Total Trips</TableHead>
              <TableHead className="font-semibold">Rating</TableHead>
              <TableHead className="font-semibold">On-Time %</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold">{driver.name}</TableCell>
                <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell className="text-center">{driver.totalTrips}</TableCell>
                <TableCell>
                  <span className="text-yellow-600 font-semibold">★ {driver.avgRating.toFixed(1)}</span>
                </TableCell>
                <TableCell>
                  <span className={driver.onTimePercentage >= 90 ? "text-green-600 font-semibold" : "text-orange-600"}>
                    {driver.onTimePercentage}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDriver(driver)
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

      {selectedDriver && (
        <DriverDetailView
          driver={selectedDriver}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
