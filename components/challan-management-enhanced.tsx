"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChallanDetailView from "./challan-detail-view"

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

const mockChallans: Challan[] = [
  {
    id: "1",
    challanNumber: "CH-2024-001",
    lrNumber: "LR-2024-001",
    vehicleNumber: "MH-01-AB-1234",
    driverName: "Rajesh Kumar",
    driverContact: "9876543210",
    route: "Mumbai → Delhi",
    departure: "2024-12-20 08:00",
    expectedArrival: "2024-12-22 18:00",
    status: "in_transit",
    date: "2024-12-20",
  },
  {
    id: "2",
    challanNumber: "CH-2024-002",
    lrNumber: "LR-2024-002",
    vehicleNumber: "KA-01-CD-5678",
    driverName: "Amit Singh",
    driverContact: "9765432109",
    route: "Bangalore → Chennai",
    departure: "2024-12-19 10:00",
    expectedArrival: "2024-12-20 16:00",
    actualArrival: "2024-12-20 15:30",
    status: "delivered",
    date: "2024-12-19",
  },
]

interface ChallanManagementEnhancedProps {
  userRole: string
}

export default function ChallanManagementEnhanced({ userRole }: ChallanManagementEnhancedProps) {
  const [challans, setChallans] = useState<Challan[]>(mockChallans)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newChallan, setNewChallan] = useState({
    lrNumber: "",
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    expectedArrival: "",
  })

  const filteredChallans = challans.filter((ch) => {
    const matchesSearch =
      ch.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.driverName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ch.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateChallan = () => {
    if (newChallan.lrNumber && newChallan.vehicleNumber) {
      const challan: Challan = {
        id: Date.now().toString(),
        challanNumber: `CH-2024-${String(challans.length + 1).padStart(3, "0")}`,
        lrNumber: newChallan.lrNumber,
        vehicleNumber: newChallan.vehicleNumber,
        driverName: newChallan.driverName,
        driverContact: newChallan.driverContact,
        route: "TBD",
        departure: new Date().toISOString().slice(0, 16),
        expectedArrival: newChallan.expectedArrival,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      }
      setChallans([challan, ...challans])
      setNewChallan({
        lrNumber: "",
        vehicleNumber: "",
        driverName: "",
        driverContact: "",
        expectedArrival: "",
      })
    }
  }

  const handleStatusChange = (challanId: string, newStatus: string) => {
    setChallans(
      challans.map((ch) => {
        if (ch.id === challanId) {
          const updated: Challan = {
            ...ch,
            status: newStatus as Challan["status"],
          }
          if (newStatus === "delivered") {
            updated.actualArrival = new Date().toISOString().slice(0, 16)
          }
          return updated
        }
        return ch
      }),
    )
    setDetailOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: challans.length,
    pending: challans.filter((ch) => ch.status === "pending").length,
    inTransit: challans.filter((ch) => ch.status === "in_transit").length,
    delivered: challans.filter((ch) => ch.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Challans</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">In Transit</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.inTransit}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Delivered</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.delivered}</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Challan</label>
          <Input
            placeholder="Search by challan number, LR, vehicle, or driver..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">Create Challan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">LR Number</label>
                <Input
                  placeholder="LR-2024-001"
                  value={newChallan.lrNumber}
                  onChange={(e) => setNewChallan({ ...newChallan, lrNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                <Input
                  placeholder="MH-01-AB-1234"
                  value={newChallan.vehicleNumber}
                  onChange={(e) => setNewChallan({ ...newChallan, vehicleNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Driver Name</label>
                <Input
                  placeholder="Driver Name"
                  value={newChallan.driverName}
                  onChange={(e) => setNewChallan({ ...newChallan, driverName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Driver Contact</label>
                <Input
                  placeholder="10-digit mobile number"
                  value={newChallan.driverContact}
                  onChange={(e) => setNewChallan({ ...newChallan, driverContact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Arrival</label>
                <Input
                  type="datetime-local"
                  value={newChallan.expectedArrival}
                  onChange={(e) => setNewChallan({ ...newChallan, expectedArrival: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateChallan} className="w-full bg-primary text-primary-foreground">
                Create Challan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Challan Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Challan Number</TableHead>
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Vehicle</TableHead>
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold">Departure</TableHead>
              <TableHead className="font-semibold">Expected Arrival</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallans.map((ch) => (
              <TableRow key={ch.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{ch.challanNumber}</TableCell>
                <TableCell>{ch.lrNumber}</TableCell>
                <TableCell className="font-mono text-sm">{ch.vehicleNumber}</TableCell>
                <TableCell>{ch.driverName}</TableCell>
                <TableCell className="text-sm">{ch.departure.replace("T", " ")}</TableCell>
                <TableCell className="text-sm">{ch.expectedArrival.replace("T", " ")}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ch.status)}>{ch.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedChallan(ch)
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

      {selectedChallan && (
        <ChallanDetailView
          challan={selectedChallan}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
