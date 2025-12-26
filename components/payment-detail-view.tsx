"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

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

interface PaymentDetailViewProps {
  payment: Payment
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: string
}

export default function PaymentDetailView({ payment, open, onOpenChange, userRole }: PaymentDetailViewProps) {
  const paymentPercentage = (payment.paidAmount / payment.invoiceAmount) * 100
  const isOverdue = new Date(payment.dueDate) < new Date() && payment.status !== "paid"
  const daysUntilDue = Math.floor((new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[600px] overflow-y-auto">
          {/* Payment Header */}
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Invoice Number</div>
                <div className="text-2xl font-bold font-mono mt-1">{payment.invoiceNumber}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Consigner</div>
                <div className="text-xl font-semibold mt-1">{payment.consigner}</div>
              </div>
            </div>
          </Card>

          {/* Amount Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Invoice Amount</div>
                  <div className="text-lg font-semibold">₹{payment.invoiceAmount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge
                    className={
                      payment.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "partial"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Amount Paid</div>
                  <div className="text-lg font-bold text-green-600">₹{payment.paidAmount.toLocaleString()}</div>
                </div>
                <CheckCircle2 className="text-green-600 w-6 h-6" />
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Remaining Balance</div>
                  <div className="text-lg font-bold text-orange-600">₹{payment.remainingBalance.toLocaleString()}</div>
                </div>
                {payment.remainingBalance > 0 && <AlertCircle className="text-orange-600 w-6 h-6" />}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Payment Progress</span>
                  <span className="font-semibold">{paymentPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    style={{ width: `${paymentPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Details */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Payment Date</div>
                <div className="text-lg font-semibold mt-1">{payment.paymentDate || "Pending"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Payment Mode</div>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {payment.paymentMode}
                  </Badge>
                </div>
              </div>
              {payment.transactionRef && (
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Transaction Reference</div>
                  <div className="text-lg font-mono font-semibold mt-1">{payment.transactionRef}</div>
                </div>
              )}
              {payment.receivedBy && (
                <div className="col-span-2">
                  <div className="text-sm font-medium text-muted-foreground">Received By</div>
                  <div className="text-lg font-semibold mt-1">{payment.receivedBy}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Due Date */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Due Date Information</h3>
            <div className="flex items-center gap-4 p-4 rounded border">
              {isOverdue ? (
                <>
                  <AlertCircle className="text-red-600 w-8 h-8" />
                  <div>
                    <div className="font-semibold text-red-600">Overdue</div>
                    <div className="text-sm text-muted-foreground">Due date: {payment.dueDate}</div>
                  </div>
                </>
              ) : payment.status === "paid" ? (
                <>
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                  <div>
                    <div className="font-semibold text-green-600">Paid</div>
                    <div className="text-sm text-muted-foreground">Due date: {payment.dueDate}</div>
                  </div>
                </>
              ) : (
                <>
                  <Clock className="text-orange-600 w-8 h-8" />
                  <div>
                    <div className="font-semibold text-orange-600">Due in {daysUntilDue} days</div>
                    <div className="text-sm text-muted-foreground">Due date: {payment.dueDate}</div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Button onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
