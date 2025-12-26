"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RouteDetailView from "./route-detail-view"

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

const mockRoutes: Route[] = [
  {
    id: "1",
    routeName: "Mumbai-Delhi Express",
    origin: "Mumbai",
    destination: "Delhi",
    distance: 1440,
    estimatedDays: 2,
    ratePerTon: 2500,
    ratePerKg: 2.5,
    minimumFreight: 5000,
    activeChallans: 5,
    completedShipments: 145,
    avgLoadPercentage: 87,
    status: "active",
    createdDate: "2022-01-15",
  },
  {
    id: "2",
    routeName: "Bangalore-Chennai Route",
    origin: "Bangalore",
    destination: "Chennai",
    distance: 350,
    estimatedDays: 1,
    ratePerTon: 1800,
    ratePerKg: 1.8,
    minimumFreight: 3000,
    activeChallans: 3,
    completedShipments: 98,
    avgLoadPercentage: 91,
    status: "active",
    createdDate: "2021-08-22",
  },
  {
    id: "3",
    routeName: "Pune-Hyderabad Lane",
    origin: "Pune",
    destination: "Hyderabad",
    distance: 560,
    estimatedDays: 1,
    ratePerTon: 2000,
    ratePerKg: 2.0,
    minimumFreight: 4000,
    activeChallans: 2,
    completedShipments: 76,
    avgLoadPercentage: 84,
    status: "active",
    createdDate: "2021-12-10",
  },
  {
    id: "4",
    routeName: "Delhi-Kolkata Highway",
    origin: "Delhi",
    destination: "Kolkata",
    distance: 1440,
    estimatedDays: 2,
    ratePerTon: 2200,
    ratePerKg: 2.2,
    minimumFreight: 5000,
    activeChallans: 0,
    completedShipments: 52,
    avgLoadPercentage: 78,
    status: "inactive",
    createdDate: "2020-06-05",
  },
]

interface RouteManagementEnhancedProps {
  userRole: string
}

export default function RouteManagementEnhanced({ userRole }: RouteManagementEnhancedProps) {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newRoute, setNewRoute] = useState({
    routeName: "",
    origin: "",
    destination: "",
    distance: "",
    estimatedDays: "",
    ratePerTon: "",
    ratePerKg: "",
    minimumFreight: "",
  })

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || route.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateRoute = () => {
    if (newRoute.routeName && newRoute.origin && newRoute.destination) {
      const route: Route = {
        id: Date.now().toString(),
        routeName: newRoute.routeName,
        origin: newRoute.origin,
        destination: newRoute.destination,
        distance: Number.parseInt(newRoute.distance) || 0,
        estimatedDays: Number.parseInt(newRoute.estimatedDays) || 0,
        ratePerTon: Number.parseInt(newRoute.ratePerTon) || 0,
        ratePerKg: Number.parseFloat(newRoute.ratePerKg) || 0,
        minimumFreight: Number.parseInt(newRoute.minimumFreight) || 0,
        activeChallans: 0,
        completedShipments: 0,
        avgLoadPercentage: 0,
        status: "active",
        createdDate: new Date().toISOString().split("T")[0],
      }
      setRoutes([route, ...routes])
      setNewRoute({
        routeName: "",
        origin: "",
        destination: "",
        distance: "",
        estimatedDays: "",
        ratePerTon: "",
        ratePerKg: "",
        minimumFreight: "",
      })
    }
  }

  const handleStatusChange = (routeId: string, newStatus: string) => {
    setRoutes(routes.map((r) => (r.id === routeId ? { ...r, status: newStatus as Route["status"] } : r)))
    setDetailOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: routes.length,
    active: routes.filter((r) => r.status === "active").length,
    totalDistance: routes.reduce((sum, r) => sum + r.distance, 0),
    totalShipments: routes.reduce((sum, r) => sum + r.completedShipments, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Routes</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Active Routes</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Distance</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.totalDistance.toLocaleString()} km</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Shipments</div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{stats.totalShipments}</div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Route</label>
          <Input
            placeholder="Search by route name, origin, or destination..."
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
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "operations") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Add Route</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">Route Name</label>
                  <Input
                    placeholder="Mumbai-Delhi Express"
                    value={newRoute.routeName}
                    onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Origin City</label>
                    <Input
                      placeholder="Origin"
                      value={newRoute.origin}
                      onChange={(e) => setNewRoute({ ...newRoute, origin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination City</label>
                    <Input
                      placeholder="Destination"
                      value={newRoute.destination}
                      onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Distance (km)</label>
                    <Input
                      type="number"
                      placeholder="1440"
                      value={newRoute.distance}
                      onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Est. Days</label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={newRoute.estimatedDays}
                      onChange={(e) => setNewRoute({ ...newRoute, estimatedDays: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Rate/Ton (₹)</label>
                    <Input
                      type="number"
                      placeholder="2500"
                      value={newRoute.ratePerTon}
                      onChange={(e) => setNewRoute({ ...newRoute, ratePerTon: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rate/kg (₹)</label>
                    <Input
                      type="number"
                      placeholder="2.5"
                      step="0.1"
                      value={newRoute.ratePerKg}
                      onChange={(e) => setNewRoute({ ...newRoute, ratePerKg: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Freight (₹)</label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={newRoute.minimumFreight}
                    onChange={(e) => setNewRoute({ ...newRoute, minimumFreight: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateRoute} className="w-full bg-primary text-primary-foreground">
                  Add Route
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
              <TableHead className="font-semibold">Route Name</TableHead>
              <TableHead className="font-semibold">Origin → Destination</TableHead>
              <TableHead className="font-semibold">Distance</TableHead>
              <TableHead className="font-semibold">Rate/ton</TableHead>
              <TableHead className="font-semibold">Active</TableHead>
              <TableHead className="font-semibold">Completed</TableHead>
              <TableHead className="font-semibold">Avg Load %</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.map((route) => (
              <TableRow key={route.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{route.routeName}</TableCell>
                <TableCell className="text-sm">
                  {route.origin} → {route.destination}
                </TableCell>
                <TableCell>{route.distance} km</TableCell>
                <TableCell className="font-semibold">₹{route.ratePerTon.toLocaleString()}</TableCell>
                <TableCell className="text-center">{route.activeChallans}</TableCell>
                <TableCell className="text-center">{route.completedShipments}</TableCell>
                <TableCell>
                  <span className={route.avgLoadPercentage >= 85 ? "text-green-600 font-semibold" : "text-orange-600"}>
                    {route.avgLoadPercentage}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(route.status)}>{route.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRoute(route)
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

      {selectedRoute && (
        <RouteDetailView
          route={selectedRoute}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
