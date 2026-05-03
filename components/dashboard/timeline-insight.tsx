"use client"

import { motion } from "framer-motion"
import { Clock, Sun, Cloud, CloudRain, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TimelinePhase {
  id: string
  timeRange: string
  label: string
  status: "safe" | "caution" | "danger"
  icon: typeof Sun
  description: string
}

const timelinePhases: TimelinePhase[] = [
  {
    id: "1",
    timeRange: "0-12h",
    label: "Clear Window",
    status: "safe",
    icon: Sun,
    description: "Optimal conditions for departure",
  },
  {
    id: "2",
    timeRange: "12-24h",
    label: "Rainfall Expected",
    status: "caution",
    icon: CloudRain,
    description: "Moderate rain along NH-44 corridor",
  },
  {
    id: "3",
    timeRange: "24-48h",
    label: "Cyclone Impact",
    status: "danger",
    icon: AlertTriangle,
    description: "Severe weather approaching coast",
  },
  {
    id: "4",
    timeRange: "48-72h",
    label: "Recovery Phase",
    status: "caution",
    icon: Cloud,
    description: "Conditions improving gradually",
  },
]

const statusStyles = {
  safe: {
    bg: "bg-risk-low/10",
    border: "border-risk-low/30",
    text: "text-risk-low",
    dot: "bg-risk-low",
  },
  caution: {
    bg: "bg-risk-moderate/10",
    border: "border-risk-moderate/30",
    text: "text-risk-moderate",
    dot: "bg-risk-moderate",
  },
  danger: {
    bg: "bg-risk-high/10",
    border: "border-risk-high/30",
    text: "text-risk-high",
    dot: "bg-risk-high",
  },
}

export function TimelineInsight() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            What Will Happen Over Time
          </CardTitle>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            72-hour outlook
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline connector line */}
          <div className="absolute left-[52px] top-4 bottom-4 w-0.5 bg-border" />
          
          <div className="space-y-3">
            {timelinePhases.map((phase, index) => {
              const styles = statusStyles[phase.status]
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  {/* Time Range */}
                  <div className="w-[44px] text-right">
                    <span className="text-xs font-medium text-muted-foreground">{phase.timeRange}</span>
                  </div>
                  
                  {/* Dot */}
                  <div className="relative z-10">
                    <div className={cn("w-3 h-3 rounded-full border-2 border-card", styles.dot)} />
                  </div>
                  
                  {/* Content Card */}
                  <div 
                    className={cn(
                      "flex-1 flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:border-opacity-60",
                      styles.bg,
                      styles.border
                    )}
                  >
                    <div className={cn("rounded-md p-1.5", styles.bg)}>
                      <phase.icon className={cn("h-4 w-4", styles.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", styles.text)}>{phase.label}</p>
                      <p className="text-xs text-muted-foreground">{phase.description}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px] border-0 capitalize", styles.bg, styles.text)}
                    >
                      {phase.status}
                    </Badge>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
