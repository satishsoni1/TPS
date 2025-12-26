"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const weeklyData = [
  { day: "Mon", LRs: 12, Challans: 10, Invoices: 8 },
  { day: "Tue", LRs: 19, Challans: 15, Invoices: 12 },
  { day: "Wed", LRs: 15, Challans: 12, Invoices: 10 },
  { day: "Thu", LRs: 25, Challans: 20, Invoices: 18 },
  { day: "Fri", LRs: 22, Challans: 18, Invoices: 15 },
  { day: "Sat", LRs: 18, Challans: 14, Invoices: 12 },
  { day: "Sun", LRs: 14, Challans: 10, Invoices: 8 },
]

const revenueByRoute = [
  { name: "Mumbai-Delhi", value: 45000 },
  { name: "Bangalore-Chennai", value: 32000 },
  { name: "Pune-Hyderabad", value: 28000 },
  { name: "Delhi-Kolkata", value: 24000 },
  { name: "Others", value: 21000 },
]

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

const statusDistribution = [
  { name: "Delivered", value: 65, fill: "#10b981" },
  { name: "In Transit", value: 28, fill: "#3b82f6" },
  { name: "Pending", value: 7, fill: "#f59e0b" },
]

export default function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Weekly Activity */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="LRs" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Challans" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="Invoices" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Route */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Revenue by Route</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByRoute}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Shipment Status Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Shipment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
