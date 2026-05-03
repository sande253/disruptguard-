"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, TrendingDown, Minus, GitCompare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScenarioData {
  delay: number
  stockoutRisk: number
  revenueImpact: number
  deliveryRate: number
  customerSatisfaction: number
}

interface ComparisonViewProps {
  baseline: ScenarioData
  simulated: ScenarioData | null
  hasResults: boolean
}

export function ComparisonView({ baseline, simulated, hasResults }: ComparisonViewProps) {
  const metrics = [
    { 
      label: "Avg Delivery Delay", 
      baselineValue: baseline.delay, 
      simulatedValue: simulated?.delay ?? 0,
      unit: "h",
      inverse: true // lower is better
    },
    { 
      label: "Stockout Risk", 
      baselineValue: baseline.stockoutRisk, 
      simulatedValue: simulated?.stockoutRisk ?? 0,
      unit: "%",
      inverse: true
    },
    { 
      label: "Revenue Impact", 
      baselineValue: baseline.revenueImpact, 
      simulatedValue: simulated?.revenueImpact ?? 0,
      unit: "L",
      inverse: true,
      isCurrency: true
    },
    { 
      label: "On-Time Delivery", 
      baselineValue: baseline.deliveryRate, 
      simulatedValue: simulated?.deliveryRate ?? 0,
      unit: "%",
      inverse: false // higher is better
    },
    { 
      label: "Customer Satisfaction", 
      baselineValue: baseline.customerSatisfaction, 
      simulatedValue: simulated?.customerSatisfaction ?? 0,
      unit: "%",
      inverse: false
    },
  ]

  const getDeltaColor = (delta: number, inverse: boolean) => {
    if (delta === 0) return "text-muted-foreground"
    if (inverse) {
      return delta > 0 ? "text-risk-high" : "text-risk-low"
    }
    return delta > 0 ? "text-risk-low" : "text-risk-high"
  }

  const getDeltaIcon = (delta: number, inverse: boolean) => {
    if (delta === 0) return <Minus className="h-3 w-3" />
    if (inverse) {
      return delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
    }
    return delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const formatValue = (value: number, unit: string, isCurrency?: boolean) => {
    if (isCurrency) {
      return `₹${Math.abs(value).toFixed(1)}${unit}`
    }
    return `${value}${unit}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <GitCompare className="h-4 w-4 text-primary" />
              </div>
              Scenario Comparison
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-secondary/50">Baseline</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Simulated
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground py-3 pr-4">Metric</th>
                  <th className="text-center text-sm font-medium text-muted-foreground py-3 px-4 w-32">Baseline</th>
                  <th className="text-center text-sm font-medium text-muted-foreground py-3 px-4 w-32">Simulated</th>
                  <th className="text-center text-sm font-medium text-muted-foreground py-3 pl-4 w-28">Change</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => {
                  const delta = hasResults && simulated 
                    ? metric.simulatedValue - metric.baselineValue 
                    : 0
                  const deltaPercent = metric.baselineValue !== 0 
                    ? ((delta / metric.baselineValue) * 100).toFixed(0)
                    : "0"

                  return (
                    <motion.tr
                      key={metric.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <span className="text-sm font-medium text-foreground">{metric.label}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-muted-foreground">
                          {formatValue(metric.baselineValue, metric.unit, metric.isCurrency)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {hasResults && simulated ? (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm font-medium text-foreground"
                          >
                            {formatValue(metric.simulatedValue, metric.unit, metric.isCurrency)}
                          </motion.span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 pl-4 text-center">
                        {hasResults && simulated ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                              delta === 0 
                                ? "bg-secondary text-muted-foreground" 
                                : getDeltaColor(delta, metric.inverse).includes("high")
                                  ? "bg-risk-high/10 text-risk-high"
                                  : "bg-risk-low/10 text-risk-low"
                            )}
                          >
                            {getDeltaIcon(delta, metric.inverse)}
                            {delta > 0 ? "+" : ""}{deltaPercent}%
                          </motion.div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {hasResults && simulated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Impact Summary: </span>
                This disruption scenario would result in a{" "}
                <span className="text-risk-high font-medium">
                  {((simulated.delay - baseline.delay) / baseline.delay * 100).toFixed(0)}% increase
                </span>{" "}
                in delivery delays and a potential revenue loss of{" "}
                <span className="text-risk-high font-medium">
                  ₹{(simulated.revenueImpact / 100000).toFixed(1)}L
                </span>
                . Consider activating contingency routes.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
