"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

// City coordinates (approximate positions on our map viewport)
const cityCoordinates: Record<string, { x: number; y: number }> = {
  "Mumbai": { x: 18, y: 52 },
  "Delhi": { x: 35, y: 22 },
  "Bangalore": { x: 32, y: 72 },
  "Chennai": { x: 45, y: 68 },
  "Hyderabad": { x: 38, y: 58 },
  "Kolkata": { x: 65, y: 38 },
  "Pune": { x: 22, y: 56 },
  "Ahmedabad": { x: 18, y: 38 },
  "Jaipur": { x: 30, y: 28 },
  "Kochi": { x: 28, y: 82 },
  "Vizag": { x: 52, y: 55 },
  "Nagpur": { x: 38, y: 45 },
  "Lucknow": { x: 45, y: 28 },
  "Surat": { x: 18, y: 45 },
  "Coimbatore": { x: 30, y: 78 },
}

interface RouteSegment {
  id: string
  risk: "low" | "medium" | "high"
  delayPercent: number
  reason: string
  startPercent: number
  endPercent: number
}

interface IndiaRouteMapProps {
  source: string | null
  destination: string | null
  isLoading?: boolean
}

export function IndiaRouteMap({ source, destination, isLoading }: IndiaRouteMapProps) {
  const [hoveredSegment, setHoveredSegment] = useState<RouteSegment | null>(null)
  const [segments, setSegments] = useState<RouteSegment[]>([])

  // Generate random segments when route changes
  useEffect(() => {
    if (source && destination) {
      const newSegments: RouteSegment[] = [
        {
          id: "seg1",
          risk: "low",
          delayPercent: 5,
          reason: "Clear highway conditions",
          startPercent: 0,
          endPercent: 35,
        },
        {
          id: "seg2",
          risk: "medium",
          delayPercent: 25,
          reason: "Urban congestion expected",
          startPercent: 35,
          endPercent: 60,
        },
        {
          id: "seg3",
          risk: "high",
          delayPercent: 45,
          reason: "Weather warning in effect",
          startPercent: 60,
          endPercent: 80,
        },
        {
          id: "seg4",
          risk: "low",
          delayPercent: 8,
          reason: "Normal traffic flow",
          startPercent: 80,
          endPercent: 100,
        },
      ]
      setSegments(newSegments)
    }
  }, [source, destination])

  const sourceCoords = source ? cityCoordinates[source] : null
  const destCoords = destination ? cityCoordinates[destination] : null

  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return "#22c55e"
      case "medium":
        return "#f59e0b"
      case "high":
        return "#ef4444"
    }
  }

  const hasRoute = sourceCoords && destCoords

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          India Route Map
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative h-[400px] w-full rounded-xl bg-secondary/50 overflow-hidden">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <Spinner className="h-8 w-8 text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing route...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* India outline (simplified) */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Simplified India shape */}
                  <path
                    d="M30 10 L55 8 L75 15 L78 25 L72 35 L68 32 L65 40 L70 50 L65 55 L55 75 L45 85 L35 88 L25 80 L20 70 L15 55 L12 40 L18 25 L25 15 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border"
                    opacity={0.5}
                  />

                  {/* Grid lines for reference */}
                  {[20, 40, 60, 80].map((pos) => (
                    <g key={pos}>
                      <line
                        x1="0"
                        y1={pos}
                        x2="100"
                        y2={pos}
                        stroke="currentColor"
                        strokeWidth="0.1"
                        className="text-border"
                        opacity={0.3}
                      />
                      <line
                        x1={pos}
                        y1="0"
                        x2={pos}
                        y2="100"
                        stroke="currentColor"
                        strokeWidth="0.1"
                        className="text-border"
                        opacity={0.3}
                      />
                    </g>
                  ))}

                  {/* City dots */}
                  {Object.entries(cityCoordinates).map(([city, coords]) => (
                    <circle
                      key={city}
                      cx={coords.x}
                      cy={coords.y}
                      r={city === source || city === destination ? 0 : 0.8}
                      fill="currentColor"
                      className="text-muted-foreground"
                      opacity={0.4}
                    />
                  ))}

                  {/* Route line with segments */}
                  {hasRoute && (
                    <g>
                      {segments.map((segment) => {
                        const startX = sourceCoords.x + (destCoords.x - sourceCoords.x) * (segment.startPercent / 100)
                        const startY = sourceCoords.y + (destCoords.y - sourceCoords.y) * (segment.startPercent / 100)
                        const endX = sourceCoords.x + (destCoords.x - sourceCoords.x) * (segment.endPercent / 100)
                        const endY = sourceCoords.y + (destCoords.y - sourceCoords.y) * (segment.endPercent / 100)

                        return (
                          <motion.line
                            key={segment.id}
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke={getRiskColor(segment.risk)}
                            strokeWidth={hoveredSegment?.id === segment.id ? 3 : 2}
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, delay: segment.startPercent / 100 * 0.5 }}
                            onMouseEnter={() => setHoveredSegment(segment)}
                            onMouseLeave={() => setHoveredSegment(null)}
                            className="cursor-pointer"
                            style={{ filter: hoveredSegment?.id === segment.id ? "drop-shadow(0 0 4px currentColor)" : "none" }}
                          />
                        )
                      })}

                      {/* Origin marker */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <circle
                          cx={sourceCoords.x}
                          cy={sourceCoords.y}
                          r={3}
                          fill="#3b82f6"
                          stroke="#1d4ed8"
                          strokeWidth={0.5}
                        />
                        <circle
                          cx={sourceCoords.x}
                          cy={sourceCoords.y}
                          r={5}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={0.3}
                          opacity={0.5}
                        />
                      </motion.g>

                      {/* Destination marker */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                      >
                        <circle
                          cx={destCoords.x}
                          cy={destCoords.y}
                          r={3}
                          fill="#8b5cf6"
                          stroke="#6d28d9"
                          strokeWidth={0.5}
                        />
                        <circle
                          cx={destCoords.x}
                          cy={destCoords.y}
                          r={5}
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth={0.3}
                          opacity={0.5}
                        />
                      </motion.g>
                    </g>
                  )}
                </svg>

                {/* City labels */}
                {hasRoute && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute flex items-center gap-1 text-xs font-medium text-blue-400"
                      style={{
                        left: `${sourceCoords.x}%`,
                        top: `${sourceCoords.y}%`,
                        transform: "translate(-50%, -180%)",
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      {source}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="absolute flex items-center gap-1 text-xs font-medium text-purple-400"
                      style={{
                        left: `${destCoords.x}%`,
                        top: `${destCoords.y}%`,
                        transform: "translate(-50%, 80%)",
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      {destination}
                    </motion.div>
                  </>
                )}

                {/* Segment tooltip */}
                <AnimatePresence>
                  {hoveredSegment && hasRoute && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-3 shadow-lg min-w-[180px]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getRiskColor(hoveredSegment.risk) }}
                        />
                        <span className="text-sm font-medium text-foreground capitalize">
                          {hoveredSegment.risk} Risk
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delay probability:</span>
                          <span className="font-medium text-foreground">{hoveredSegment.delayPercent}%</span>
                        </div>
                        <div className="text-muted-foreground">
                          {hoveredSegment.reason}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty state */}
                {!hasRoute && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a route to visualize
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-[#f59e0b]" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
