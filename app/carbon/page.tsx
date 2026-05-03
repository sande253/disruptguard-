"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Leaf,
  TrendingDown,
  TrendingUp,
  Truck,
  Train,
  Ship,
  Factory,
  Target,
  Award,
  ArrowDownRight,
  TreeDeciduous,
  Droplets,
  Wind,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const monthlyEmissions = [
  { month: "Jan", road: 45, rail: 12, sea: 8 },
  { month: "Feb", road: 42, rail: 14, sea: 7 },
  { month: "Mar", road: 48, rail: 11, sea: 9 },
  { month: "Apr", road: 40, rail: 15, sea: 6 },
  { month: "May", road: 38, rail: 16, sea: 8 },
  { month: "Jun", road: 35, rail: 18, sea: 7 },
]

const emissionsByMode = [
  { name: "Road", value: 65, color: "#ef4444" },
  { name: "Rail", value: 22, color: "#22c55e" },
  { name: "Sea", value: 13, color: "#3b82f6" },
]

const routeEmissions = [
  { route: "HYD-CHN", emissions: 120, savings: 15, mode: "road" },
  { route: "MUM-DEL", emissions: 85, savings: 22, mode: "rail" },
  { route: "BLR-KOL", emissions: 145, savings: 8, mode: "road" },
  { route: "CHN-MUM", emissions: 62, savings: 35, mode: "sea" },
  { route: "DEL-BLR", emissions: 95, savings: 18, mode: "rail" },
]

const greenRecommendations = [
  {
    id: "1",
    title: "Switch HYD-CHN to Rail",
    impact: "Save 45 kg CO2 per shipment",
    effort: "low",
    savings: 38,
  },
  {
    id: "2",
    title: "Optimize BLR-KOL Route",
    impact: "Reduce distance by 12%",
    effort: "medium",
    savings: 25,
  },
  {
    id: "3",
    title: "Consolidate MUM-DEL Loads",
    impact: "Fewer trips, same volume",
    effort: "low",
    savings: 20,
  },
  {
    id: "4",
    title: "Electric Vehicles for Last Mile",
    impact: "Zero emissions for urban delivery",
    effort: "high",
    savings: 50,
  },
]

export default function CarbonPage() {
  const [timeRange, setTimeRange] = useState("6m")
  
  const totalEmissions = 248
  const monthlyTarget = 200
  const percentOfTarget = (totalEmissions / monthlyTarget) * 100
  const yoyChange = -12

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Carbon Footprint</h1>
            <p className="text-sm text-muted-foreground">
              Track emissions and discover green route alternatives
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Emissions</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{totalEmissions} tons</p>
                  </div>
                  <div className="rounded-lg bg-risk-moderate/10 p-3">
                    <Factory className="h-5 w-5 text-risk-moderate" />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <ArrowDownRight className="h-4 w-4 text-risk-low" />
                  <span className="text-risk-low text-sm">{Math.abs(yoyChange)}%</span>
                  <span className="text-muted-foreground text-sm ml-1">vs last year</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Target</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{monthlyTarget} tons</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={percentOfTarget > 100 ? 100 : percentOfTarget} className="h-1.5 bg-secondary" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentOfTarget > 100 ? `${(percentOfTarget - 100).toFixed(0)}% over` : `${(100 - percentOfTarget).toFixed(0)}% remaining`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">CO2 Saved</p>
                    <p className="text-2xl font-bold text-risk-low mt-1">42 tons</p>
                  </div>
                  <div className="rounded-lg bg-risk-low/10 p-3">
                    <Leaf className="h-5 w-5 text-risk-low" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Through route optimization</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Green Score</p>
                    <p className="text-2xl font-bold text-risk-low mt-1">B+</p>
                  </div>
                  <div className="rounded-lg bg-risk-low/10 p-3">
                    <Award className="h-5 w-5 text-risk-low" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Top 25% in industry</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-route">By Route</TabsTrigger>
            <TabsTrigger value="recommendations">Green Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Emissions Trend */}
              <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Emissions Trend by Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyEmissions}>
                        <defs>
                          <linearGradient id="roadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="railGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="seaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
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
                        <Area type="monotone" dataKey="road" stackId="1" stroke="#ef4444" fill="url(#roadGradient)" name="Road (tons)" />
                        <Area type="monotone" dataKey="rail" stackId="1" stroke="#22c55e" fill="url(#railGradient)" name="Rail (tons)" />
                        <Area type="monotone" dataKey="sea" stackId="1" stroke="#3b82f6" fill="url(#seaGradient)" name="Sea (tons)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Emissions by Mode */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Emissions by Transport</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={emissionsByMode}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {emissionsByMode.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3 mt-4">
                    {emissionsByMode.map((mode) => (
                      <div key={mode.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }} />
                          <span className="text-sm text-foreground">{mode.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{mode.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Environmental Impact */}
            <Card className="border-border bg-card mt-6">
              <CardHeader>
                <CardTitle>Environmental Impact Equivalents</CardTitle>
                <CardDescription>What your CO2 savings mean for the environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-risk-low/5 border border-risk-low/20">
                    <div className="rounded-lg bg-risk-low/10 p-3">
                      <TreeDeciduous className="h-6 w-6 text-risk-low" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1,890</p>
                      <p className="text-sm text-muted-foreground">Trees planted equivalent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">45,000 L</p>
                      <p className="text-sm text-muted-foreground">Water saved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-risk-moderate/5 border border-risk-moderate/20">
                    <div className="rounded-lg bg-risk-moderate/10 p-3">
                      <Wind className="h-6 w-6 text-risk-moderate" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">8,500 km</p>
                      <p className="text-sm text-muted-foreground">Car travel offset</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* By Route Tab */}
          <TabsContent value="by-route">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Emissions by Route</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={routeEmissions} layout="vertical">
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
                      <Bar dataKey="emissions" fill="#3b82f6" name="CO2 (kg)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-3">
                  {routeEmissions.map((route) => (
                    <div key={route.route} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        {route.mode === "road" && <Truck className="h-4 w-4 text-muted-foreground" />}
                        {route.mode === "rail" && <Train className="h-4 w-4 text-risk-low" />}
                        {route.mode === "sea" && <Ship className="h-4 w-4 text-primary" />}
                        <span className="font-medium text-foreground">{route.route}</span>
                        <Badge variant="outline" className="text-xs capitalize">{route.mode}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-foreground">{route.emissions} kg CO2</span>
                        <Badge className="bg-risk-low/20 text-risk-low border-0">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {route.savings}% saved
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Green Route Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to reduce your carbon footprint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {greenRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-risk-low/10 p-3">
                        <Leaf className="h-5 w-5 text-risk-low" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{rec.title}</p>
                        <p className="text-sm text-muted-foreground">{rec.impact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={cn(
                        "capitalize",
                        rec.effort === "low" ? "border-risk-low text-risk-low" :
                        rec.effort === "medium" ? "border-risk-moderate text-risk-moderate" :
                        "border-risk-high text-risk-high"
                      )}>
                        {rec.effort} effort
                      </Badge>
                      <div className="text-right">
                        <p className="text-lg font-bold text-risk-low">-{rec.savings}%</p>
                        <p className="text-xs text-muted-foreground">CO2 reduction</p>
                      </div>
                      <Button size="sm">Apply</Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
