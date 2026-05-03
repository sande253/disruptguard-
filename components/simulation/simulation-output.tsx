"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Package, DollarSign, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimulationResult {
  predictedDelay: number
  stockoutRisk: number
  revenueImpact: number
  confidence: number
  affectedShipments: number
  mitigationCost: number
}

interface SimulationOutputProps {
  result: SimulationResult | null
  isRunning: boolean
}

export function SimulationOutput({ result, isRunning }: SimulationOutputProps) {
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`
    }
    if (Math.abs(value) >= 100000) {
      return `${(value / 100000).toFixed(1)}L`
    }
    return `${(value / 1000).toFixed(0)}K`
  }

  const getDelayColor = (hours: number) => {
    if (hours <= 4) return "text-risk-low"
    if (hours <= 12) return "text-risk-moderate"
    return "text-risk-high"
  }

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return "text-risk-low"
    if (risk <= 60) return "text-risk-moderate"
    return "text-risk-high"
  }

  const getImpactIcon = (value: number) => {
    if (value > 0) return <TrendingDown className="h-4 w-4 text-risk-high" />
    if (value < 0) return <TrendingUp className="h-4 w-4 text-risk-low" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-card border-border h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            Simulation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-secondary" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">Running simulation...</p>
                <p className="text-xs text-muted-foreground">Analyzing disruption scenarios</p>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Primary Metrics */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Predicted Delay */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Predicted Delay</span>
                      </div>
                      <span className={cn("text-2xl font-bold", getDelayColor(result.predictedDelay))}>
                        {result.predictedDelay}h
                      </span>
                    </div>
                    <Progress 
                      value={(result.predictedDelay / 72) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on historical patterns and current conditions
                    </p>
                  </div>

                  {/* Stockout Risk */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Stockout Risk</span>
                      </div>
                      <span className={cn("text-2xl font-bold", getRiskColor(result.stockoutRisk))}>
                        {result.stockoutRisk}%
                      </span>
                    </div>
                    <Progress 
                      value={result.stockoutRisk} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Probability of inventory depletion at destination
                    </p>
                  </div>

                  {/* Revenue Impact */}
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Revenue Impact</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getImpactIcon(result.revenueImpact)}
                        <span className={cn(
                          "text-2xl font-bold",
                          result.revenueImpact > 0 ? "text-risk-high" : "text-risk-low"
                        )}>
                          {result.revenueImpact > 0 ? "-" : "+"}₹{formatCurrency(Math.abs(result.revenueImpact))}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated financial impact from disruption
                    </p>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Affected Shipments</p>
                    <p className="text-lg font-semibold text-foreground">{result.affectedShipments}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Mitigation Cost</p>
                    <p className="text-lg font-semibold text-foreground">₹{formatCurrency(result.mitigationCost)}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Model Confidence</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={result.confidence} className="h-1.5 flex-1" />
                      <span className="text-sm font-medium text-foreground">{result.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 gap-3 text-center"
              >
                <div className="p-4 rounded-full bg-secondary">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No simulation results yet</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Configure your scenario inputs and run a simulation to see predictions
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
