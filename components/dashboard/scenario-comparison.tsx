"use client"

import { motion } from "framer-motion"
import { Route, Train, Ship, Clock, IndianRupee, AlertTriangle, Check, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRoute } from "@/contexts/route-context"

interface Scenario {
  id: string
  name: string
  icon: typeof Route
  time: string
  cost: string
  risk: number
  recommended?: boolean
  details: string
}

const scenarios: Scenario[] = [
  {
    id: "current",
    name: "Current Route",
    icon: Route,
    time: "14 hrs",
    cost: "₹45,000",
    risk: 64,
    details: "Direct NH-44 via Kurnool",
  },
  {
    id: "alternate",
    name: "Alternate Route",
    icon: Route,
    time: "16 hrs",
    cost: "₹52,000",
    risk: 28,
    recommended: true,
    details: "Via NH-48 avoiding weather zone",
  },
  {
    id: "rail",
    name: "Rail Option",
    icon: Train,
    time: "18 hrs",
    cost: "₹38,000",
    risk: 15,
    details: "Freight rail via Vijayawada",
  },
]

export function ScenarioComparison() {
  const { route } = useRoute()

  const getRiskColor = (risk: number) => {
    if (risk >= 50) return "text-risk-high"
    if (risk >= 30) return "text-risk-moderate"
    return "text-risk-low"
  }

  const getRiskBg = (risk: number) => {
    if (risk >= 50) return "bg-risk-high"
    if (risk >= 30) return "bg-risk-moderate"
    return "bg-risk-low"
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Best Alternatives
          </CardTitle>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            3 options compared
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all cursor-pointer",
                scenario.recommended 
                  ? "border-primary/50 bg-primary/5 hover:border-primary" 
                  : "border-border bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              {scenario.recommended && (
                <Badge className="absolute -top-2 right-3 bg-primary text-primary-foreground text-[10px] px-2">
                  Recommended
                </Badge>
              )}
              
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={cn(
                  "rounded-lg p-2.5 shrink-0",
                  scenario.recommended ? "bg-primary/20" : "bg-secondary"
                )}>
                  <scenario.icon className={cn(
                    "h-5 w-5",
                    scenario.recommended ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{scenario.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{scenario.details}</p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6">
                  {/* Time */}
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                      <Clock className="h-3 w-3" />
                      Time
                    </div>
                    <span className="text-sm font-semibold text-foreground">{scenario.time}</span>
                  </div>

                  {/* Cost */}
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                      <IndianRupee className="h-3 w-3" />
                      Cost
                    </div>
                    <span className="text-sm font-semibold text-foreground">{scenario.cost}</span>
                  </div>

                  {/* Risk */}
                  <div className="text-center min-w-[60px]">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      Risk
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-8 h-1.5 rounded-full bg-secondary overflow-hidden")}>
                        <div 
                          className={cn("h-full rounded-full", getRiskBg(scenario.risk))}
                          style={{ width: `${scenario.risk}%` }}
                        />
                      </div>
                      <span className={cn("text-sm font-semibold", getRiskColor(scenario.risk))}>
                        {scenario.risk}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <Button 
                  size="sm"
                  variant={scenario.recommended ? "default" : "outline"}
                  className={cn(
                    "shrink-0",
                    scenario.recommended ? "bg-primary hover:bg-primary/90" : ""
                  )}
                >
                  {scenario.id === "current" ? "Current" : "Select"}
                  {scenario.id !== "current" && <Check className="h-3.5 w-3.5 ml-1" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
