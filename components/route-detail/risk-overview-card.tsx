"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RiskOverviewCardProps {
  delayProbability: number
  expectedDelayRange: string
  confidenceLevel: number
}

export function RiskOverviewCard({
  delayProbability,
  expectedDelayRange,
  confidenceLevel,
}: RiskOverviewCardProps) {
  const getRiskColor = (probability: number) => {
    if (probability >= 60) return "text-risk-high"
    if (probability >= 30) return "text-risk-moderate"
    return "text-risk-low"
  }

  const getProgressColor = (probability: number) => {
    if (probability >= 60) return "bg-risk-high"
    if (probability >= 30) return "bg-risk-moderate"
    return "bg-risk-low"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-risk-high" />
            Risk Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delay Probability */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Delay Probability</span>
              <span className={`text-2xl font-bold ${getRiskColor(delayProbability)}`}>
                {delayProbability}%
              </span>
            </div>
            <Progress
              value={delayProbability}
              className="h-2"
              style={{
                ["--progress-background" as string]: `var(--${delayProbability >= 60 ? "risk-high" : delayProbability >= 30 ? "risk-moderate" : "risk-low"})`,
              }}
            />
          </div>

          {/* Expected Delay Range */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Expected Delay</span>
            </div>
            <span className="text-lg font-semibold text-foreground">{expectedDelayRange}</span>
          </div>

          {/* Confidence Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Model Confidence</span>
            </div>
            <span className="text-lg font-semibold text-primary">{confidenceLevel}%</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
