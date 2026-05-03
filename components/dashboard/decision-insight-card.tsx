"use client"

import { motion } from "framer-motion"
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Cloud, 
  Car, 
  Construction,
  Radio,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRoute, formatRoute } from "@/contexts/route-context"

interface RiskDriver {
  id: string
  label: string
  icon: typeof Cloud
  impact: "high" | "medium" | "low"
  description: string
}

const riskDrivers: RiskDriver[] = [
  {
    id: "weather",
    label: "Weather",
    icon: Cloud,
    impact: "high",
    description: "Cyclone advisory active in coastal regions",
  },
  {
    id: "traffic",
    label: "Traffic",
    icon: Car,
    impact: "medium",
    description: "Congestion reported on NH-44 near Kurnool",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    icon: Construction,
    impact: "low",
    description: "Road maintenance scheduled on bypass route",
  },
  {
    id: "external",
    label: "External Events",
    icon: Radio,
    impact: "medium",
    description: "Festival traffic expected in Tirupati region",
  },
]

const impactColors = {
  high: "text-risk-high bg-risk-high/10",
  medium: "text-risk-moderate bg-risk-moderate/10",
  low: "text-risk-low bg-risk-low/10",
}

export function DecisionInsightCard() {
  const { route } = useRoute()
  const routeLabel = formatRoute(route)
  
  // Dynamic risk data based on route
  const delayProbability = 64
  const delayRange = "6-10 hours"
  const confidence = 87

  const getRiskLevel = (score: number) => {
    if (score >= 60) return { label: "High", color: "text-risk-high", bg: "bg-risk-high" }
    if (score >= 35) return { label: "Moderate", color: "text-risk-moderate", bg: "bg-risk-moderate" }
    return { label: "Low", color: "text-risk-low", bg: "bg-risk-low" }
  }

  const risk = getRiskLevel(delayProbability)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border bg-card overflow-hidden">
        {/* Top accent bar */}
        <div className={cn("h-1", risk.bg)} />
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-lg p-2", risk.bg + "/10")}>
                <AlertTriangle className={cn("h-5 w-5", risk.color)} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Route Decision Insight
                </CardTitle>
                {routeLabel && (
                  <p className="text-xs text-muted-foreground mt-0.5">{routeLabel}</p>
                )}
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-semibold border-0 px-3 py-1", risk.color, risk.bg + "/20")}
            >
              {risk.label} Risk
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Delay Probability */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                Delay Probability
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-3xl font-bold", risk.color)}>{delayProbability}</span>
                <span className={cn("text-lg font-medium", risk.color)}>%</span>
              </div>
              <Progress value={delayProbability} className="h-1.5 bg-secondary" />
            </div>

            {/* Expected Delay */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Expected Delay
              </div>
              <div className="text-2xl font-bold text-foreground">{delayRange}</div>
              <p className="text-[10px] text-muted-foreground">Based on current conditions</p>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                Confidence Score
              </div>
              <div className="text-2xl font-bold text-risk-low">{confidence}%</div>
              <p className="text-[10px] text-muted-foreground">Model accuracy level</p>
            </div>
          </div>

          {/* Why This Risk Section */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              Why this risk?
              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground font-normal">
                {riskDrivers.filter(d => d.impact === "high").length} critical factors
              </Badge>
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {riskDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 cursor-pointer transition-colors group"
                >
                  <div className={cn("rounded-md p-1.5 shrink-0", impactColors[driver.impact])}>
                    <driver.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{driver.label}</span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] px-1.5 py-0 border-0 capitalize",
                          impactColors[driver.impact]
                        )}
                      >
                        {driver.impact}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {driver.description}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
