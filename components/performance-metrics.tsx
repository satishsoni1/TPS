"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const routePerformance = [
  { route: "Mumbai-Delhi", avgTime: 48, onTimePercentage: 92, shipmentsCount: 145 },
  { route: "Bangalore-Chennai", avgTime: 24, onTimePercentage: 95, shipmentsCount: 98 },
  { route: "Pune-Hyderabad", avgTime: 36, onTimePercentage: 88, shipmentsCount: 76 },
  { route: "Delhi-Kolkata", avgTime: 60, onTimePercentage: 85, shipmentsCount: 52 },
  { route: "Chennai-Mumbai", avgTime: 72, onTimePercentage: 82, shipmentsCount: 45 },
]

const driverPerformance = [
  { name: "Rajesh Kumar", deliveries: 45, onTimeRate: 96, avgRating: 4.8 },
  { name: "Amit Singh", deliveries: 38, onTimeRate: 92, avgRating: 4.6 },
  { name: "Priya Sharma", deliveries: 42, onTimeRate: 94, avgRating: 4.7 },
  { name: "Vikram Patel", deliveries: 35, onTimeRate: 88, avgRating: 4.4 },
  { name: "Suresh Kumar", deliveries: 28, onTimeRate: 90, avgRating: 4.5 },
]

export default function PerformanceMetrics() {
  const avgOnTimePercentage = (
    routePerformance.reduce((sum, item) => sum + item.onTimePercentage, 0) / routePerformance.length
  ).toFixed(1)

  const totalShipments = routePerformance.reduce((sum, item) => sum + item.shipmentsCount, 0)

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-t-4 border-t-blue-500">
          <div className="text-sm font-medium text-muted-foreground">Total Shipments</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{totalShipments}</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-green-500">
          <div className="text-sm font-medium text-muted-foreground">On-Time Delivery</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{avgOnTimePercentage}%</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-purple-500">
          <div className="text-sm font-medium text-muted-foreground">Active Routes</div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{routePerformance.length}</div>
        </Card>
        <Card className="p-4 border-t-4 border-t-orange-500">
          <div className="text-sm font-medium text-muted-foreground">Active Drivers</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{driverPerformance.length}</div>
        </Card>
      </div>

      {/* Route Performance */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Route Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-semibold">Route</th>
                <th className="text-right p-2 font-semibold">Shipments</th>
                <th className="text-right p-2 font-semibold">Avg Time (hrs)</th>
                <th className="text-right p-2 font-semibold">On-Time %</th>
              </tr>
            </thead>
            <tbody>
              {routePerformance.map((route) => (
                <tr key={route.route} className="border-t hover:bg-muted/50">
                  <td className="p-2 font-semibold">{route.route}</td>
                  <td className="text-right p-2">{route.shipmentsCount}</td>
                  <td className="text-right p-2">{route.avgTime}h</td>
                  <td className="text-right p-2">
                    <span className={route.onTimePercentage >= 90 ? "text-green-600 font-semibold" : "text-orange-600"}>
                      {route.onTimePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Driver Performance */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Top Driver Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={driverPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="deliveries" fill="#3b82f6" name="Deliveries" />
            <Bar yAxisId="right" dataKey="onTimeRate" fill="#10b981" name="On-Time %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Driver Details Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Driver Ratings & Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-semibold">Driver Name</th>
                <th className="text-right p-2 font-semibold">Deliveries</th>
                <th className="text-right p-2 font-semibold">On-Time %</th>
                <th className="text-right p-2 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {driverPerformance.map((driver) => (
                <tr key={driver.name} className="border-t hover:bg-muted/50">
                  <td className="p-2 font-semibold">{driver.name}</td>
                  <td className="text-right p-2">{driver.deliveries}</td>
                  <td className="text-right p-2">
                    <span className={driver.onTimeRate >= 90 ? "text-green-600 font-semibold" : "text-orange-600"}>
                      {driver.onTimeRate}%
                    </span>
                  </td>
                  <td className="text-right p-2">
                    <span className="text-yellow-600 font-semibold">★ {driver.avgRating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
