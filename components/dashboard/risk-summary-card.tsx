"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRoute } from "@/contexts/route-context"

export function RiskSummaryCard() {
  const { route } = useRoute()
  
  // Mock data - would be dynamic based on route
  const riskScore = 68
  const delayPrediction = "4-6 hrs"
  const confidence = 87

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: "High", color: "text-risk-high", bg: "bg-risk-high" }
    if (score >= 40) return { label: "Moderate", color: "text-risk-moderate", bg: "bg-risk-moderate" }
    return { label: "Low", color: "text-risk-low", bg: "bg-risk-low" }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Risk Summary
            </CardTitle>
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-medium border-0",
                risk.color,
                risk.bg + "/20"
              )}
            >
              {risk.label} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Risk Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Overall Risk Score
              </span>
              <span className={cn("font-bold text-lg", risk.color)}>{riskScore}%</span>
            </div>
            <Progress 
              value={riskScore} 
              className="h-2 bg-secondary"
            />
          </div>

          {/* Delay Prediction */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Delay Prediction
            </span>
            <span className="font-semibold text-foreground">{delayPrediction}</span>
          </div>

          {/* Model Confidence */}
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Model Confidence
            </span>
            <span className="font-semibold text-risk-low">{confidence}%</span>
          </div>

          {/* Quick Stats */}
          {route && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-xs text-muted-foreground">High Risk Routes</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">47</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
