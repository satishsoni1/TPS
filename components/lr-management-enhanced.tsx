"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LRDetailView from "./lr-detail-view"

interface LR {
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

const mockLRs: LR[] = [
  {
    id: "1",
    lrNumber: "LR-2024-001",
    consigner: "ABC Traders",
    consignee: "XYZ Enterprises",
    origin: "Mumbai",
    destination: "Delhi",
    weight: 2500,
    rate: 5000,
    status: "in_transit",
    date: "2024-12-20",
  },
  {
    id: "2",
    lrNumber: "LR-2024-002",
    consigner: "Tech Solutions",
    consignee: "Global Corp",
    origin: "Bangalore",
    destination: "Chennai",
    weight: 1200,
    rate: 3000,
    status: "delivered",
    date: "2024-12-19",
  },
  {
    id: "3",
    lrNumber: "LR-2024-003",
    consigner: "Retail Hub",
    consignee: "Metro Stores",
    origin: "Pune",
    destination: "Hyderabad",
    weight: 3600,
    rate: 7200,
    status: "created",
    date: "2024-12-21",
  },
]

interface LRManagementEnhancedProps {
  userRole: string
}

export default function LRManagementEnhanced({ userRole }: LRManagementEnhancedProps) {
  const [lrs, setLrs] = useState<LR[]>(mockLRs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedLR, setSelectedLR] = useState<LR | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newLR, setNewLR] = useState({
    consigner: "",
    consignee: "",
    origin: "",
    destination: "",
    weight: "",
    rate: "",
  })

  const filteredLRs = lrs.filter((lr) => {
    const matchesSearch =
      lr.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.consigner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.consignee.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || lr.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateLR = () => {
    if (newLR.consigner && newLR.destination) {
      const lr: LR = {
        id: Date.now().toString(),
        lrNumber: `LR-2024-${String(lrs.length + 1).padStart(3, "0")}`,
        consigner: newLR.consigner,
        consignee: newLR.consignee,
        origin: newLR.origin,
        destination: newLR.destination,
        weight: Number.parseInt(newLR.weight) || 0,
        rate: Number.parseInt(newLR.rate) || 0,
        status: "created",
        date: new Date().toISOString().split("T")[0],
      }
      setLrs([lr, ...lrs])
      setNewLR({
        consigner: "",
        consignee: "",
        origin: "",
        destination: "",
        weight: "",
        rate: "",
      })
    }
  }

  const handleStatusChange = (lrId: string, newStatus: string) => {
    setLrs(lrs.map((lr) => (lr.id === lrId ? { ...lr, status: newStatus as LR["status"] } : lr)))
    setDetailOpen(false)
  }

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

  const stats = {
    total: lrs.length,
    inTransit: lrs.filter((lr) => lr.status === "in_transit").length,
    delivered: lrs.filter((lr) => lr.status === "delivered").length,
    totalRevenue: lrs.reduce((sum, lr) => sum + (lr.weight * lr.rate) / 1000, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total LRs</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">In Transit</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.inTransit}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Delivered</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.delivered}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-primary mt-2">
            ₹{stats.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search LR</label>
          <Input
            placeholder="Search by LR number, consigner, or consignee..."
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
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "operations") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Create New LR</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New LR</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Consigner</label>
                  <Input
                    placeholder="Consigner Name"
                    value={newLR.consigner}
                    onChange={(e) => setNewLR({ ...newLR, consigner: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consignee</label>
                  <Input
                    placeholder="Consignee Name"
                    value={newLR.consignee}
                    onChange={(e) => setNewLR({ ...newLR, consignee: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Origin</label>
                    <Input
                      placeholder="Origin City"
                      value={newLR.origin}
                      onChange={(e) => setNewLR({ ...newLR, origin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination</label>
                    <Input
                      placeholder="Destination City"
                      value={newLR.destination}
                      onChange={(e) => setNewLR({ ...newLR, destination: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newLR.weight}
                      onChange={(e) => setNewLR({ ...newLR, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rate (₹/1000kg)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newLR.rate}
                      onChange={(e) => setNewLR({ ...newLR, rate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateLR} className="w-full bg-primary text-primary-foreground">
                  Create LR
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* LR Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Consigner</TableHead>
              <TableHead className="font-semibold">Consignee</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">Weight</TableHead>
              <TableHead className="font-semibold">Total Value</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLRs.map((lr) => (
              <TableRow key={lr.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{lr.lrNumber}</TableCell>
                <TableCell>{lr.consigner}</TableCell>
                <TableCell>{lr.consignee}</TableCell>
                <TableCell className="text-sm">
                  {lr.origin} → {lr.destination}
                </TableCell>
                <TableCell>{lr.weight} kg</TableCell>
                <TableCell className="font-semibold">
                  ₹{((lr.weight * lr.rate) / 1000).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lr.status)}>{lr.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLR(lr)
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

      {selectedLR && (
        <LRDetailView
          lr={selectedLR}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
