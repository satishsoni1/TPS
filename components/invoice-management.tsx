"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Invoice {
  id: string
  invoiceNumber: string
  lrNumber: string
  consigner: string
  amount: number
  status: "draft" | "issued" | "paid" | "pending"
  date: string
  dueDate: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    lrNumber: "LR-2024-001",
    consigner: "ABC Traders",
    amount: 5000,
    status: "issued",
    date: "2024-12-20",
    dueDate: "2024-12-27",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    lrNumber: "LR-2024-002",
    consigner: "Tech Solutions",
    amount: 3000,
    status: "paid",
    date: "2024-12-19",
    dueDate: "2024-12-26",
  },
]

interface InvoiceManagementProps {
  userRole: string
}

export default function InvoiceManagement({ userRole }: InvoiceManagementProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [newInvoice, setNewInvoice] = useState({
    lrNumber: "",
    consigner: "",
    amount: "",
  })

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.consigner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateInvoice = () => {
    if (newInvoice.lrNumber && newInvoice.consigner && newInvoice.amount) {
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        lrNumber: newInvoice.lrNumber,
        consigner: newInvoice.consigner,
        amount: Number.parseInt(newInvoice.amount) || 0,
        status: "draft",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }
      setInvoices([invoice, ...invoices])
      setNewInvoice({ lrNumber: "", consigner: "", amount: "" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "issued":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = filteredInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
          <div className="text-2xl font-bold mt-2">₹{totalAmount.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold mt-2 text-green-600">₹{paidAmount.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold mt-2 text-red-600">₹{(totalAmount - paidAmount).toLocaleString()}</div>
        </Card>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search Invoice</label>
          <Input
            placeholder="Search by invoice number, LR number, or consigner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {userRole === "admin" ||
          (userRole === "accounts" && (
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
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateInvoice} className="w-full bg-primary text-primary-foreground">
                    Create Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Consigner</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-primary">{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.lrNumber}</TableCell>
                <TableCell>{inv.consigner}</TableCell>
                <TableCell className="font-semibold">₹{inv.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(inv.status)}>{inv.status}</Badge>
                </TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
