"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Invoice {
  id: string
  invoiceNumber: string
  lrNumber: string
  amount: number
  gst: number
  date: string
  dueDate: string
  status: "draft" | "issued" | "paid" | "overdue"
}

const customerInvoices: { [key: string]: Invoice[] } = {
  "ABC Traders": [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      lrNumber: "LR-2024-001",
      amount: 5000,
      gst: 900,
      date: "2024-12-20",
      dueDate: "2024-12-27",
      status: "issued",
    },
  ],
  "Tech Solutions": [
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      lrNumber: "LR-2024-002",
      amount: 3000,
      gst: 540,
      date: "2024-12-19",
      dueDate: "2024-12-26",
      status: "paid",
    },
  ],
  "Retail Hub": [
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      lrNumber: "LR-2024-003",
      amount: 7200,
      gst: 1296,
      date: "2024-12-21",
      dueDate: "2024-12-28",
      status: "draft",
    },
  ],
}

interface CustomerInvoicesProps {
  customerName: string
}

export default function CustomerInvoices({ customerName }: CustomerInvoicesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const invoices = customerInvoices[customerName] || []

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: filteredInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: filteredInvoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0),
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            ₹{stats.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            ₹{stats.paidAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            ₹{stats.pendingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </Card>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Search Invoices</label>
        <Input
          placeholder="Search by invoice number or LR number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="font-semibold">Invoice Number</TableHead>
              <TableHead className="font-semibold">LR Number</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">GST</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/50">
                  <TableCell className="font-semibold text-primary">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.lrNumber}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{inv.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell>₹{inv.gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inv.status)}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No invoices found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
