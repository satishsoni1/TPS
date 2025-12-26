"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Challan {
  id: string
  challanNumber: string
  lrNumber: string
  vehicleNumber: string
  driverName: string
  route: string
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
    route: "Mumbai → Delhi",
    status: "in_transit",
    date: "2024-12-20",
  },
  {
    id: "2",
    challanNumber: "CH-2024-002",
    lrNumber: "LR-2024-002",
    vehicleNumber: "KA-01-CD-5678",
    driverName: "Amit Singh",
    route: "Bangalore → Chennai",
    status: "delivered",
    date: "2024-12-19",
  },
]

interface ChallanManagementProps {
  userRole: string
}

export default function ChallanManagement({ userRole }: ChallanManagementProps) {
  const [challans, setChallans] = useState<Challan[]>(mockChallans)
  const [searchTerm, setSearchTerm] = useState("")
  const [newChallan, setNewChallan] = useState({
    lrNumber: "",
    vehicleNumber: "",
    driverName: "",
  })

  const filteredChallans = challans.filter(
    (ch) =>
      ch.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateChallan = () => {
    if (newChallan.lrNumber && newChallan.vehicleNumber) {
      const challan: Challan = {
        id: Date.now().toString(),
        challanNumber: `CH-2024-${String(challans.length + 1).padStart(3, "0")}`,
        lrNumber: newChallan.lrNumber,
        vehicleNumber: newChallan.vehicleNumber,
        driverName: newChallan.driverName,
        route: "TBD",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      }
      setChallans([challan, ...challans])
      setNewChallan({ lrNumber: "", vehicleNumber: "", driverName: "" })
    }
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

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Challan</label>
          <Input
            placeholder="Search by challan number, LR number, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">Create Challan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Challan Against LR</DialogTitle>
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
              <Button onClick={handleCreateChallan} className="w-full bg-primary text-primary-foreground">
                Create Challan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Challan Number</TableHead>
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Vehicle</TableHead>
              <TableHead className="font-semibold">Driver</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallans.map((ch) => (
              <TableRow key={ch.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{ch.challanNumber}</TableCell>
                <TableCell>{ch.lrNumber}</TableCell>
                <TableCell className="font-mono text-sm">{ch.vehicleNumber}</TableCell>
                <TableCell>{ch.driverName}</TableCell>
                <TableCell>{ch.route}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ch.status)}>{ch.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>{ch.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
