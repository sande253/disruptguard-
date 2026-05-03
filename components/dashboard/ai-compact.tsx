"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Route, Train, Package, ChevronDown, ChevronUp, TrendingUp, Clock, IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Recommendation {
  id: string
  title: string
  icon: typeof Route
  costImpact: string
  timeImpact: string
  riskReduction: number
  confidence: number
  reasoning: string
  tradeoffs: string
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reroute via NH-48",
    icon: Route,
    costImpact: "+₹12K",
    timeImpact: "+2 hrs",
    riskReduction: 65,
    confidence: 92,
    reasoning: "NH-48 bypasses the cyclone-affected coastal zone and has better road conditions.",
    tradeoffs: "Longer distance but avoids 85% of weather-related delays.",
  },
  {
    id: "2",
    title: "Switch to Rail",
    icon: Train,
    costImpact: "-₹7K",
    timeImpact: "+4 hrs",
    riskReduction: 78,
    confidence: 88,
    reasoning: "Rail network unaffected by road congestion and weather delays in this corridor.",
    tradeoffs: "Slower but more predictable. Requires terminal handling at both ends.",
  },
  {
    id: "3",
    title: "Activate Buffer Stock",
    icon: Package,
    costImpact: "₹0",
    timeImpact: "0 hrs",
    riskReduction: 45,
    confidence: 95,
    reasoning: "Chennai warehouse has 3-day buffer. Can fulfill orders while shipment is delayed.",
    tradeoffs: "No additional cost but reduces safety stock for other routes.",
  },
]

export function AICompact() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            AI Recommendations
          </CardTitle>
          <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
            3 actions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        {recommendations.map((rec, index) => {
          const isExpanded = expandedId === rec.id
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg bg-secondary/40 overflow-hidden"
            >
              {/* Main row */}
              <div 
                className="flex items-center gap-2 p-2.5 hover:bg-secondary/70 cursor-pointer transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
              >
                <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                  <rec.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{rec.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{rec.costImpact}</span>
                    <span className="text-[10px] text-muted-foreground">{rec.timeImpact}</span>
                    <Badge className="h-4 px-1 text-[9px] bg-risk-low/20 text-risk-low border-0">
                      -{rec.riskReduction}% risk
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 text-[9px] border-border text-muted-foreground">
                    <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                    {rec.confidence}%
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-2">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Why this helps</p>
                        <p className="text-xs text-foreground mt-0.5">{rec.reasoning}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tradeoffs</p>
                        <p className="text-xs text-foreground mt-0.5">{rec.tradeoffs}</p>
                      </div>
                      <Button size="sm" className="w-full h-7 text-xs bg-primary hover:bg-primary/90 mt-2">
                        Apply Recommendation
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
