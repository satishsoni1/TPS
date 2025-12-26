"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InvoiceDetailView from "./invoice-detail-view"

interface Invoice {
  id: string
  invoiceNumber: string
  lrNumber: string
  challanNumber?: string
  consigner: string
  consignee: string
  invoiceDate: string
  dueDate: string
  amount: number
  paidAmount: number
  gst: number
  status: "draft" | "issued" | "overdue" | "paid"
  notes?: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    lrNumber: "LR-2024-001",
    challanNumber: "CH-2024-001",
    consigner: "ABC Traders",
    consignee: "XYZ Enterprises",
    invoiceDate: "2024-12-20",
    dueDate: "2024-12-27",
    amount: 5000,
    paidAmount: 0,
    gst: 900,
    status: "issued",
    notes: "Standard freight charges",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    lrNumber: "LR-2024-002",
    challanNumber: "CH-2024-002",
    consigner: "Tech Solutions",
    consignee: "Global Corp",
    invoiceDate: "2024-12-19",
    dueDate: "2024-12-26",
    amount: 3000,
    paidAmount: 3000,
    gst: 540,
    status: "paid",
    notes: "Freight + Handling",
  },
]

interface InvoiceManagementEnhancedProps {
  userRole: string
}

export default function InvoiceManagementEnhanced({ userRole }: InvoiceManagementEnhancedProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    lrNumber: "",
    consigner: "",
    consignee: "",
    amount: "",
    gst: "",
  })

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.consigner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateInvoice = () => {
    if (newInvoice.lrNumber && newInvoice.consigner && newInvoice.amount) {
      const gstAmount = Number.parseFloat(newInvoice.gst) || 0
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        lrNumber: newInvoice.lrNumber,
        consigner: newInvoice.consigner,
        consignee: newInvoice.consignee,
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        amount: Number.parseFloat(newInvoice.amount) || 0,
        paidAmount: 0,
        gst: gstAmount,
        status: "draft",
      }
      setInvoices([invoice, ...invoices])
      setNewInvoice({
        lrNumber: "",
        consigner: "",
        consignee: "",
        amount: "",
        gst: "",
      })
    }
  }

  const handleStatusChange = (invoiceId: string, newStatus: string, paidAmount?: number) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: newStatus as Invoice["status"],
              paidAmount: paidAmount !== undefined ? paidAmount : inv.paidAmount,
            }
          : inv,
      ),
    )
    setDetailOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "issued":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: filteredInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: filteredInvoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
    totalGST: filteredInvoices.reduce((sum, inv) => sum + inv.gst, 0),
  }

  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-t-4 border-t-blue-500">
          <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            ₹{stats.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
        <Card className="p-4 border-t-4 border-t-green-500">
          <div className="text-sm font-medium text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            ₹{stats.paidAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
        <Card className="p-4 border-t-4 border-t-red-500">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            ₹{stats.pendingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
        <Card className="p-4 border-t-4 border-t-purple-500">
          <div className="text-sm font-medium text-muted-foreground">Total GST</div>
          <div className="text-2xl font-bold text-purple-600 mt-2">
            ₹{stats.totalGST.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Invoice</label>
          <Input
            placeholder="Search by invoice number, LR number, or consigner..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "accounts") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Create Invoice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LR Number</label>
                  <Input
                    placeholder="LR-2024-001"
                    value={newInvoice.lrNumber}
                    onChange={(e) => setNewInvoice({ ...newInvoice, lrNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consigner</label>
                  <Input
                    placeholder="Consigner Name"
                    value={newInvoice.consigner}
                    onChange={(e) => setNewInvoice({ ...newInvoice, consigner: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consignee</label>
                  <Input
                    placeholder="Consignee Name (optional)"
                    value={newInvoice.consignee}
                    onChange={(e) => setNewInvoice({ ...newInvoice, consignee: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST 18% (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newInvoice.gst}
                      onChange={(e) => setNewInvoice({ ...newInvoice, gst: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateInvoice} className="w-full bg-primary text-primary-foreground">
                  Create Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Invoice Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Consigner</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">GST</TableHead>
              <TableHead className="font-semibold">Paid</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => {
              const remaining = inv.amount - inv.paidAmount
              return (
                <TableRow key={inv.id} className="hover:bg-muted/50">
                  <TableCell className="font-semibold text-primary">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.lrNumber}</TableCell>
                  <TableCell>{inv.consigner}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{inv.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>₹{inv.gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell className="text-sm">
                    <span className="font-semibold text-green-600">
                      ₹{inv.paidAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                    {remaining > 0 && (
                      <span className="text-muted-foreground">
                        {" "}
                        / ₹{remaining.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{inv.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inv.status)}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(inv)
                        setDetailOpen(true)
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {selectedInvoice && (
        <InvoiceDetailView
          invoice={selectedInvoice}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      )}
    </div>
  )
}
