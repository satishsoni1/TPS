"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

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

interface InvoiceDetailViewProps {
  invoice: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (invoiceId: string, newStatus: string, paidAmount?: number) => void
  userRole: string
}

export default function InvoiceDetailView({
  invoice,
  open,
  onOpenChange,
  onStatusChange,
  userRole,
}: InvoiceDetailViewProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>((invoice.amount - invoice.paidAmount).toString())

  const totalWithGST = invoice.amount + invoice.gst
  const remaining = invoice.amount - invoice.paidAmount

  const handleMarkPaid = () => {
    const paid = Number.parseFloat(paymentAmount) || 0
    if (paid > 0) {
      onStatusChange?.(invoice.id, "paid", invoice.paidAmount + paid)
    }
  }

  const handleIssue = () => {
    onStatusChange?.(invoice.id, "issued")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {invoice.invoiceNumber}
            <Badge
              className={`${
                invoice.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : invoice.status === "issued"
                    ? "bg-blue-100 text-blue-800"
                    : invoice.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {invoice.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Details */}
          <div>
            <h3 className="font-semibold mb-3">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Invoice Date</div>
                <div className="font-semibold">{invoice.invoiceDate}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Due Date</div>
                <div className="font-semibold">{invoice.dueDate}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">LR Number</div>
                <div className="font-semibold">{invoice.lrNumber}</div>
              </Card>
              {invoice.challanNumber && (
                <Card className="p-4 bg-muted">
                  <div className="text-xs text-muted-foreground mb-1">Challan Number</div>
                  <div className="font-semibold">{invoice.challanNumber}</div>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Party Details */}
          <div>
            <h3 className="font-semibold mb-3">Party Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Consigner</div>
                <div className="font-semibold">{invoice.consigner}</div>
              </Card>
              <Card className="p-4 bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Consignee</div>
                <div className="font-semibold">{invoice.consignee || "N/A"}</div>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Financial Summary */}
          <div>
            <h3 className="font-semibold mb-3">Financial Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Base Amount</span>
                <span className="font-bold">
                  ₹{invoice.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">GST (18%)</span>
                <span className="font-bold">₹{invoice.gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-xl font-bold">
                  ₹{totalWithGST.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Status */}
          <div>
            <h3 className="font-semibold mb-3">Payment Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Paid</span>
                <span className="font-bold text-green-600">
                  ₹{invoice.paidAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">Remaining</span>
                <span className="font-bold text-red-600">
                  ₹{remaining.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              {remaining > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(invoice.paidAmount / invoice.amount) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          {userRole === "admin" || userRole === "accounts" ? (
            <div className="space-y-4">
              {invoice.status === "draft" && (
                <Button onClick={handleIssue} className="w-full bg-blue-600 text-white">
                  Issue Invoice
                </Button>
              )}

              {invoice.status !== "paid" && remaining > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Record Payment</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Payment amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <Button onClick={handleMarkPaid} className="bg-green-600 text-white">
                      Pay
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
