"use client"

import { motion } from "framer-motion"
import { MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RouteSegment {
  id: string
  name: string
  distance: string
  riskLevel: "low" | "moderate" | "high"
  cause: string
  estimatedTime: string
}

const routeSegments: RouteSegment[] = [
  {
    id: "1",
    name: "Hyderabad Hub",
    distance: "0 km",
    riskLevel: "low",
    cause: "Clear conditions",
    estimatedTime: "Start",
  },
  {
    id: "2",
    name: "NH-65 Section",
    distance: "120 km",
    riskLevel: "moderate",
    cause: "Heavy traffic expected",
    estimatedTime: "+2h 30m",
  },
  {
    id: "3",
    name: "Kurnool Junction",
    distance: "210 km",
    riskLevel: "high",
    cause: "Road construction + Weather",
    estimatedTime: "+4h 15m",
  },
  {
    id: "4",
    name: "NH-44 Corridor",
    distance: "350 km",
    riskLevel: "moderate",
    cause: "Weather advisory active",
    estimatedTime: "+6h 45m",
  },
  {
    id: "5",
    name: "Chennai Port",
    distance: "520 km",
    riskLevel: "low",
    cause: "Normal operations",
    estimatedTime: "+9h 30m",
  },
]

const riskStyles = {
  low: {
    bg: "bg-risk-low",
    bgLight: "bg-risk-low/10",
    text: "text-risk-low",
    border: "border-risk-low/30",
  },
  moderate: {
    bg: "bg-risk-moderate",
    bgLight: "bg-risk-moderate/10",
    text: "text-risk-moderate",
    border: "border-risk-moderate/30",
  },
  high: {
    bg: "bg-risk-high",
    bgLight: "bg-risk-high/10",
    text: "text-risk-high",
    border: "border-risk-high/30",
  },
}

export function RouteSegments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Route Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Segment visualization */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
              {routeSegments.map((segment, index) => (
                <div key={segment.id} className="flex items-center">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "h-3 rounded-full origin-left",
                      riskStyles[segment.riskLevel].bg,
                      index === 0 ? "w-8" : "w-16 sm:w-24"
                    )}
                  />
                  {index < routeSegments.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Segment details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {routeSegments.map((segment, index) => {
                const styles = riskStyles[segment.riskLevel]

                return (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    className={cn(
                      "rounded-lg border p-3",
                      styles.bgLight,
                      styles.border
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{segment.distance}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          styles.text,
                          styles.border
                        )}
                      >
                        {segment.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {segment.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {segment.cause}
                    </p>
                    <p className={cn("text-xs font-medium mt-2", styles.text)}>
                      {segment.estimatedTime}
                    </p>
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
