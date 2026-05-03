"use client"

import { motion } from "framer-motion"
import { Sparkles, Route, Train, Package, ArrowRight, Clock, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Recommendation {
  id: string
  title: string
  description: string
  icon: typeof Route
  costImpact: string
  timeImpact: string
  riskReduction: number
  type: "reroute" | "mode" | "inventory"
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reroute via NH-48",
    description: "Avoid NH-44 accident zone. Lower risk despite longer distance.",
    icon: Route,
    costImpact: "+₹12,000",
    timeImpact: "+2 hrs",
    riskReduction: 65,
    type: "reroute",
  },
  {
    id: "2",
    title: "Switch to Rail Transport",
    description: "Rail corridor unaffected by weather. More reliable ETA.",
    icon: Train,
    costImpact: "+12%",
    timeImpact: "-4 hrs",
    riskReduction: 78,
    type: "mode",
  },
  {
    id: "3",
    title: "Activate Buffer Stock",
    description: "Chennai warehouse has 3-day inventory. Can absorb delays.",
    icon: Package,
    costImpact: "₹0",
    timeImpact: "No impact",
    riskReduction: 45,
    type: "inventory",
  },
]

const typeColors = {
  reroute: "border-primary/30 hover:border-primary/50",
  mode: "border-risk-moderate/30 hover:border-risk-moderate/50",
  inventory: "border-risk-low/30 hover:border-risk-low/50",
}

export function AIRecommendations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              AI Recommendations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className={cn(
                "rounded-xl border bg-secondary/30 p-4 transition-all cursor-pointer hover:bg-secondary/60",
                typeColors[rec.type]
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <rec.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-xs">
                        <IndianRupee className="h-3 w-3 text-muted-foreground" />
                        <span className={cn(
                          "font-medium",
                          rec.costImpact.includes("+") ? "text-risk-moderate" : "text-risk-low"
                        )}>
                          {rec.costImpact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className={cn(
                          "font-medium",
                          rec.timeImpact.includes("+") ? "text-risk-moderate" : "text-risk-low"
                        )}>
                          {rec.timeImpact}
                        </span>
                      </div>
                      <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30 text-xs">
                        -{rec.riskReduction}% risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                  Apply
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
