"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  X,
  Clock,
  IndianRupee,
  AlertTriangle,
  Leaf,
  CheckCircle,
  ArrowRight,
  Truck,
  Train,
  Ship,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RouteConfig {
  id: string
  origin: string
  destination: string
  mode: string
}

interface RouteMetrics {
  time: string
  cost: string
  risk: number
  co2: string
  reliability: number
  delayProb: number
}

// Mock route metrics
const getRouteMetrics = (origin: string, destination: string, mode: string): RouteMetrics => {
  const baseMetrics: Record<string, RouteMetrics> = {
    road: { time: "14 hrs", cost: "₹45,000", risk: 65, co2: "120 kg", reliability: 74, delayProb: 42 },
    rail: { time: "18 hrs", cost: "₹32,000", risk: 35, co2: "45 kg", reliability: 88, delayProb: 18 },
    sea: { time: "48 hrs", cost: "₹28,000", risk: 25, co2: "38 kg", reliability: 92, delayProb: 12 },
  }
  return baseMetrics[mode] || baseMetrics.road
}

const modeIcons = {
  road: Truck,
  rail: Train,
  sea: Ship,
}

export default function ComparePage() {
  const [routes, setRoutes] = useState<RouteConfig[]>([
    { id: "1", origin: "Hyderabad", destination: "Chennai", mode: "road" },
    { id: "2", origin: "Hyderabad", destination: "Chennai", mode: "rail" },
  ])
  const [isComparing, setIsComparing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const addRoute = () => {
    if (routes.length < 3) {
      setRoutes([...routes, { id: Date.now().toString(), origin: "", destination: "", mode: "road" }])
    }
  }

  const removeRoute = (id: string) => {
    if (routes.length > 2) {
      setRoutes(routes.filter((r) => r.id !== id))
    }
  }

  const updateRoute = (id: string, field: keyof RouteConfig, value: string) => {
    setRoutes(routes.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const runComparison = () => {
    setIsComparing(true)
    setTimeout(() => {
      setIsComparing(false)
      setShowResults(true)
    }, 1500)
  }

  // Calculate metrics for each route
  const routeMetrics = routes.map((route) => ({
    ...route,
    metrics: getRouteMetrics(route.origin, route.destination, route.mode),
  }))

  // Find best in each category
  const bestTime = routeMetrics.reduce((best, r) => 
    parseInt(r.metrics.time) < parseInt(best.metrics.time) ? r : best
  )
  const bestCost = routeMetrics.reduce((best, r) => 
    parseInt(r.metrics.cost.replace(/[^\d]/g, "")) < parseInt(best.metrics.cost.replace(/[^\d]/g, "")) ? r : best
  )
  const bestRisk = routeMetrics.reduce((best, r) => 
    r.metrics.risk < best.metrics.risk ? r : best
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compare Routes</h1>
          <p className="text-sm text-muted-foreground">
            Compare up to 3 routes side by side to find the optimal choice
          </p>
        </div>

        {/* Route Configuration */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Route Configuration</CardTitle>
              {routes.length < 3 && (
                <Button variant="outline" size="sm" onClick={addRoute} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Route
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {routes.map((route, index) => {
                const ModeIcon = modeIcons[route.mode as keyof typeof modeIcons] || Truck
                return (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-4 rounded-xl border border-border bg-secondary/30"
                  >
                    {routes.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeRoute(route.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <ModeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">Route {index + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Origin</Label>
                        <Input
                          value={route.origin}
                          onChange={(e) => updateRoute(route.id, "origin", e.target.value)}
                          placeholder="Enter city"
                          className="bg-secondary border-border mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Destination</Label>
                        <Input
                          value={route.destination}
                          onChange={(e) => updateRoute(route.id, "destination", e.target.value)}
                          placeholder="Enter city"
                          className="bg-secondary border-border mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Transport Mode</Label>
                        <Select
                          value={route.mode}
                          onValueChange={(value) => updateRoute(route.id, "mode", value)}
                        >
                          <SelectTrigger className="bg-secondary border-border mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="road">Road</SelectItem>
                            <SelectItem value="rail">Rail</SelectItem>
                            <SelectItem value="sea">Sea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={runComparison} disabled={isComparing} className="gap-2 px-8">
                {isComparing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Compare Routes
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Comparison Table */}
              <Card className="border-border bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Comparison Results</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Metric</th>
                          {routeMetrics.map((route, index) => {
                            const ModeIcon = modeIcons[route.mode as keyof typeof modeIcons] || Truck
                            return (
                              <th key={route.id} className="text-center p-4">
                                <div className="flex flex-col items-center gap-1">
                                  <ModeIcon className="h-5 w-5 text-primary" />
                                  <span className="text-sm font-medium text-foreground">
                                    Route {index + 1}
                                  </span>
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {route.mode}
                                  </span>
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Time */}
                        <tr className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">Travel Time</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-medium text-foreground">{route.metrics.time}</span>
                                {route.id === bestTime.id && (
                                  <Badge className="bg-risk-low/20 text-risk-low border-0 text-[10px]">
                                    <Trophy className="h-3 w-3 mr-0.5" />
                                    Fastest
                                  </Badge>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* Cost */}
                        <tr className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">Estimated Cost</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <div className="flex items-center justify-center gap-2">
                                <span className="font-medium text-foreground">{route.metrics.cost}</span>
                                {route.id === bestCost.id && (
                                  <Badge className="bg-risk-low/20 text-risk-low border-0 text-[10px]">
                                    <Trophy className="h-3 w-3 mr-0.5" />
                                    Cheapest
                                  </Badge>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* Risk */}
                        <tr className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">Risk Score</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-medium",
                                    route.metrics.risk < 40 ? "text-risk-low" :
                                    route.metrics.risk < 60 ? "text-risk-moderate" : "text-risk-high"
                                  )}>
                                    {route.metrics.risk}%
                                  </span>
                                  {route.id === bestRisk.id && (
                                    <Badge className="bg-risk-low/20 text-risk-low border-0 text-[10px]">
                                      <Trophy className="h-3 w-3 mr-0.5" />
                                      Safest
                                    </Badge>
                                  )}
                                </div>
                                <Progress value={route.metrics.risk} className="h-1.5 w-24 bg-secondary" />
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* CO2 */}
                        <tr className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">CO2 Emissions</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <span className="font-medium text-foreground">{route.metrics.co2}</span>
                            </td>
                          ))}
                        </tr>
                        {/* Reliability */}
                        <tr className="border-b border-border">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">Reliability</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <span className={cn(
                                "font-medium",
                                route.metrics.reliability >= 85 ? "text-risk-low" :
                                route.metrics.reliability >= 70 ? "text-risk-moderate" : "text-risk-high"
                              )}>
                                {route.metrics.reliability}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        {/* Delay Probability */}
                        <tr>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">Delay Probability</span>
                            </div>
                          </td>
                          {routeMetrics.map((route) => (
                            <td key={route.id} className="text-center p-4">
                              <span className={cn(
                                "font-medium",
                                route.metrics.delayProb < 20 ? "text-risk-low" :
                                route.metrics.delayProb < 40 ? "text-risk-moderate" : "text-risk-high"
                              )}>
                                {route.metrics.delayProb}%
                              </span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">AI Recommendation</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your optimization preferences, <strong className="text-foreground">Route 2 (Rail)</strong> offers 
                        the best balance of cost and reliability. While 4 hours slower than road transport, 
                        it provides 56% lower risk and 29% cost savings. The reduced CO2 emissions also 
                        support sustainability goals.
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">Apply This Route</Button>
                        <Button size="sm" variant="outline">Export Comparison</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
