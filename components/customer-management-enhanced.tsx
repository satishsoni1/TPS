"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomerDetailView from "./customer-detail-view"

interface Customer {
  id: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  gstNumber: string
  panNumber: string
  status: "active" | "inactive" | "suspended"
  totalShipments: number
  totalRevenue: number
  outstandingBalance: number
  registrationDate: string
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    companyName: "ABC Traders",
    contactPerson: "Rajesh Patel",
    phone: "9876543210",
    email: "abc.traders@email.com",
    address: "Plot 123, Industrial Area",
    city: "Mumbai",
    state: "Maharashtra",
    gstNumber: "27AABCU9603R1Z5",
    panNumber: "AABCU9603R",
    status: "active",
    totalShipments: 145,
    totalRevenue: 725000,
    outstandingBalance: 45000,
    registrationDate: "2021-06-15",
  },
  {
    id: "2",
    companyName: "Tech Solutions Ltd",
    contactPerson: "Priya Singh",
    phone: "9765432109",
    email: "tech.sol@email.com",
    address: "Tech Park Building A",
    city: "Bangalore",
    state: "Karnataka",
    gstNumber: "29AAGCU8604R1Z0",
    panNumber: "AAGCU8604R",
    status: "active",
    totalShipments: 98,
    totalRevenue: 490000,
    outstandingBalance: 25000,
    registrationDate: "2020-03-10",
  },
  {
    id: "3",
    companyName: "Retail Hub Inc",
    contactPerson: "Vikram Kumar",
    phone: "9654321098",
    email: "retail.hub@email.com",
    address: "Shopping Complex, Main Road",
    city: "Delhi",
    state: "Delhi",
    gstNumber: "07AADCA5055K2Z2",
    panNumber: "AADCA5055K",
    status: "active",
    totalShipments: 76,
    totalRevenue: 380000,
    outstandingBalance: 15000,
    registrationDate: "2022-08-20",
  },
]

interface CustomerManagementEnhancedProps {
  userRole: string
}

export default function CustomerManagementEnhanced({ userRole }: CustomerManagementEnhancedProps) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    panNumber: "",
  })

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateCustomer = () => {
    if (newCustomer.companyName && newCustomer.gstNumber) {
      const customer: Customer = {
        id: Date.now().toString(),
        companyName: newCustomer.companyName,
        contactPerson: newCustomer.contactPerson,
        phone: newCustomer.phone,
        email: newCustomer.email,
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        gstNumber: newCustomer.gstNumber,
        panNumber: newCustomer.panNumber,
        status: "active",
        totalShipments: 0,
        totalRevenue: 0,
        outstandingBalance: 0,
        registrationDate: new Date().toISOString().split("T")[0],
      }
      setCustomers([customer, ...customers])
      setNewCustomer({
        companyName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        gstNumber: "",
        panNumber: "",
      })
    }
  }

  const handleStatusChange = (customerId: string, newStatus: string) => {
    setCustomers(customers.map((c) => (c.id === customerId ? { ...c, status: newStatus as Customer["status"] } : c)))
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
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
    totalOutstanding: customers.reduce((sum, c) => sum + c.outstandingBalance, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Customers</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.active}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Outstanding</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">₹{(stats.totalOutstanding / 1000).toFixed(0)}k</div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Customer</label>
          <Input
            placeholder="Search by company name, contact, or GST..."
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
        {(userRole === "admin" || userRole === "accounts") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Add Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    placeholder="Company Name"
                    value={newCustomer.companyName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <Input
                    placeholder="Contact Person Name"
                    value={newCustomer.contactPerson}
                    onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      placeholder="10-digit number"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="email@company.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    placeholder="Full Address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      placeholder="City"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      placeholder="State"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Number</label>
                    <Input
                      placeholder="27AABCU9603R1Z5"
                      value={newCustomer.gstNumber}
                      onChange={(e) => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PAN Number</label>
                    <Input
                      placeholder="AABCU9603R"
                      value={newCustomer.panNumber}
                      onChange={(e) => setNewCustomer({ ...newCustomer, panNumber: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCustomer} className="w-full bg-primary text-primary-foreground">
                  Add Customer
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
              <TableHead className="font-semibold">Company Name</TableHead>
              <TableHead className="font-semibold">Contact Person</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">City</TableHead>
              <TableHead className="font-semibold">Total Shipments</TableHead>
              <TableHead className="font-semibold">Outstanding</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{customer.companyName}</TableCell>
                <TableCell>{customer.contactPerson}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell className="text-center">{customer.totalShipments}</TableCell>
                <TableCell>
                  <span
                    className={customer.outstandingBalance > 0 ? "text-orange-600 font-semibold" : "text-green-600"}
                  >
                    ₹{customer.outstandingBalance.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer)
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

      {selectedCustomer && (
        <CustomerDetailView
          customer={selectedCustomer}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
