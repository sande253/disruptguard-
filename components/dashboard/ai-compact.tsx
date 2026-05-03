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
  icon: typeof Route
  costImpact: string
  riskReduction: number
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reroute via NH-48",
    icon: Route,
    costImpact: "+₹12K",
    riskReduction: 65,
  },
  {
    id: "2",
    title: "Switch to Rail",
    icon: Train,
    costImpact: "+12%",
    riskReduction: 78,
  },
  {
    id: "3",
    title: "Activate Buffer Stock",
    icon: Package,
    costImpact: "₹0",
    riskReduction: 45,
  },
]

export function AICompact() {
  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          AI Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 cursor-pointer transition-colors group"
          >
            <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
              <rec.icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{rec.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{rec.costImpact}</span>
                <Badge className="h-4 px-1 text-[9px] bg-risk-low/20 text-risk-low border-0">
                  -{rec.riskReduction}%
                </Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              className="h-6 px-2 text-[10px] bg-primary/80 hover:bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Apply
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
