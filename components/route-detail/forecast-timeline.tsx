"use client"

import { motion } from "framer-motion"
import { Cloud, AlertTriangle, Car, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  id: string
  type: "cyclone" | "accident" | "congestion" | "weather"
  title: string
  description: string
  timestamp: string
  severity: "low" | "moderate" | "high"
  duration: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "weather",
    title: "Heavy Rainfall Warning",
    description: "IMD predicts heavy rainfall along NH-65 section",
    timestamp: "In 6 hours",
    severity: "moderate",
    duration: "4-6 hours",
  },
  {
    id: "2",
    type: "cyclone",
    title: "Cyclone Alert",
    description: "Category 2 cyclone approaching Bay of Bengal",
    timestamp: "In 18 hours",
    severity: "high",
    duration: "12-24 hours",
  },
  {
    id: "3",
    type: "congestion",
    title: "Traffic Congestion",
    description: "Expected congestion near Kurnool Junction due to market day",
    timestamp: "In 8 hours",
    severity: "moderate",
    duration: "3-4 hours",
  },
  {
    id: "4",
    type: "accident",
    title: "Road Maintenance",
    description: "Scheduled maintenance on NH-44 corridor",
    timestamp: "In 24 hours",
    severity: "low",
    duration: "6 hours",
  },
]

const eventIcons = {
  cyclone: Cloud,
  accident: AlertTriangle,
  congestion: Car,
  weather: Cloud,
}

const severityStyles = {
  low: {
    bg: "bg-risk-low/10",
    border: "border-risk-low/30",
    text: "text-risk-low",
    dot: "bg-risk-low",
  },
  moderate: {
    bg: "bg-risk-moderate/10",
    border: "border-risk-moderate/30",
    text: "text-risk-moderate",
    dot: "bg-risk-moderate",
  },
  high: {
    bg: "bg-risk-high/10",
    border: "border-risk-high/30",
    text: "text-risk-high",
    dot: "bg-risk-high",
  },
}

export function ForecastTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            72-Hour Forecast Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {timelineEvents.map((event, index) => {
                const Icon = eventIcons[event.type]
                const styles = severityStyles[event.severity]

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative pl-10"
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute left-2.5 top-3 h-3 w-3 rounded-full border-2 border-background",
                        styles.dot
                      )}
                    />

                    <div
                      className={cn(
                        "rounded-lg border p-4",
                        styles.bg,
                        styles.border
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", styles.bg)}>
                            <Icon className={cn("h-4 w-4", styles.text)} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn("text-sm font-medium", styles.text)}>
                            {event.timestamp}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Duration: {event.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
