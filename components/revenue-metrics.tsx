"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const monthlyRevenue = [
  { month: "Jan", revenue: 450000, gst: 81000, netRevenue: 369000 },
  { month: "Feb", revenue: 520000, gst: 93600, netRevenue: 426400 },
  { month: "Mar", revenue: 610000, gst: 109800, netRevenue: 500200 },
  { month: "Apr", revenue: 680000, gst: 122400, netRevenue: 557600 },
  { month: "May", revenue: 750000, gst: 135000, netRevenue: 615000 },
  { month: "Jun", revenue: 890000, gst: 160200, netRevenue: 729800 },
]

const paymentCollection = [
  { month: "Jan", target: 400000, actual: 380000 },
  { month: "Feb", target: 480000, actual: 460000 },
  { month: "Mar", target: 550000, actual: 590000 },
  { month: "Apr", target: 620000, actual: 650000 },
  { month: "May", target: 680000, actual: 710000 },
  { month: "Jun", target: 800000, actual: 840000 },
]

export default function RevenueMetrics() {
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0)
  const totalGST = monthlyRevenue.reduce((sum, item) => sum + item.gst, 0)
  const totalNetRevenue = monthlyRevenue.reduce((sum, item) => sum + item.netRevenue, 0)

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-t-4 border-t-blue-500">
          <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">₹{(totalRevenue / 100000).toFixed(2)}L</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-purple-500">
          <div className="text-sm font-medium text-muted-foreground">Total GST (18%)</div>
          <div className="text-2xl font-bold text-purple-600 mt-2">₹{(totalGST / 100000).toFixed(2)}L</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-green-500">
          <div className="text-sm font-medium text-muted-foreground">Net Revenue</div>
          <div className="text-2xl font-bold text-green-600 mt-2">₹{(totalNetRevenue / 100000).toFixed(2)}L</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-orange-500">
          <div className="text-sm font-medium text-muted-foreground">Avg Monthly</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">₹{(totalRevenue / 6 / 100000).toFixed(2)}L</div>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Gross Revenue" />
            <Bar dataKey="gst" fill="#ef4444" name="GST" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Collection vs Target */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Payment Collection Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={paymentCollection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ef4444"
              strokeWidth={2}
              name="Target"
              strokeDasharray="5 5"
            />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual Collection" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
