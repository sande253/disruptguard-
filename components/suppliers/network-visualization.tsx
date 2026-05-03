"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  tier: 1 | 2 | 3
  riskScore: number
  status: "active" | "at-risk" | "critical"
}

interface NetworkVisualizationProps {
  suppliers: Supplier[]
  onSelectSupplier: (supplier: Supplier) => void
}

// Node positions (relative percentages)
const nodePositions: Record<string, { x: number; y: number }> = {
  "1": { x: 20, y: 30 },
  "2": { x: 50, y: 20 },
  "3": { x: 80, y: 35 },
  "4": { x: 15, y: 70 },
  "5": { x: 50, y: 60 },
  "6": { x: 85, y: 75 },
}

// Connections between suppliers
const connections = [
  { from: "1", to: "2" },
  { from: "1", to: "5" },
  { from: "2", to: "3" },
  { from: "2", to: "5" },
  { from: "3", to: "5" },
  { from: "4", to: "5" },
  { from: "4", to: "1" },
  { from: "5", to: "6" },
  { from: "6", to: "3" },
]

function getRiskColor(score: number) {
  if (score <= 30) return "#4ade80" // green
  if (score <= 60) return "#fbbf24" // amber
  return "#ef4444" // red
}

function getNodeSize(tier: 1 | 2 | 3) {
  if (tier === 1) return 48
  if (tier === 2) return 40
  return 32
}

export function NetworkVisualization({ suppliers, onSelectSupplier }: NetworkVisualizationProps) {
  const supplierMap = new Map(suppliers.map(s => [s.id, s]))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Supplier Network
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-risk-low" />
                <span>Low Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-risk-moderate" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-risk-high" />
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px] w-full rounded-xl bg-secondary/30 overflow-hidden">
            {/* Grid pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full">
              {connections.map((conn, index) => {
                const fromPos = nodePositions[conn.from]
                const toPos = nodePositions[conn.to]
                const fromSupplier = supplierMap.get(conn.from)
                const toSupplier = supplierMap.get(conn.to)

                if (!fromPos || !toPos || !fromSupplier || !toSupplier) return null

                // Calculate line opacity based on risk
                const avgRisk = (fromSupplier.riskScore + toSupplier.riskScore) / 2
                const strokeColor = avgRisk > 60 ? "rgba(239, 68, 68, 0.4)" : avgRisk > 30 ? "rgba(251, 191, 36, 0.3)" : "rgba(74, 222, 128, 0.25)"

                return (
                  <motion.line
                    key={`${conn.from}-${conn.to}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${toPos.x}%`}
                    y2={`${toPos.y}%`}
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            {suppliers.map((supplier, index) => {
              const pos = nodePositions[supplier.id]
              if (!pos) return null

              const size = getNodeSize(supplier.tier)
              const color = getRiskColor(supplier.riskScore)

              return (
                <motion.div
                  key={supplier.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.08 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => onSelectSupplier(supplier)}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{
                      backgroundColor: color,
                      width: size,
                      height: size,
                    }}
                  />

                  {/* Node circle */}
                  <div
                    className="relative flex items-center justify-center rounded-full border-2 border-border bg-card text-foreground font-semibold text-xs shadow-lg group-hover:scale-110 transition-transform"
                    style={{
                      width: size,
                      height: size,
                      borderColor: color,
                    }}
                  >
                    T{supplier.tier}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                      <p className="text-sm font-medium text-foreground">{supplier.name}</p>
                      <p className="text-xs text-muted-foreground">Risk: {supplier.riskScore}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Placeholder text */}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="text-xs">
                Interactive Network View
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
