"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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

interface LRManagementProps {
  userRole: string
}

export default function LRManagement({ userRole }: LRManagementProps) {
  const [lrs, setLrs] = useState<LR[]>(mockLRs)
  const [searchTerm, setSearchTerm] = useState("")
  const [newLR, setNewLR] = useState({
    consigner: "",
    consignee: "",
    origin: "",
    destination: "",
    weight: "",
    rate: "",
  })

  const filteredLRs = lrs.filter(
    (lr) =>
      lr.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.consigner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lr.consignee.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search LR</label>
          <Input
            placeholder="Search by LR number, consigner, or consignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                    <label className="block text-sm font-medium mb-1">Rate (₹)</label>
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

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Consigner</TableHead>
              <TableHead className="font-semibold">Consignee</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">Weight</TableHead>
              <TableHead className="font-semibold">Rate</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
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
                <TableCell>₹{lr.rate.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lr.status)}>{lr.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>{lr.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
