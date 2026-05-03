"use client"

import { motion } from "framer-motion"
import { Route, Clock, DollarSign, AlertTriangle, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RouteOption {
  id: string
  name: string
  description: string
  time: string
  timeDelta: string
  cost: string
  costDelta: string
  riskLevel: "low" | "moderate" | "high"
  riskScore: number
  isCurrent: boolean
  isRecommended: boolean
}

const routeOptions: RouteOption[] = [
  {
    id: "current",
    name: "Route A (Current)",
    description: "Via NH-65 → Kurnool → NH-44",
    time: "9h 30m",
    timeDelta: "-",
    cost: "₹45,000",
    costDelta: "-",
    riskLevel: "high",
    riskScore: 72,
    isCurrent: true,
    isRecommended: false,
  },
  {
    id: "alternate-1",
    name: "Route B (Alternate)",
    description: "Via NH-44 → Bengaluru → NH-48",
    time: "11h 15m",
    timeDelta: "+1h 45m",
    cost: "₹52,000",
    costDelta: "+₹7,000",
    riskLevel: "low",
    riskScore: 24,
    isCurrent: false,
    isRecommended: true,
  },
  {
    id: "alternate-2",
    name: "Route C (Express)",
    description: "Via Toll Expressway → Tirupati",
    time: "8h 45m",
    timeDelta: "-45m",
    cost: "₹68,000",
    costDelta: "+₹23,000",
    riskLevel: "moderate",
    riskScore: 45,
    isCurrent: false,
    isRecommended: false,
  },
]

const riskStyles = {
  low: {
    bg: "bg-risk-low/10",
    text: "text-risk-low",
    border: "border-risk-low/30",
  },
  moderate: {
    bg: "bg-risk-moderate/10",
    text: "text-risk-moderate",
    border: "border-risk-moderate/30",
  },
  high: {
    bg: "bg-risk-high/10",
    text: "text-risk-high",
    border: "border-risk-high/30",
  },
}

export function AlternateRoutesComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Alternate Routes Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Route
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Time
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center justify-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      Cost
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center justify-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      Risk
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {routeOptions.map((route, index) => {
                  const styles = riskStyles[route.riskLevel]

                  return (
                    <motion.tr
                      key={route.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className={cn(
                        "border-b border-border/50 last:border-0",
                        route.isRecommended && "bg-primary/5"
                      )}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {route.name}
                              </span>
                              {route.isCurrent && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  Current
                                </Badge>
                              )}
                              {route.isRecommended && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                                  <Check className="h-3 w-3 mr-0.5" />
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {route.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div>
                          <span className="font-medium text-foreground">{route.time}</span>
                          {route.timeDelta !== "-" && (
                            <p className={cn(
                              "text-xs mt-0.5",
                              route.timeDelta.startsWith("+") ? "text-risk-moderate" : "text-risk-low"
                            )}>
                              {route.timeDelta}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div>
                          <span className="font-medium text-foreground">{route.cost}</span>
                          {route.costDelta !== "-" && (
                            <p className="text-xs text-risk-moderate mt-0.5">
                              {route.costDelta}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              styles.text,
                              styles.border,
                              styles.bg
                            )}
                          >
                            {route.riskLevel.toUpperCase()}
                          </Badge>
                          <span className={cn("text-xs font-medium", styles.text)}>
                            Score: {route.riskScore}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
