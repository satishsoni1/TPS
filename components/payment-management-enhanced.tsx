"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaymentDetailView from "./payment-detail-view"

interface Payment {
  id: string
  invoiceNumber: string
  consigner: string
  invoiceAmount: number
  paidAmount: number
  paymentDate: string
  paymentMode: "cash" | "bank" | "upi" | "cheque"
  transactionRef: string
  status: "paid" | "partial" | "unpaid"
  dueDate: string
  remainingBalance: number
  receivedBy: string
}

const mockPayments: Payment[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    consigner: "ABC Traders",
    invoiceAmount: 45000,
    paidAmount: 45000,
    paymentDate: "2024-12-18",
    paymentMode: "bank",
    transactionRef: "TXN123456789",
    status: "paid",
    dueDate: "2024-12-25",
    remainingBalance: 0,
    receivedBy: "Rajesh Kumar",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    consigner: "Tech Solutions",
    invoiceAmount: 75000,
    paidAmount: 45000,
    paymentDate: "2024-12-15",
    paymentMode: "bank",
    transactionRef: "TXN987654321",
    status: "partial",
    dueDate: "2024-12-30",
    remainingBalance: 30000,
    receivedBy: "Priya Sharma",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    consigner: "Retail Hub",
    invoiceAmount: 38000,
    paidAmount: 0,
    paymentDate: "",
    paymentMode: "cash",
    transactionRef: "",
    status: "unpaid",
    dueDate: "2024-12-28",
    remainingBalance: 38000,
    receivedBy: "",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    consigner: "ABC Traders",
    invoiceAmount: 52000,
    paidAmount: 52000,
    paymentDate: "2024-12-10",
    paymentMode: "upi",
    transactionRef: "UPI123ABCD456",
    status: "paid",
    dueDate: "2024-12-20",
    remainingBalance: 0,
    receivedBy: "Amit Singh",
  },
]

interface PaymentManagementEnhancedProps {
  userRole: string
}

