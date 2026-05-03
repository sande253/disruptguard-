"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { MapPin } from "lucide-react"

// India map boundaries (approximate lat/lng)
const INDIA_BOUNDS = {
  minLat: 8.0,
  maxLat: 37.0,
  minLng: 68.0,
  maxLng: 97.5,
}

// City coordinates (lat, lng) - accurate positions
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Mumbai": { lat: 19.076, lng: 72.877 },
  "Delhi": { lat: 28.613, lng: 77.209 },
  "Bangalore": { lat: 12.972, lng: 77.594 },
  "Chennai": { lat: 13.083, lng: 80.270 },
  "Hyderabad": { lat: 17.385, lng: 78.486 },
  "Kolkata": { lat: 22.572, lng: 88.363 },
  "Pune": { lat: 18.520, lng: 73.856 },
  "Ahmedabad": { lat: 23.022, lng: 72.571 },
  "Jaipur": { lat: 26.912, lng: 75.787 },
  "Kochi": { lat: 9.931, lng: 76.267 },
  "Vizag": { lat: 17.686, lng: 83.218 },
  "Nagpur": { lat: 21.145, lng: 79.088 },
  "Lucknow": { lat: 26.846, lng: 80.946 },
  "Surat": { lat: 21.170, lng: 72.831 },
  "Coimbatore": { lat: 11.016, lng: 76.955 },
  "Panaji": { lat: 15.491, lng: 73.827 },
  "Bhopal": { lat: 23.259, lng: 77.412 },
  "Indore": { lat: 22.719, lng: 75.857 },
  "Chandigarh": { lat: 30.733, lng: 76.779 },
  "Guwahati": { lat: 26.144, lng: 91.736 },
}

// Convert lat/lng to SVG coordinates
function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - INDIA_BOUNDS.minLng) / (INDIA_BOUNDS.maxLng - INDIA_BOUNDS.minLng)) * 100
  const y = ((INDIA_BOUNDS.maxLat - lat) / (INDIA_BOUNDS.maxLat - INDIA_BOUNDS.minLat)) * 100
  return { x, y }
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

// Accurate India outline SVG path
const INDIA_PATH = `M 16.5 12 L 18 10.5 L 20 9.5 L 22.5 9 L 25 8.5 L 27.5 7.5 L 30 7 L 32.5 6 L 35 5.5 
L 37.5 6 L 40 7 L 42 8 L 44 9 L 45.5 10.5 L 47 12 L 48.5 13 L 50 14.5 L 52 15.5 L 54.5 16 
L 57 16.5 L 59.5 17 L 62 18 L 64.5 19 L 67 20.5 L 69.5 22 L 72 23.5 L 74 25 L 75.5 27 
L 77 29 L 78 31 L 79 33.5 L 80 36 L 80.5 38.5 L 81 41 L 80.5 43.5 L 79.5 46 L 78 48 
L 76 49.5 L 74 51 L 72 52 L 70 53 L 68 54.5 L 66 56 L 64.5 58 L 63 60 L 61.5 62.5 
L 60 65 L 58 67 L 55.5 69 L 53 71 L 50.5 73 L 48 75 L 45 76.5 L 42 78 L 39 79 
L 36 80 L 33 81 L 30 81.5 L 27 82 L 24 82.5 L 21 83 L 18 84 L 15 85 L 12 86 
L 10 87 L 8.5 88.5 L 7 90 L 6 91.5 L 5.5 93 L 6 94 L 7 95 L 8.5 95.5 L 10.5 95 
L 12 94 L 13 92.5 L 14 91 L 15.5 89.5 L 17 88 L 18 86 L 18.5 84 L 18.5 82 
L 18 80 L 17 78 L 15.5 76 L 14 74 L 12.5 72 L 11 70 L 10 68 L 9 66 L 8 64 
L 7.5 62 L 7 60 L 6.5 58 L 6 55.5 L 5.5 53 L 5 50.5 L 5 48 L 5.5 45.5 L 6 43 
L 6.5 40.5 L 7 38 L 7.5 35.5 L 8 33 L 9 30.5 L 10 28 L 11.5 25.5 L 13 23 
L 14.5 20.5 L 15.5 18 L 16 15 L 16.5 12 Z`

