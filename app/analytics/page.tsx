"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

// Mock data for charts
const delayTrendData = [
  { month: "Jan", avgDelay: 4.2, onTime: 78 },
  { month: "Feb", avgDelay: 5.1, onTime: 72 },
  { month: "Mar", avgDelay: 3.8, onTime: 81 },
  { month: "Apr", avgDelay: 6.2, onTime: 68 },
  { month: "May", avgDelay: 4.5, onTime: 75 },
  { month: "Jun", avgDelay: 7.8, onTime: 62 },
  { month: "Jul", avgDelay: 8.2, onTime: 58 },
  { month: "Aug", avgDelay: 6.5, onTime: 65 },
  { month: "Sep", avgDelay: 5.2, onTime: 71 },
  { month: "Oct", avgDelay: 4.1, onTime: 79 },
  { month: "Nov", avgDelay: 3.5, onTime: 83 },
  { month: "Dec", avgDelay: 4.8, onTime: 74 },
]

const routePerformanceData = [
  { route: "HYD-CHN", avgDelay: 5.2, shipments: 245, reliability: 76 },
  { route: "MUM-DEL", avgDelay: 3.8, shipments: 312, reliability: 82 },
  { route: "BLR-KOL", avgDelay: 6.1, shipments: 189, reliability: 71 },
  { route: "CHN-MUM", avgDelay: 4.5, shipments: 276, reliability: 78 },
  { route: "DEL-BLR", avgDelay: 7.2, shipments: 198, reliability: 65 },
]

const disruptionCauses = [
  { name: "Weather", value: 35, color: "#3b82f6" },
  { name: "Traffic", value: 28, color: "#f59e0b" },
  { name: "Infrastructure", value: 18, color: "#ef4444" },
  { name: "Port Delays", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 7, color: "#6b7280" },
]

const hourlyPattern = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  risk: Math.sin((i - 6) * Math.PI / 12) * 30 + 50 + Math.random() * 10,
}))

const supplierReliability = [
  { name: "Tata Steel", score: 92, trend: "up", shipments: 156 },
  { name: "Mahindra Auto", score: 78, trend: "down", shipments: 89 },
  { name: "Reliance", score: 88, trend: "up", shipments: 234 },
  { name: "Chennai Plastics", score: 65, trend: "down", shipments: 67 },
  { name: "Hyderabad Elec", score: 71, trend: "stable", shipments: 112 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12m")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Historical Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Performance trends and insights over time
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Avg Delay", value: "5.2 hrs", change: -12, icon: Clock },
            { label: "On-Time Rate", value: "74%", change: 8, icon: CheckCircle },
            { label: "Total Shipments", value: "2,847", change: 15, icon: BarChart3 },
            { label: "Risk Events", value: "342", change: -22, icon: AlertTriangle },
          ].map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <kpi.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    {kpi.change > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-risk-low" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-risk-high" />
                    )}
                    <span className={kpi.change > 0 ? "text-risk-low text-sm" : "text-risk-high text-sm"}>
                      {Math.abs(kpi.change)}%
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="trends">Delay Trends</TabsTrigger>
            <TabsTrigger value="routes">Route Performance</TabsTrigger>
            <TabsTrigger value="causes">Disruption Causes</TabsTrigger>
            <TabsTrigger value="patterns">Time Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Monthly Delay Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={delayTrendData}>
                      <defs>
                        <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="avgDelay"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#delayGradient)"
                        name="Avg Delay (hrs)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Route Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={routePerformanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis dataKey="route" type="category" stroke="#64748b" fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="avgDelay" fill="#3b82f6" name="Avg Delay (hrs)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="causes">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Disruption Causes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={disruptionCauses}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {disruptionCauses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Cause Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {disruptionCauses.map((cause) => (
                    <div key={cause.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{cause.name}</span>
                        <span className="text-sm font-medium text-foreground">{cause.value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${cause.value}%`, backgroundColor: cause.color }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Hourly Risk Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyPattern}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="hour" stroke="#64748b" fontSize={10} interval={2} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                        name="Risk Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Peak risk hours: 14:00 - 18:00 (afternoon rush)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Supplier Reliability */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Supplier Reliability Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supplierReliability.map((supplier) => (
                <div key={supplier.name} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{supplier.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{supplier.shipments} shipments</span>
                        {supplier.trend === "up" && <TrendingUp className="h-4 w-4 text-risk-low" />}
                        {supplier.trend === "down" && <TrendingDown className="h-4 w-4 text-risk-high" />}
                        <span className={`text-sm font-bold ${
                          supplier.score >= 80 ? "text-risk-low" : 
                          supplier.score >= 70 ? "text-risk-moderate" : "text-risk-high"
                        }`}>
                          {supplier.score}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          supplier.score >= 80 ? "bg-risk-low" : 
                          supplier.score >= 70 ? "bg-risk-moderate" : "bg-risk-high"
                        }`}
                        style={{ width: `${supplier.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
