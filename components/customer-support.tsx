"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CustomerSupport() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitTicket = () => {
    if (ticketNumber.trim()) {
      setSubmitted(true)
      setTimeout(() => {
        setTicketNumber("")
        setSubmitted(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contact our support team for any assistance with your shipments or invoices.
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> support@tms.com
            </p>
            <p>
              <strong>Phone:</strong> +91 9876-543-210
            </p>
            <p>
              <strong>Hours:</strong> 9 AM - 6 PM IST
            </p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <h3 className="font-semibold text-lg mb-2">Track Support Ticket</h3>
          <p className="text-sm text-muted-foreground mb-4">Enter your support ticket number to check status</p>
          <div className="space-y-2">
            <Input
              placeholder="Ticket number (e.g., TKT-2024-001)"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
            />
            <Button onClick={handleSubmitTicket} className="w-full bg-green-600 text-white">
              Track Ticket
            </Button>
            {submitted && <p className="text-sm text-green-600 font-semibold">Ticket submitted successfully!</p>}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-lg mb-3">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm">How do I track my shipment?</p>
            <p className="text-sm text-muted-foreground">
              Go to "My Shipments" tab and click "Track" on any active shipment to see real-time location and delivery
              status.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">Can I download my invoices?</p>
            <p className="text-sm text-muted-foreground">
              Yes, in the "Invoices" tab, click "Download" to get PDF copies of your invoices for accounting records.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">What is the typical delivery time?</p>
            <p className="text-sm text-muted-foreground">
              Delivery times vary based on route. Most shipments are delivered within 2-5 business days depending on
              distance.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">How can I reschedule my delivery?</p>
            <p className="text-sm text-muted-foreground">
              Contact our support team at least 24 hours before expected delivery to reschedule.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