// Kashmir region path (northern disputed area)
const KASHMIR_PATH = `M 16.5 12 L 18 10.5 L 20 8 L 23 6 L 26 4.5 L 29 3.5 L 32 3 L 35 3.5 
L 37 5 L 35 5.5 L 32.5 6 L 30 7 L 27.5 7.5 L 25 8.5 L 22.5 9 L 20 9.5 L 18 10.5 L 16.5 12`

// Northeast region path
const NORTHEAST_PATH = `M 77 29 L 79 27 L 81 25 L 84 24 L 87 23.5 L 90 24 L 92.5 25.5 
L 94 27.5 L 95 30 L 95.5 32.5 L 95 35 L 93.5 37 L 91 38.5 L 88 39.5 L 85 40 
L 82 40.5 L 80 41 L 80.5 38.5 L 80 36 L 79 33.5 L 78 31 L 77 29`

export function IndiaRouteMap({ source, destination, isLoading }: IndiaRouteMapProps) {
  const [hoveredSegment, setHoveredSegment] = useState<RouteSegment | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [segments, setSegments] = useState<RouteSegment[]>([])

  // Generate segments when route changes
  useEffect(() => {
    if (source && destination) {
      const reasons = [
        { low: "Clear highway conditions", medium: "Light traffic expected", high: "Construction zone ahead" },
        { low: "Normal traffic flow", medium: "Urban congestion expected", high: "Weather warning in effect" },
        { low: "Express corridor", medium: "Peak hour traffic", high: "Accident reported nearby" },
        { low: "Smooth transit", medium: "Border checkpoint delays", high: "Road blockage reported" },
      ]
      
      const riskLevels: Array<"low" | "medium" | "high"> = ["low", "medium", "high", "low"]
      const newSegments: RouteSegment[] = riskLevels.map((risk, i) => ({
        id: `seg${i + 1}`,
        risk,
        delayPercent: risk === "low" ? Math.floor(Math.random() * 10) + 2 : risk === "medium" ? Math.floor(Math.random() * 20) + 15 : Math.floor(Math.random() * 25) + 35,
        reason: reasons[i][risk],
        startPercent: i * 25,
        endPercent: (i + 1) * 25,
      }))
      setSegments(newSegments)
    }
  }, [source, destination])

  const sourceCoords = source && cityCoordinates[source] ? latLngToSvg(cityCoordinates[source].lat, cityCoordinates[source].lng) : null
  const destCoords = destination && cityCoordinates[destination] ? latLngToSvg(cityCoordinates[destination].lat, cityCoordinates[destination].lng) : null

  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return "#22c55e"
      case "medium": return "#f59e0b"
      case "high": return "#ef4444"
    }
  }

  const hasRoute = sourceCoords && destCoords

  // Calculate curved path between two points
  const getCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2
    const midY = (start.y + end.y) / 2
    const dx = end.x - start.x
    const dy = end.y - start.y
    const offset = Math.sqrt(dx * dx + dy * dy) * 0.15
    const controlX = midX - dy * offset / Math.sqrt(dx * dx + dy * dy || 1)
    const controlY = midY + dx * offset / Math.sqrt(dx * dx + dy * dy || 1)
    return { controlX, controlY }
  }

  // Get point along quadratic bezier curve
  const getPointOnCurve = (start: { x: number; y: number }, control: { x: number; y: number }, end: { x: number; y: number }, t: number) => {
    const x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * control.x + Math.pow(t, 2) * end.x
    const y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * control.y + Math.pow(t, 2) * end.y
    return { x, y }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          India Route Map
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="relative h-[420px] w-full rounded-xl bg-secondary/30 overflow-hidden"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }}
        >
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10"
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
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full max-w-[380px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* India outline - main body */}
                  <motion.path
                    d={INDIA_PATH}
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  
                  {/* Kashmir region */}
                  <motion.path
                    d={KASHMIR_PATH}
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.3"
                    strokeDasharray="2 1"
                    opacity={0.6}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5 }}
                  />
                  
                  {/* Northeast region */}
                  <motion.path
                    d={NORTHEAST_PATH}
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />

                  {/* City dots (background) */}
                  {Object.entries(cityCoordinates).map(([city, coords]) => {
                    const pos = latLngToSvg(coords.lat, coords.lng)
                    if (city === source || city === destination) return null
                    return (
                      <circle
                        key={city}
                        cx={pos.x}
                        cy={pos.y}
                        r={0.8}
                        fill="hsl(var(--muted-foreground))"
                        opacity={0.3}
                      />
                    )
                  })}

                  {/* Route with segments */}
                  {hasRoute && sourceCoords && destCoords && (
                    <g>
                      {(() => {
                        const { controlX, controlY } = getCurvedPath(sourceCoords, destCoords)
                        const control = { x: controlX, y: controlY }

                        return segments.map((segment, idx) => {
                          const startT = segment.startPercent / 100
                          const endT = segment.endPercent / 100
                          const startPoint = getPointOnCurve(sourceCoords, control, destCoords, startT)
                          const endPoint = getPointOnCurve(sourceCoords, control, destCoords, endT)
                          const midT = (startT + endT) / 2
                          const midPoint = getPointOnCurve(sourceCoords, control, destCoords, midT)

                          return (
                            <motion.path
                              key={segment.id}
                              d={`M ${startPoint.x} ${startPoint.y} Q ${midPoint.x} ${midPoint.y} ${endPoint.x} ${endPoint.y}`}
                              stroke={getRiskColor(segment.risk)}
                              strokeWidth={hoveredSegment?.id === segment.id ? 3 : 2}
                              strokeLinecap="round"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.6, delay: idx * 0.15 }}
                              onMouseEnter={() => setHoveredSegment(segment)}
                              onMouseLeave={() => setHoveredSegment(null)}
                              className="cursor-pointer"
                              style={{ 
                                filter: hoveredSegment?.id === segment.id ? `drop-shadow(0 0 4px ${getRiskColor(segment.risk)})` : "none",
                              }}
                            />
                          )
                        })
                      })()}

                      {/* Origin marker */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <circle
                          cx={sourceCoords.x}
                          cy={sourceCoords.y}
                          r={4}
                          fill="#3b82f6"
                          stroke="#1e40af"
                          strokeWidth={0.8}
                        />
                        <circle
                          cx={sourceCoords.x}
                          cy={sourceCoords.y}
                          r={6}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={0.4}
                          opacity={0.5}
                        />
                      </motion.g>

                      {/* Destination marker */}
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      >
                        <circle
                          cx={destCoords.x}
                          cy={destCoords.y}
                          r={4}
                          fill="#06b6d4"
                          stroke="#0e7490"
                          strokeWidth={0.8}
                        />
                        <circle
                          cx={destCoords.x}
                          cy={destCoords.y}
                          r={6}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth={0.4}
                          opacity={0.5}
                        />
                      </motion.g>
                    </g>
                  )}
                </svg>

                {/* City labels */}
                {hasRoute && sourceCoords && destCoords && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute flex items-center gap-1 text-xs font-semibold text-blue-400 bg-background/80 px-2 py-0.5 rounded-full border border-blue-500/30"
                      style={{
                        left: `calc(50% + ${(sourceCoords.x - 50) * 3.8}px - 24px)`,
                        top: `calc(50% + ${(sourceCoords.y - 50) * 4.2}px - 32px)`,
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      {source}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="absolute flex items-center gap-1 text-xs font-semibold text-cyan-400 bg-background/80 px-2 py-0.5 rounded-full border border-cyan-500/30"
                      style={{
                        left: `calc(50% + ${(destCoords.x - 50) * 3.8}px - 24px)`,
                        top: `calc(50% + ${(destCoords.y - 50) * 4.2}px + 20px)`,
                      }}
                    >
                      <MapPin className="h-3 w-3" />
                      {destination}
                    </motion.div>
                  </>
                )}

                {/* Empty state */}
                {!hasRoute && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Enter a route to visualize on India map
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredSegment && hasRoute && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-20 bg-popover border border-border rounded-lg p-3 shadow-xl min-w-[200px] pointer-events-none"
                style={{
                  left: Math.min(mousePos.x + 16, 280),
                  top: Math.min(mousePos.y - 10, 320),
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getRiskColor(hoveredSegment.risk) }}
                  />
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {hoveredSegment.risk} Risk Segment
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Delay probability:</span>
                    <span className="font-bold text-foreground">{hoveredSegment.delayPercent}%</span>
                  </div>
                  <div className="pt-1 border-t border-border">
                    <span className="text-muted-foreground">Reason: </span>
                    <span className="text-foreground">{hoveredSegment.reason}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-border shadow-lg">
            <span className="text-xs font-medium text-muted-foreground mr-1">Risk:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-1.5 rounded-full bg-[#f59e0b]" />
              <span className="text-xs text-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-1.5 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-foreground">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
