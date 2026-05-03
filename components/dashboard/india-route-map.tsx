"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { MapPin } from "lucide-react"

// SVG viewBox is 0-1000 for both axes
// Map coordinates based on the simplemaps India SVG
const cityCoordinates: Record<string, { x: number; y: number }> = {
  "Mumbai": { x: 248, y: 592 },
  "Delhi": { x: 350, y: 325 },
  "Bangalore": { x: 360, y: 760 },
  "Chennai": { x: 430, y: 755 },
  "Hyderabad": { x: 378, y: 660 },
  "Kolkata": { x: 565, y: 505 },
  "Pune": { x: 278, y: 625 },
  "Ahmedabad": { x: 235, y: 490 },
  "Jaipur": { x: 305, y: 400 },
  "Kochi": { x: 310, y: 855 },
  "Vizag": { x: 460, y: 640 },
  "Nagpur": { x: 378, y: 530 },
  "Lucknow": { x: 430, y: 395 },
  "Surat": { x: 238, y: 535 },
  "Coimbatore": { x: 340, y: 820 },
  "Panaji": { x: 262, y: 710 },
  "Bhopal": { x: 345, y: 480 },
  "Indore": { x: 305, y: 490 },
  "Chandigarh": { x: 338, y: 262 },
  "Guwahati": { x: 680, y: 405 },
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

  const sourceCoords = source && cityCoordinates[source] ? cityCoordinates[source] : null
  const destCoords = destination && cityCoordinates[destination] ? cityCoordinates[destination] : null

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
          className="relative h-[480px] w-full rounded-xl bg-secondary/30 overflow-hidden"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }}
        >
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-10"
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
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <svg
                  viewBox="0 0 1000 1000"
                  className="w-full h-full max-h-[440px]"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ filter: "drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4))" }}
                >
                  <defs>
                    {/* Gradient for India fill */}
                    <linearGradient id="india-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    {/* Glow filter */}
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feFlood floodColor="#3b82f6" floodOpacity="0.3" />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* India map from simplemaps - main features */}
                  <g id="india-map">
                    {/* Andaman & Nicobar Islands */}
                    <path d="M802.5 941.1l-0.2 0.4 0.3 0.4 0.5-0.1 0.4 0.8-0.1 0.3 0.2 0.7 0.1 0.8-0.1 1 0.4 0.2 0.4 0.8 0.1 1.1-0.2 0.3 0.4 0.4 0.2 0.6-0.5 0.5-0.2 0.6 0.2 0.3-0.6 0.3 0.2 0.5-0.3 0.4 0 0.6 0.5 0.2-0.4 1-0.3 0.2-0.4-0.5-0.5 0-0.2 0.4 0.1 0.5-0.5 0.7-0.6-0.2 0.2-1.2-0.4-0.2-0.4-0.6 0.2-0.4-0.5-0.4 0.1-0.5-0.4-0.7-0.4 0-0.2-0.5 0.3-0.3-0.2-0.7-0.4-0.2-0.2-0.6-0.4 0.1-0.3-0.6-0.3-0.2-0.5 0.1-0.1-0.8 0.1-1.1-0.2-0.1-0.2-1.1 0.6-0.4 0-1 0.3-0.4 0.7 0 0.6 0.1 0.6-0.7 1.4-0.1 0-0.3 0.5-0.3 0.6-0.1z m-3.7-5.6l0.3 0.6 0 0.7 0.9 0.6-0.1 0.5-0.3 0.3-0.5 1-0.5 0.2-0.7 0.5-0.3 0.7-0.6 0.5-0.5-0.7 0.1-0.6-0.2-0.5 0.3-0.4-0.1-1.1 0.8-0.5 1.3-0.4-0.1-1.2 0.2-0.2z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />
                    
                    {/* Main India landmass */}
                    <path d="M355.2 698.3l0.1-1.2-0.2-0.3 0.1-0.8-0.2-0.1-0.3-0.7 0.3-1.2-0.1-0.7-0.3-0.6-0.1-1.2 0.3-0.8 0-0.7-0.2-1.1 0.4-0.5 0.6 0 0.5-0.5 0.6-0.3 0.4 0.3 0.3-0.8-0.2-0.4-1.3-0.7-0.5-0.5-1-0.2-1.2 0.1-0.7 0.3-1-0.5-0.6 0.1-0.6-0.3-1.3-0.5-0.5-0.7-0.4-1.1 1.1-0.2 0.2-0.5 0.7 0.3 1.2-0.1 0-0.5 0.4-0.2 0.9-0.2 0-0.8-0.4-0.1-0.2-0.5 0.8 0 0.4-0.4 0.5 0 0-0.8 0.4-1-0.2-0.2-0.8 0.3-0.5-0.7 1.4-0.4 0.1-0.9-1.3-0.1 0.4-1.4 0-0.5 0.8 0.1 0.2-0.6-0.5-0.8 0.1-0.6-0.1-1.8 0.3-0.2-0.1-1.1 0.5-0.4-0.1-0.6 0.6-0.5-0.2-0.8-0.4-0.8 0-0.4-0.5-0.5 0.1-0.3-1.6-0.5-0.8-0.5-0.4-0.6 0.3-0.9 0.6 0 0-0.6-0.3-0.2 2-1.6-0.6-0.4 0.4-0.7 0.2-0.9-0.1-0.7 0.7 0 0.2 0.4 1-0.2 0-0.7 0.3-0.3-0.6-0.4 0-0.5 0.6-0.4 1.1 0.4 0-0.7 0.7 0.3 0.4 0 0-0.8 0.6-0.1 0.4-0.2 1 0.2 0.1-0.7-0.9-0.7-1 0-0.8-0.3-0.1-0.7-1 0.2-0.6-0.7-0.7 1-0.3-0.8-0.5 0.1-0.3-0.4-0.6-0.1 0-0.6 0.3-0.8-0.2-0.8 0.4-1.2 0.8-0.2 0.2-0.3 0.9-0.3 0.3 0.1 0.6-0.6-0.2-0.5-0.8-0.5-0.6-0.1 0.2-0.5 0.4-0.3 0-0.4 0.8-0.1 0.3-0.4 0.1-0.7 0.7-0.4-0.2-0.8 0.8 0.2 0.1-1.2 0.7-0.1 0.2-0.6-0.2-0.7-0.4 0-0.7-0.7-1.4-0.5-0.2-0.6 0.6-0.6 0.8-0.2 0.1-0.5-0.2-0.8 0.1-0.7-0.5-0.3-0.3-0.8 0.5-0.8-0.4-0.7 0.8-1-0.8-0.4-0.6 0 0.5-0.5-0.4-0.7-0.7-0.2-0.2-0.7 0.8-0.7 0.1-0.9-0.8-0.2 0.1-0.4 0.9 0.1 0.6-0.2-0.3-0.7 0.1-0.5 0.7 0.3 0-0.5-0.4-0.3 0.3-1.3 1.2-0.2 0.1 0.5 0.3 0.3 1.5-0.8 0.5 0.1 0.5-1.1-0.1-0.9-0.4-0.7 0.1-0.9 0.5-0.4 1-0.1 0.4-0.7 0-0.4 0.6-1.1 0.4-1.1 1.9-0.7 0.9 0.3 0.1-0.6-0.5-0.5-0.7-0.3-0.4-0.5-0.1-0.6-0.7 0-0.5-0.1 0.4-1.2-1.1 0.1 0.1-1-1.4 0 0-1.1-0.2-0.2 0.1-1 1 0.3-0.1-0.6 0.1-0.8 0.5-0.1 0.3 0.5 0.4 0 0.1-0.8-0.3-0.5 0.4-0.7 0.1-0.6-0.2-0.3 0.6-1.7 0.5-0.4 0.4 0.1 0-0.6-1.1-0.2 0-0.5 1.4-0.5 0.4-0.4 0.6-0.3 0.8 0.6 0.2 0.4 0.7 0.2 0.5 0.6 0.5 0.3 0 0.6 0.3 0.3 0.7-0.5 0.4 0.3 0.8 0 0.6 0.4 0.9-0.3 0-1.1 0.3-0.7 0.1-0.8-0.5-0.6 0.3-1.3 1-1.1 0.7 0.1 0.6-0.7 0.7 0.2 0.4-0.5-0.1-0.6-0.3-0.5-0.1-1.6 0.4-0.4 0-0.9-0.6-1.5-0.5-0.2 0.4-0.8 0.9 0 0.1-0.4 0.7-0.3 0-0.6 0.4-0.6 0.2-0.8-0.2-0.7-0.6-0.2 0-0.8-1.2-0.3 0.4-1.8 0.7 0.9 1.3 0.1 0.1 0.8 0.5 0.3 0.5-0.2 0.3-0.4 0.9 0.6 0.6-0.1 0.6-0.8 0.2-0.4-0.4-0.5 0.1-0.8-0.4-0.3 0.3-0.5 0.7-0.4 0.7 0.4 1.7 0 0.3-0.5 0.6-0.4 1.1-0.5 0.3 0.4 0.6-0.3 0.4-0.9 0.9 0.3 0.6-0.4 0.9 0.6 0.6-0.2 0.7 0.8 0.4 0 0.7-0.9 0.6 0.5 0.9-0.3 0.1-0.7-0.5-0.7 0-0.5 0.7-0.5 0.7 0 0.9-0.7 0.1-0.6 0.7-0.3 1.1-0.7 0.2 0.1 1 0.9 0.1 0.9-0.1 0.7 0.3 0.5-0.6-0.1-0.7 0.3-0.4 0.8-0.1 0.7-0.7 0.4-0.4 0.8-0.7 0.1 0.2 0.4-0.7 0.7-0.7 0.1 0.2 0.8 0.8 0.3 0.7-0.5-0.1-0.7 0.7-0.9 0.2-0.7-0.5-0.1-0.5 0.3-0.9-0.6-0.1-0.5-0.5-0.5 0.2-0.3 0.8-0.2 0-0.5-0.6-0.3-0.2-0.6 0.3-0.7-0.4-0.4 0.4-0.5 0.1-0.6-0.5-0.2-0.5-1 0.2-0.9 0.7 0-0.1-0.9 0.6-0.3 0.2-0.6 0.7-0.3 0.2-0.6-0.3-0.6 0.5-0.5 1.2-0.1-0.1-0.4 0.2-0.9 0.6-0.2 0.8-0.8 0.4-0.8 0.3-0.5 0.5-0.2 0.5 0.3 0.3 0.6 0.8 0.5 0.4 0.4 0.3 0.8 0.8 0.4 0.5 0.6 0.5 0.3 0.2 0.6 0.5 0.3 0.7-0.2 0.7-0.5 0.4 0.3 0.2 0.7 0.7-0.2 0.7 0.3 0.9 0.7 0.7-0.2 0.4 0.2 0.7 0.6 0.6-0.3 1.8 0.3 0.7 0.3 0.3-0.4 0.4 0.5-0.1 0.7 0.3 1.1-0.5 0.5-0.6-0.2-0.9-0.3-0.5 0.3-1.1 0.5 0.8 0.3 0.2 0.7-0.4 0.9-0.6 0.3-0.4-0.9-0.8 0.5 0 0.5-0.9-0.2-0.8-0.5-0.4 0.2-0.3 0.6-0.2 0.6-0.8 0.4-0.4-0.2-0.8-0.5-0.2-0.6 0.3-0.3 0-0.3-0.8-0.5-0.1 0.2-0.3 0.5 0.3 0.3-0.3 0.2-0.8-0.2-0.7 0.2-0.4 0.4-0.1 0.4 0.6 1.2 0.2 0.1 0.7 0.3 0.4 0.6-0.1 0.5 0.3 0.5-0.3 0.7 0.5-0.2 0.9 0.1 0.6-0.8 0.4-0.4 0.6 0.3 0.3 0.7 0.5 0.2 0.6-0.6 0.1-0.5 0.5 0.1 0.2 0.4 0.5 0 0.7-0.6 0.5-0.2 0.7 0.1 0.2 0.3 0.6 0.1 0.7-0.5 0.8-0.6 0.6-0.4 0.1-0.4 0.6-0.1 0.6 0.5 0.3 0.8 0.7-0.6 0.6 0 0.4 0.7-0.4 0.4-0.6 0.6-1.3 0.6 0 1 0.3-0.9 0.7-0.5 0.9-0.1 0.8-1.8 0.8-0.9 0.7 0.6 1.1 1.8 0.8 0.6 0.6 0.7-0.6 0.4 0.4-0.4 0.7-0.6 1.3 0.3 1 0 0.7 0.5 1.9 0.4 0.5 0.2 0.4 0.7 0.5 0.1 0.7 0.4 0.8 0.5 0.4 0.6 1.2 0.5 0.6 1 0.6 0.7 0 0.3-1.4 0.7 0.1 1.3-0.1 0.7-0.3 0.9-1 0.1 0.6 0.8 1 0.3 0.2-0.3 0.5-0.2 0.6-1 0.1-0.1 0.9-0.6 0.3-0.5-0.4-0.8 0-0.4-0.1-0.9 0.3-1.4 0.7 0.4-0.1 0.8-0.4 0.5-0.4 0-0.4-0.4-0.3 0.3-0.9 0.6 0.1 0.6-0.3 0.2-0.7 0.2-1 0.8 0.2 0.5 0.4 0 1.2-0.4 0.3 0.1 0.5 0.3 1.5 0.5 0.5 0.3 0.6-0.7 0.5 0 0.6-0.4-0.5-2.1-0.1-0.5 0.2-0.3 0.4-0.2 0.4 0.2 0.2 0.4 0.6 0.2 0.4 0.6 0.1 0.5-0.4 0.6-0.2 0.8 0.3 0.4 0.7-0.1 0.4 0.1 0.4-0.2 0.5 0.4 0.3 0.4-0.3 0.9-0.7 0.2-0.1 0.6-0.3 1.8-0.3 0.7 0 0.5 0.2 1.3-0.4 0.3 0.3 0.8 0.2-0.1 0.8-0.4 0.4-0.4 0.1-0.1 0.5-0.6 0.7-0.1 0.6-0.3 0.7-0.4 0.4-0.2 0.5 0.2 0.5 0.4-0.1 0.3 0.5 0.4 0.1 0.3 0.5 0.1 0.7 0.3 0.5-0.3 0.4-0.2 0.9-0.5 0.6-0.4 0.6-0.7 0.5 0 0.7-0.6 0.2-0.2 0.5-0.6 0.5 0.1 0.6-0.4 0.6-0.7-0.1-0.3 0.5-0.9 0.2-1.2 0.7-0.2-0.1-0.5 0.3-0.5 0.5 0.1 1.2 0.9 0.3 0.1 0.6-0.3 0.5-0.4 0.7 0.3-0.3 0.7 0.4 0.3 0.3-0.4 0.5 0.3 0.5 0.8 0.3 0.5-0.3 0.7 0.2 1 0.5 0.1 0.7 0.5 0.2 0.4-0.2 0.3 0.3 0.7 0.7-0.3 0.3 0.2 0.4-0.2 0.9-0.1 0.2 0.3 0.4-0.7 0.4 0.1 0.3-0.5 0.5 0.1 0.3 0.5 0.6 0.1 0.3-0.4 0.3 0.4 0.4-0.6 0.8 0.1 0.3-0.5 0.5 0.2 0.7-0.6 0.5-0.2 1.2 0.5 0.2-0.2 0.5 0.2 0.7-0.4 0.5 0.1 0.3-0.3 0.3 0 0.6-0.6 0.4-0.3 0.7-0.3 0.2 0.2 0.4-0.2 0.5 0.2 0.7-0.1 0.4-0.5 0.5 0.2 0.7 0.5 0.5 0.1 0.2 0.4 0.2 0.1 0.6-0.4 0.5 0.2 0.4 0.5 0.2 0.2-0.1 0.6 0.4 0.5 0.5 0.3 0.1 0.4-0.2 0.6 0.3 0.6 0.2 0.2 0.9 0.2-0.1 0.6 0.4 0.3-0.2 0.7 0.1 0.4-0.4 0.5-0.2 0.5 0.3 0.4-0.1 0.5 0.3 0.3 0.4 0 0.2 0.3-0.3 0.7 0.3 0.4-0.1 0.4 0.3 0.4 0.7 0.3 0.1 0.5-0.7 0.3-0.1 0.6-0.5 0.4 0.2 0.4-0.2 0.5-0.8 0.5-0.2 0.5 0.1 0.3 0.4 0.2 0.3 0.5 0.1 0.5-0.3 0.7-0.9 0.3 0.1 0.7-0.6 0.4 0.2 0.4-0.2 0.3 0.1 0.6 0.4 0.4 0.6 0.1-0.1 0.5-0.5 0.3-0.1 0.6 0.2 0.7-0.3 0.5 0.2 0.3-0.2 0.3 0.2 0.3 0.8-0.3 0.3 0.1 0.6 0.5 0.2-0.4 0.6 0.4 0.6-0.1 0.4 0.1 0.3-0.2 0.6 0.5 0.5 0.3 0 0.4 0.4 0.7-0.5 0.6-0.3 0.6 0.6 0.4 0.2 0.4 0.6 0.3-0.5 0.6-0.4 0.3 0.1 0.5-0.4 0.3-0.2 0.9 0.3 0.4-0.2 0.5-0.5 0.3 0.1 0.5-0.2 0.5-0.5 0.3 0.2 0.5-0.6 0.3-0.2 0.5 0.1 0.3 0.4 0.4-0.1 0.7-0.4 0.3 0.1 0.6-0.2 0.5 0.3 0.3-0.3 0.4-0.1 0.5 0.4 0.4-0.2 0.8 0.3 0.2-0.2 0.5-0.5 0.5-0.4 0.4 0.1 0.5 0.4 0.3-0.1 0.5-0.4 0.3 0.2 0.6-0.1 0.4-0.3 0.4 0.1 0.5-0.2 0.5-0.3 0.2-0.7 0.2-0.6 0.4-0.5 0.7-0.3 0.4-0.9 0-0.8 0.7-0.8 0-0.9 0.5-0.4 0-0.4 0.6-0.9 0.3-0.4 0.3-1.3 0-0.2 0.3-0.6 0.1-0.1 0.5 0.1 0.7-0.3 0.6-0.6 0.2-0.5 0.5-0.6 0.2-0.5-0.4-0.6-0.5-0.7-0.3-0.2 0.3-0.5 0-0.6 0.4-0.4 0.4-0.6-0.2-0.5 0.2-0.4-0.3-0.7 0.1-0.6-0.3-0.4 0.1-0.5-0.5-0.7-0.4-0.3 0.2-0.4-0.2-0.4-0.8-0.5-0.5 0-0.5-0.6-0.4 0-0.5-0.6-0.3-0.6-0.8-0.4 0-0.8 0.2-0.4-0.4-0.6-0.1-0.7-0.5-0.3-0.4 0.2-0.7 0-0.7-0.4-0.4-0.3-0.6-0.5-0.4-0.6-0.1-0.7-0.3-0.4-0.5-0.5 0.1-0.4-0.4-0.4-0.5 0.1-0.5-0.3-0.3-0.5 0.1-0.5-0.2-0.3-0.5-0.5-0.4 0.1-0.3-0.3-0.5-0.7-0.3-0.2-0.5 0.3-0.3-0.2-0.6 0.1-0.3-0.4-0.5-0.5-0.2-0.7 0.3-0.4-0.4-0.5-0.4 0.1-0.5-0.3-0.3-0.5-0.1-0.5-0.4-0.2-0.6 0.2-0.4-0.3-0.6-0.4-0.4-0.7 0.1-0.5-0.5-0.3-0.5 0.2-0.6-0.3-0.3-0.5-0.2-0.4-0.5-0.6 0-0.5-0.5-0.3-0.2-0.4 0-0.5-0.4-0.3-0.6-0.5-0.2-0.5-0.5-0.3-0.2-0.4-0.6-0.4-0.2-0.7-0.4-0.2-0.6 0.1-0.5-0.5-0.5-0.3-0.6-0.5-0.2-0.6-0.3-0.4-0.6-0.2-0.6-0.4-0.4-0.3-0.6-0.3-0.4 0-0.5-0.5-0.2-0.6-0.5-0.4-0.2-0.6-0.6-0.3-0.3-0.6-0.5-0.2-0.6-0.4-0.4-0.3-0.6-0.5-0.3-0.4-0.4-0.5-0.4-0.6 0-0.5-0.3-0.5-0.6-0.2-0.5-0.5-0.5-0.3-0.4-0.4-0.6-0.3-0.5-0.5-0.4-0.4-0.5-0.3-0.4-0.5-0.4-0.5-0.5-0.3-0.5-0.4z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1.5" />

                    {/* Gujarat, Rajasthan, Maharashtra region */}
                    <path d="M427.5 763.5l0.5 0.8-0.5 1.1-0.6-0.8 0.1-0.6 0.5-0.5z m57.7-87.2l0.7-0.2 0.9-0.2 0.4-0.5 0.3 0.5-0.1 0.6-0.5 0.9 0 1-0.6 0.2-0.4-0.9-0.8-0.3 0.3-0.5-0.2-0.6z m-130 22l2.1 0.4 0.5-0.1 0.9 0.8 1.3 0.2 0.8-0.3 2.3 0.6 1-0.3 0.6 0 0.3-0.5 0.5-0.1 1.2 0.6 1.2 0 0.8 0.4 0.4-1 0.6-0.1 0.3 0.8 0.4 0.8 1 0.4 0.7-0.2 0-0.4 1 0 0.5-1.1-0.1-0.3 0.7-0.5 0.7-0.2 0.4-0.4 0.1-0.9 0.3-0.7-0.2-0.9 0.5-0.3 0.6 0.2 0.7 0 0.6-0.7 0.8-0.2 1-0.6 1.3 0 1.2 0.3 1.7 0.4 1.2-1.1 0.9 0.1 0.9 1 0.5 0.5 0.8 0.4 0.6 0.1 1 0 0.9-0.7 0.8-1.1-0.1-1.9 0.7-0.2 0.2 0.4 0.2 1 0.8 0.4 0.6-0.7-0.5-1.3 0.1-0.7 1.4-0.8 0.9-0.3 0.7-0.4 0.7 0 0.7 0.2 1.5 0 1.4 0.6 0.9-0.4 0.5-0.6 0.1-1.4-0.1-1.1-0.4-0.7 0.2-2.2 0.5-0.5-0.4-1 0.2-0.8 0.8-0.7 0.2-0.5 1.4-0.4 0.8-0.1 2.2-0.1 0.4-0.3 0.2-0.4 1.3-0.6 1.1-0.1 1-0.3 0.7-0.6 1.3 0.1 0.2-0.4 0.8-0.5 1.1 0 0.7-0.8 0.7-0.3 0.2 0.2 0.8 0.9 1.4-0.2 0.3 0.3 0.5 1.1 0.3 0.3 0.6 0.2 0.5 0 0.8-0.8 0.5-0.9 0.7-0.6 0.9-0.9 0.1-0.8 0.5-1.2-0.8-0.3-0.2-0.8-0.6 0-0.6-0.3 0.5-1.3 0.8-0.8 0.2-0.8 1.1 0 0.1-0.7 0.5 0.2 0.7-0.1 0.3-0.5 0.6-0.6 0.5-0.6 0.3 0.1 0 0.7 0.6-0.1 0.7 0.5 0.5-0.2 1.1 1.5 0.3 1.3 0.2 1.2 0.4 0.4 0.7 0 0.4 1.3 0.7-0.6 0-0.5 0.5 0.2 0.1 0.4 0.9 0.4 0.1 0.7 0.9 0.4 2 0.4 0.9-0.7-0.3-0.6-0.8-0.5 0.2-0.3 0-1 0.6-0.1-0.1-0.8 0.1-0.7-0.4 0-1.1-0.7-0.3 0.4-0.8-0.3-0.4 0.7-0.9-0.6-1.2-0.4-1.1-0.4 0.3-0.7 0.5-0.5-0.6-1.2 0.8-0.6 0.1 0.6 0.6 0.9 0.7 0.2 0.2-0.6 0.5 0 0.3-0.5 0.1-0.8 0.3-0.5 1.4-0.7 0.3-0.4 1 0.6 0.9 0.2 0.7 0.8-0.5 0.3 0.3 0.5 1-0.4 1.1 0.1 0.6 0.3 2.1 0.5 0.3 0.3 0.7-0.7-0.1-0.5 0.2-0.8-0.2-0.4 0.3-0.4 0.1-0.6 0.5 0.1 0.7-0.1 0-0.7-0.2-0.9 0.7-0.1 0.6 0.5 0.8 0.2 1.2-0.2 0.4-0.5 0.6 0 0.6-0.2 1.6-0.6 0.5 0 0.5-0.6-0.3-0.4 0.1-1.1 0.5-0.6 0.7 0.2 1.4 0 0.6-0.5 0.9-1.5 0.5 0.1 0.2 0.5 1 0.4 0.8-0.2 0.2-0.3 0.5-0.3 1.5-1.9 0.2-2.6 0.6-0.9-0.6-0.5 0.3-0.6 0.6-0.6 0.5-1 0.5-0.6 0-0.9 0.3-0.4 0.7-0.3 0.4-0.6 1.4-0.1 0.7-0.5 0.1-0.5 0.7-0.5 0.7 0 0.3-0.3 0.5-0.1 0.3-0.3-0.4-0.8-0.6-0.7 0.8-0.5 0.4-0.7 0.9-0.4 0.3 0 1.5-0.5 0.4-0.3 0.6-0.2 1.8-1.1 0z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />

                    {/* Northeast states */}
                    <path d="M840.5 381.3l0-0.8-0.5-0.7 0-0.6 0.7-0.9-0.8-0.4-0.4-1.3-0.4-0.7 0.8-0.7 0.4 0 0.1-1.1-0.4-0.4-0.3-0.8 0.2-0.3-0.5-0.6 0.1-0.5-0.1-1.1 0.5 0.3 0.7-0.3 0.2 0.4 0.8-0.6 0-0.2 0.9-0.8 1.6-1 1.1-0.1 0.3-0.4 1.1-0.2 0.2-0.6 0.1-1.1-0.3-0.5 0.8-1.2 1.3-0.7 1.1 0.6 0.4 0.6 1.3-0.2 1.3-0.6 1.1-0.1 0.2-0.2 1.4-0.4 0.7 0 1.4-0.4 0.3 0.8 0.7 0.1 0.3-0.9 1.5-0.8 0.2-0.6 0.6-0.4 0.6-0.7-0.4-0.9-0.7-1-1.1-0.3-0.6 0.2-0.3 0.8-0.5-1-0.5 0.5-0.4 0 0.3-1 0.4-0.3 0.1-0.9 0.1-1.6-0.6 0-1.1-0.9 0.1-0.7-0.7-0.1-0.3-0.8 0.4-0.5-0.6-0.4 0-0.5 0.4-0.4-0.6-0.3-0.1-0.6-0.3-0.3 0.8-0.4-0.2-0.5 0.6-0.5 0.6-1.1 0.8-0.7 0.6-0.3 1.3-1.3 0.9-1.3-0.1-0.5 0.7-0.8z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />

                    {/* Northern states including Kashmir */}
                    <path d="M693.6 416.4l0.1 0.2 0 0.5 0.2 0.7-0.3 0.4-0.4 0 0.2-1.2 0.2-0.6z m61.3-41.4l0.3 0.1 2 0 1.7-0.7 0.6 0.3 0.7-0.2 0-0.5 1.4-0.3 1.3 0.3 0.3-0.6 0.4 0 0.5-0.5 1.6-0.2 1.4 0.3 0.8-0.1 1.7-0.8 0-0.7 0.3-0.9 1.5 0.4 1.6-0.2 1.8 0.6 1 0.2 1.2 0.7 0 0.6 2.2 1 0.6 0.5 1.4-0.3 0.6 0.3 0.5-0.4 2-0.3 1.1-0.3 1.2-0.2 2.2-0.3 2.7 0.3 0.6 0.5 0.6 0 1-0.3 1.6-0.1 1.1-0.4 1.4-0.2 1.2-1.5 1.3-0.7 1.2-0.8 0.7-0.3-0.3-0.6 0-0.7-0.6-0.4 0.1-0.5 0.5-0.6 0.4-0.1 0.7-0.8 1-1.3 1-1 0.5-0.7 1.2-1.2 1.6-0.9 0.7-1.2 2-2 0-0.3 1-0.6 1.8-0.8-0.1-1.1-0.8-0.5-0.1-0.8-0.3-0.1 0.6-0.9 0.8-0.1-0.3 0.7 0.9 0.7 0.7 0 1.5 0.4 0.6-0.3 0.4 0 0.5-0.4 0.9 0.9 1.3-0.2 0.7-0.5 1.3-0.4 0.5-0.5 1.3-0.2 0.2-0.4 1.4-0.8 0.6 0 0.6 0.2 1.4-1.1 0.7 0 0.8-0.4 0.3-0.9z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />

                    {/* Chandigarh */}
                    <path d="M336.5 254l-0.1 1 0.4 0.6-0.5 0.5 0 0.4-0.3 0-0.1 0.2-0.3 0.3-1.3-0.7-0.2 0.1-0.2-0.3-0.2-0.2 0.1-0.1-0.4-0.2 0-0.1-0.1-0.6-0.5-0.7 0-0.1 0.7-0.3 0.3-0.2 0.2-0.2 0.1-0.2 0-0.1 0.2-0.1 0.1-0.1 0.5 0.1 0.2 0.3-0.1 0.1 0.2 0.3 0.5-0.4 0.1 0.1 0.1 0.1-0.3 0.4 0.9 0.1z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />

                    {/* Delhi */}
                    <path d="M350.5 325l-0.3 0-0.3 0.5-0.4 0.1-0.7-0.2-0.6 0.4-0.6 0.3-0.2 0.3 0.5 0.5-0.1 0.6-0.7 0.4-0.5 0.1-0.8 0.2-0.4-0.7-0.6-0.3-0.5-0.3-0.2-1.1 0.1-0.3-0.5-0.4-0.5-0.4-0.4 0.2-0.2-0.1-0.2-0.1-0.6-0.4-0.1 0-0.5-0.3 0.3 0.5-0.1 0.4-0.8-0.3-0.9 0.3-0.3-0.1-0.7 0-0.4 0-0.4 0.2 0-0.4-0.5-0.6-0.6-0.5-0.1-0.8 0-0.2 0.6-0.1 0.6-1.4 0.4 0.2 0.5-0.2 0.2-0.5 0.1-0.5 0.6-0.2 0.1 0 0.1-0.6-0.3-0.7 0.3-0.9-0.4-0.4 0.3-0.4-0.1-0.7-0.2-0.3 0.3-0.4 0.3-0.4 0.6-0.2 0.1-0.1 0.6 0.1 0.7 0 0.2-0.5 0.3-0.6 0.9-0.1 0.5 0.1 0.2 0.2 0.6 0 0.1 0.4 0.5 0.1 0.3-0.4 0.6 0 0.1-0.1 0.1 0 0.3 0.1 0.4 0.8-0.1 0.7-0.5 0.4 0 0.2 0.3 0.2 0.2 0.1 0.3-0.1-0.1 0.3 0.2 0.2 0.5 0.5 0.2 0.1 0.1 0.4 0.2 0 0.2 0.1 0.3 0.6 0.3 0.3 0-0.1 0.6-0.2 0.1 0.2 0.2 0.6-0.3 0.6-0.1 0.9 0.7 0.7-0.3 0.5-0.5 0.2-0.4 0.5 0 0.1 0.2 0.9 0.4 0.3 0.4 0.5 0.2 0.3 0 0.2z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />

                    {/* Goa */}
                    <path d="M262.6 706l0.4 0.1 0.9-0.2 0-0.5 0.6 0.2 0.7 0.4 0.2-0.5 0.7 0.4 0.1 0.8 0.2 0.2 0 0.8-0.3 0.7 0.5 0.3 0.4 0.8-0.2 0.4-0.7 0.7 0.7 1.3-0.2 0.5 0.4 1.2 0.5 0.1 0.6 0.3-0.1 1.1 0.5 1-0.2 0.3-0.9-0.1-0.7 0.4-0.4 0.9 1.1 0.4 0.5 1.2-0.3 0.7-0.6 0.5 0.1 0.6-0.3 0.6 0.2 0.9 0.4 0.8-0.4 0.3z" 
                      fill="url(#india-gradient)" stroke="#64748b" strokeWidth="1" />
                  </g>

                  {/* City dots (background) */}
                  {Object.entries(cityCoordinates).map(([city, coords]) => {
                    if (city === source || city === destination) return null
                    return (
                      <circle
                        key={city}
                        cx={coords.x}
                        cy={coords.y}
                        r={6}
                        fill="hsl(var(--muted-foreground))"
                        opacity={0.25}
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
                              strokeWidth={hoveredSegment?.id === segment.id ? 14 : 10}
                              strokeLinecap="round"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.6, delay: idx * 0.15 }}
                              onMouseEnter={() => setHoveredSegment(segment)}
                              onMouseLeave={() => setHoveredSegment(null)}
                              className="cursor-pointer"
                              style={{ 
                                filter: hoveredSegment?.id === segment.id ? `drop-shadow(0 0 8px ${getRiskColor(segment.risk)})` : "none",
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
                          r={18}
                          fill="#3b82f6"
                          stroke="#1e40af"
                          strokeWidth={3}
                        />
                        <circle
                          cx={sourceCoords.x}
                          cy={sourceCoords.y}
                          r={28}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          opacity={0.4}
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
                          r={18}
                          fill="#06b6d4"
                          stroke="#0e7490"
                          strokeWidth={3}
                        />
                        <circle
                          cx={destCoords.x}
                          cy={destCoords.y}
                          r={28}
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          opacity={0.4}
                        />
                      </motion.g>

                      {/* Origin label */}
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <rect
                          x={sourceCoords.x - 50}
                          y={sourceCoords.y - 50}
                          width={100}
                          height={24}
                          rx={12}
                          fill="rgba(59, 130, 246, 0.9)"
                        />
                        <text
                          x={sourceCoords.x}
                          y={sourceCoords.y - 34}
                          textAnchor="middle"
                          fill="white"
                          fontSize="14"
                          fontWeight="600"
                        >
                          {source}
                        </text>
                      </motion.g>

                      {/* Destination label */}
                      <motion.g
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <rect
                          x={destCoords.x - 50}
                          y={destCoords.y + 30}
                          width={100}
                          height={24}
                          rx={12}
                          fill="rgba(6, 182, 212, 0.9)"
                        />
                        <text
                          x={destCoords.x}
                          y={destCoords.y + 46}
                          textAnchor="middle"
                          fill="white"
                          fontSize="14"
                          fontWeight="600"
                        >
                          {destination}
                        </text>
                      </motion.g>
                    </g>
                  )}
                </svg>

                {/* Empty state - shown ON TOP of map */}
                {!hasRoute && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-background/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-border/50 shadow-lg">
                      <MapPin className="h-10 w-10 text-primary/50 mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Enter a route to visualize on India map
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select source and destination cities above
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
                  top: Math.min(mousePos.y - 10, 380),
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
