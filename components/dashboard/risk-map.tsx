"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface RouteSegment {
  id: string
  name: string
  riskLevel: "low" | "moderate" | "high"
  delayProbability: number
  reason: string
  x1: number
  y1: number
  x2: number
  y2: number
}

const routeSegments: RouteSegment[] = [
  {
    id: "1",
    name: "Hyderabad Hub",
    riskLevel: "low",
    delayProbability: 12,
    reason: "Clear conditions",
    x1: 78,
    y1: 150,
    x2: 120,
    y2: 170,
  },
  {
    id: "2",
    name: "NH-65 Section",
    riskLevel: "moderate",
    delayProbability: 45,
    reason: "Heavy traffic expected",
    x1: 120,
    y1: 170,
    x2: 180,
    y2: 200,
  },
  {
    id: "3",
    name: "Kurnool Junction",
    riskLevel: "high",
    delayProbability: 78,
    reason: "Road construction ahead",
    x1: 180,
    y1: 200,
    x2: 240,
    y2: 240,
  },
  {
    id: "4",
    name: "NH-44 Corridor",
    riskLevel: "moderate",
    delayProbability: 38,
    reason: "Weather advisory active",
    x1: 240,
    y1: 240,
    x2: 300,
    y2: 280,
  },
  {
    id: "5",
    name: "Chennai Port",
    riskLevel: "low",
    delayProbability: 15,
    reason: "Normal operations",
    x1: 300,
    y1: 280,
    x2: 350,
    y2: 300,
  },
]

const riskColors = {
  low: "#22c55e",
  moderate: "#f59e0b",
  high: "#ef4444",
}

export function RiskMap() {
  const [hoveredSegment, setHoveredSegment] = useState<RouteSegment | null>(null)
  const router = useRouter()

  const handleRouteClick = () => {
    router.push("/routes/hyderabad-chennai")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Route Risk Map
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={handleRouteClick}
            >
              View Details
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-low" />
                <span className="text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-moderate" />
                <span className="text-muted-foreground">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-risk-high" />
                <span className="text-muted-foreground">High</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
              className="relative h-[320px] w-full rounded-xl bg-secondary/50 overflow-hidden cursor-pointer group"
              onClick={handleRouteClick}
            >
            {/* Simplified India map outline */}
            <svg
              viewBox="0 0 400 340"
              className="h-full w-full"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
            >
              {/* India outline - simplified */}
              <path
                d="M200 20 L280 40 L320 80 L340 140 L350 200 L340 260 L300 300 L240 320 L180 320 L120 300 L80 260 L60 200 L70 140 L100 80 L140 40 Z"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                opacity="0.5"
              />
              
              {/* Grid lines for visual appeal */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 42.5}
                  x2="400"
                  y2={i * 42.5}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="340"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              ))}

              {/* Route segments */}
              {routeSegments.map((segment) => (
                <g key={segment.id}>
                  <line
                    x1={segment.x1}
                    y1={segment.y1}
                    x2={segment.x2}
                    y2={segment.y2}
                    stroke={riskColors[segment.riskLevel]}
                    strokeWidth={hoveredSegment?.id === segment.id ? 6 : 4}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredSegment(segment)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  {/* Animated pulse for high risk */}
                  {segment.riskLevel === "high" && (
                    <circle
                      cx={(segment.x1 + segment.x2) / 2}
                      cy={(segment.y1 + segment.y2) / 2}
                      r="8"
                      fill={riskColors.high}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}
                </g>
              ))}

              {/* City markers */}
              <g>
                <circle cx="78" cy="150" r="8" fill="hsl(var(--primary))" />
                <text x="78" y="135" textAnchor="middle" className="fill-foreground text-xs font-medium">
                  Hyderabad
                </text>
              </g>
              <g>
                <circle cx="350" cy="300" r="8" fill="hsl(var(--primary))" />
                <text x="350" y="285" textAnchor="middle" className="fill-foreground text-xs font-medium">
                  Chennai
                </text>
              </g>
            </svg>

            {/* Click overlay hint */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
              <span className="text-sm font-medium text-primary bg-background/90 px-3 py-1.5 rounded-full">
                Click to view route details
              </span>
            </div>

            {/* Tooltip */}
            {hoveredSegment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-1/2 top-4 -translate-x-1/2 z-10"
              >
                <div className="rounded-lg border border-border bg-popover p-3 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-foreground">{hoveredSegment.name}</span>
                    <Badge
                      className={cn(
                        "text-xs",
                        hoveredSegment.riskLevel === "low" && "bg-risk-low/20 text-risk-low border-risk-low/30",
                        hoveredSegment.riskLevel === "moderate" && "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
                        hoveredSegment.riskLevel === "high" && "bg-risk-high/20 text-risk-high border-risk-high/30"
                      )}
                    >
                      {hoveredSegment.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Delay probability: <span className="text-foreground font-medium">{hoveredSegment.delayProbability}%</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{hoveredSegment.reason}</p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