export default function PaymentManagementEnhanced({ userRole }: PaymentManagementEnhancedProps) {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newPayment, setNewPayment] = useState({
    invoiceNumber: "",
    consigner: "",
    invoiceAmount: "",
    paidAmount: "",
    paymentMode: "bank" as "cash" | "bank" | "upi" | "cheque",
    transactionRef: "",
    receivedBy: "",
    paymentDate: "",
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.consigner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionRef.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRecordPayment = () => {
    if (newPayment.invoiceNumber && newPayment.paidAmount) {
      const invoiceAmount = Number.parseInt(newPayment.invoiceAmount) || 0
      const paidAmount = Number.parseInt(newPayment.paidAmount) || 0
      const remainingBalance = invoiceAmount - paidAmount

      const payment: Payment = {
        id: Date.now().toString(),
        invoiceNumber: newPayment.invoiceNumber,
        consigner: newPayment.consigner,
        invoiceAmount,
        paidAmount,
        paymentDate: newPayment.paymentDate || new Date().toISOString().split("T")[0],
        paymentMode: newPayment.paymentMode,
        transactionRef: newPayment.transactionRef,
        status: remainingBalance === 0 ? "paid" : remainingBalance < invoiceAmount ? "partial" : "unpaid",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        remainingBalance,
        receivedBy: newPayment.receivedBy,
      }
      setPayments([payment, ...payments])
      setNewPayment({
        invoiceNumber: "",
        consigner: "",
        invoiceAmount: "",
        paidAmount: "",
        paymentMode: "bank",
        transactionRef: "",
        receivedBy: "",
        paymentDate: "",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-orange-100 text-orange-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    total: payments.length,
    paid: payments.filter((p) => p.status === "paid").length,
    partial: payments.filter((p) => p.status === "partial").length,
    unpaid: payments.filter((p) => p.status === "unpaid").length,
    totalCollected: payments.reduce((sum, p) => sum + p.paidAmount, 0),
    totalOutstanding: payments.reduce((sum, p) => sum + p.remainingBalance, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Invoices</div>
          <div className="text-2xl font-bold mt-2">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Collection</div>
          <div className="text-2xl font-bold text-green-600 mt-2">₹{(stats.totalCollected / 100000).toFixed(1)}L</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Outstanding</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">₹{(stats.totalOutstanding / 1000).toFixed(0)}k</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Collection %</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {((stats.totalCollected / (stats.totalCollected + stats.totalOutstanding)) * 100).toFixed(1)}%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-3 border-l-4 border-l-green-500">
          <div className="text-sm font-medium text-muted-foreground">Paid</div>
          <div className="text-xl font-bold text-green-600 mt-1">{stats.paid}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-orange-500">
          <div className="text-sm font-medium text-muted-foreground">Partial</div>
          <div className="text-xl font-bold text-orange-600 mt-1">{stats.partial}</div>
        </Card>
        <Card className="p-3 border-l-4 border-l-red-500">
          <div className="text-sm font-medium text-muted-foreground">Unpaid</div>
          <div className="text-xl font-bold text-red-600 mt-1">{stats.unpaid}</div>
        </Card>
        <Card className="p-3">
          <div className="text-sm font-medium text-muted-foreground">DSO (Days)</div>
          <div className="text-xl font-bold text-purple-600 mt-1">15</div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Payment</label>
          <Input
            placeholder="Search by invoice, consigner, or transaction ref..."
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(userRole === "admin" || userRole === "accounts") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Number</label>
                  <Input
                    placeholder="INV-2024-001"
                    value={newPayment.invoiceNumber}
                    onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consigner</label>
                  <Input
                    placeholder="Customer Name"
                    value={newPayment.consigner}
                    onChange={(e) => setNewPayment({ ...newPayment, consigner: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Invoice Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="45000"
                      value={newPayment.invoiceAmount}
                      onChange={(e) => setNewPayment({ ...newPayment, invoiceAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Paid Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="45000"
                      value={newPayment.paidAmount}
                      onChange={(e) => setNewPayment({ ...newPayment, paidAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Mode</label>
                  <Select
                    value={newPayment.paymentMode}
                    onValueChange={(value) =>
                      setNewPayment({ ...newPayment, paymentMode: value as "cash" | "bank" | "upi" | "cheque" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Transaction Reference</label>
                  <Input
                    placeholder="TXN123456789"
                    value={newPayment.transactionRef}
                    onChange={(e) => setNewPayment({ ...newPayment, transactionRef: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Received By</label>
                  <Input
                    placeholder="Staff Name"
                    value={newPayment.receivedBy}
                    onChange={(e) => setNewPayment({ ...newPayment, receivedBy: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Date</label>
                  <Input
                    type="date"
                    value={newPayment.paymentDate}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                  />
                </div>
                <Button onClick={handleRecordPayment} className="w-full bg-primary text-primary-foreground">
                  Record Payment
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
              <TableHead className="font-semibold">Invoice</TableHead>
              <TableHead className="font-semibold">Consigner</TableHead>
              <TableHead className="font-semibold">Invoice Amt</TableHead>
              <TableHead className="font-semibold">Paid Amt</TableHead>
              <TableHead className="font-semibold">Remaining</TableHead>
              <TableHead className="font-semibold">Payment Date</TableHead>
              <TableHead className="font-semibold">Mode</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{payment.invoiceNumber}</TableCell>
                <TableCell>{payment.consigner}</TableCell>
                <TableCell>₹{payment.invoiceAmount.toLocaleString()}</TableCell>
                <TableCell className="font-semibold text-green-600">₹{payment.paidAmount.toLocaleString()}</TableCell>
                <TableCell
                  className={
                    payment.remainingBalance > 0 ? "font-semibold text-orange-600" : "font-semibold text-green-600"
                  }
                >
                  ₹{payment.remainingBalance.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm">{payment.paymentDate || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.paymentMode}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment)
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

      {selectedPayment && (
        <PaymentDetailView
          payment={selectedPayment}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          userRole={userRole}
        />
      )}
    </div>
  )
}
