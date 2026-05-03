"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"

interface IndiaRouteMapProps {
  source: string | null
  destination: string | null
  isLoading?: boolean
}

// City coordinates mapped to the SVG viewBox (0-1000 scale based on the provided SVG)
const CITY_COORDS: Record<string, { x: number; y: number; label: string }> = {
  "Mumbai": { x: 280, y: 580, label: "Mumbai" },
  "Delhi": { x: 370, y: 280, label: "Delhi" },
  "Bangalore": { x: 350, y: 720, label: "Bangalore" },
  "Chennai": { x: 430, y: 740, label: "Chennai" },
  "Hyderabad": { x: 370, y: 620, label: "Hyderabad" },
  "Kolkata": { x: 560, y: 480, label: "Kolkata" },
  "Pune": { x: 300, y: 600, label: "Pune" },
  "Ahmedabad": { x: 250, y: 450, label: "Ahmedabad" },
  "Jaipur": { x: 320, y: 340, label: "Jaipur" },
  "Lucknow": { x: 430, y: 340, label: "Lucknow" },
  "Kochi": { x: 310, y: 800, label: "Kochi" },
  "Vizag": { x: 460, y: 610, label: "Vizag" },
  "Surat": { x: 260, y: 490, label: "Surat" },
  "Nagpur": { x: 370, y: 500, label: "Nagpur" },
  "Indore": { x: 310, y: 450, label: "Indore" },
  "Bhopal": { x: 340, y: 430, label: "Bhopal" },
  "Chandigarh": { x: 360, y: 240, label: "Chandigarh" },
  "Coimbatore": { x: 340, y: 780, label: "Coimbatore" },
  "Guwahati": { x: 620, y: 360, label: "Guwahati" },
}

// Route segments with risk levels
const ROUTE_SEGMENTS = [
  { risk: "low" as const, delay: 5, reason: "Clear highway" },
  { risk: "medium" as const, delay: 15, reason: "Urban congestion" },
  { risk: "high" as const, delay: 35, reason: "Weather disruption" },
  { risk: "medium" as const, delay: 12, reason: "Port delays" },
]

const RISK_COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
}

export function IndiaRouteMap({ source, destination, isLoading = false }: IndiaRouteMapProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const hasRoute = source && destination
  const sourceCoords = source ? CITY_COORDS[source] : null
  const destCoords = destination ? CITY_COORDS[destination] : null

  // Generate route path segments
  const routeSegments = useMemo(() => {
    if (!sourceCoords || !destCoords) return []
    
    const segments = []
    const numSegments = ROUTE_SEGMENTS.length
    
    for (let i = 0; i < numSegments; i++) {
      const t1 = i / numSegments
      const t2 = (i + 1) / numSegments
      
      // Control point for curve
      const midX = (sourceCoords.x + destCoords.x) / 2
      const midY = Math.min(sourceCoords.y, destCoords.y) - 50
      
      // Quadratic bezier interpolation
      const x1 = (1-t1)*(1-t1)*sourceCoords.x + 2*(1-t1)*t1*midX + t1*t1*destCoords.x
      const y1 = (1-t1)*(1-t1)*sourceCoords.y + 2*(1-t1)*t1*midY + t1*t1*destCoords.y
      const x2 = (1-t2)*(1-t2)*sourceCoords.x + 2*(1-t2)*t2*midX + t2*t2*destCoords.x
      const y2 = (1-t2)*(1-t2)*sourceCoords.y + 2*(1-t2)*t2*midY + t2*t2*destCoords.y
      
      segments.push({
        x1, y1, x2, y2,
        ...ROUTE_SEGMENTS[i]
      })
    }
    
    return segments
  }, [sourceCoords, destCoords])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          India Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="relative h-[420px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          onMouseMove={handleMouseMove}
        >
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
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyzing route...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-full h-full max-w-[400px]"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ filter: "drop-shadow(0 4px 20px rgba(59, 130, 246, 0.15))" }}
                >
                  <defs>
                    <linearGradient id="india-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* India Map Path - Accurate outline */}
                  <g transform="translate(100, 50) scale(0.8)">
                    {/* Main India landmass */}
                    <path
                      d="M350,100 L400,80 L450,90 L500,110 L550,100 L600,120 L650,150
                         L680,200 L700,250 L720,300 L710,350 L730,400 L750,450
                         L740,500 L720,550 L680,600 L640,650 L600,700 L550,750
                         L500,800 L450,850 L400,880 L350,900 L300,870 L260,820
                         L230,760 L210,700 L190,640 L170,580 L160,520 L150,460
                         L160,400 L180,340 L200,280 L230,220 L270,170 L310,130 Z"
                      fill="url(#india-fill)"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    
                    {/* Northeast region */}
                    <path
                      d="M730,300 L780,280 L820,300 L850,340 L840,380 L800,400 L760,380 L730,350 Z"
                      fill="url(#india-fill)"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    
                    {/* Sri Lanka hint */}
                    <ellipse
                      cx="420"
                      cy="920"
                      rx="30"
                      ry="40"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </g>
                  
                  {/* Route segments */}
                  {hasRoute && routeSegments.map((segment, idx) => (
                    <motion.line
                      key={idx}
                      x1={segment.x1}
                      y1={segment.y1}
                      x2={segment.x2}
                      y2={segment.y2}
                      stroke={RISK_COLORS[segment.risk]}
                      strokeWidth={hoveredSegment === idx ? 6 : 4}
                      strokeLinecap="round"
                      filter={hoveredSegment === idx ? "url(#glow)" : undefined}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                  
                  {/* City markers */}
                  {hasRoute && sourceCoords && (
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <circle
                        cx={sourceCoords.x}
                        cy={sourceCoords.y}
                        r="12"
                        fill="#3b82f6"
                        stroke="#fff"
                        strokeWidth="3"
                      />
                      <text
                        x={sourceCoords.x}
                        y={sourceCoords.y - 20}
                        fill="#fff"
                        fontSize="14"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {sourceCoords.label}
                      </text>
                    </motion.g>
                  )}
                  
                  {hasRoute && destCoords && (
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring" }}
                    >
                      <circle
                        cx={destCoords.x}
                        cy={destCoords.y}
                        r="12"
                        fill="#8b5cf6"
                        stroke="#fff"
                        strokeWidth="3"
                      />
                      <text
                        x={destCoords.x}
                        y={destCoords.y - 20}
                        fill="#fff"
                        fontSize="14"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {destCoords.label}
                      </text>
                    </motion.g>
                  )}
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Segment tooltip */}
          {hoveredSegment !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-20 bg-slate-900/95 border border-slate-700 rounded-lg px-3 py-2 pointer-events-none shadow-xl"
              style={{
                left: Math.min(mousePos.x + 10, 280),
                top: mousePos.y - 60,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: RISK_COLORS[routeSegments[hoveredSegment].risk] }}
                />
                <span className="text-sm font-medium text-white capitalize">
                  {routeSegments[hoveredSegment].risk} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400">
                +{routeSegments[hoveredSegment].delay}% delay probability
              </p>
              <p className="text-xs text-slate-500">
                {routeSegments[hoveredSegment].reason}
              </p>
            </motion.div>
          )}
          
          {/* Empty state overlay */}
          {!hasRoute && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-xl text-center shadow-xl border border-slate-700/50"
              >
                <MapPin className="h-10 w-10 text-primary/60 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-200">
                  Enter a route to visualize on India map
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Select source and destination cities above
                </p>
              </motion.div>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-slate-300">Low</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-slate-300">Medium</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-300">High</span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
