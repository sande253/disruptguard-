"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Link2, AlertTriangle, TrendingUp, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  tier: 1 | 2 | 3
  location: string
  region: string
  riskScore: number
  status: "active" | "at-risk" | "critical"
}

interface SupplierDetailPanelProps {
  supplier: Supplier | null
  isOpen: boolean
  onClose: () => void
}

const supplierDetails: Record<string, {
  fullAddress: string
  dependencies: string[]
  recentDisruptions: { date: string; event: string; impact: string }[]
  riskDrivers: { driver: string; contribution: number }[]
}> = {
  "1": {
    fullAddress: "Jamshedpur Industrial Zone, Jharkhand 831001",
    dependencies: ["Iron Ore from Odisha Mines", "Coal from Dhanbad", "Logistics via Indian Railways"],
    recentDisruptions: [
      { date: "Apr 28, 2026", event: "Railway strike delay", impact: "2-day shipment delay" },
      { date: "Mar 15, 2026", event: "Power outage", impact: "Production halt for 8 hours" },
    ],
    riskDrivers: [
      { driver: "Infrastructure reliability", contribution: 35 },
      { driver: "Labor relations", contribution: 28 },
      { driver: "Weather exposure", contribution: 22 },
      { driver: "Financial stability", contribution: 15 },
    ],
  },
  "2": {
    fullAddress: "Pune Auto Hub, Chakan MIDC, Maharashtra 410501",
    dependencies: ["Steel from Tata Steel", "Electronics from Hyderabad", "Rubber from Kerala"],
    recentDisruptions: [
      { date: "Apr 20, 2026", event: "Supplier delay (Tier 2)", impact: "Production slowdown" },
      { date: "Feb 10, 2026", event: "Monsoon flooding", impact: "Warehouse damage" },
    ],
    riskDrivers: [
      { driver: "Supplier concentration", contribution: 40 },
      { driver: "Monsoon vulnerability", contribution: 30 },
      { driver: "Demand volatility", contribution: 20 },
      { driver: "Quality issues", contribution: 10 },
    ],
  },
  "3": {
    fullAddress: "Ambattur Industrial Estate, Chennai, Tamil Nadu 600058",
    dependencies: ["Polymers from Reliance", "Dyes from Gujarat", "Packaging from Local"],
    recentDisruptions: [
      { date: "May 1, 2026", event: "Cyclone warning", impact: "Preemptive shutdown" },
      { date: "Apr 5, 2026", event: "Raw material shortage", impact: "50% capacity reduction" },
      { date: "Jan 20, 2026", event: "Port congestion", impact: "Export delays" },
    ],
    riskDrivers: [
      { driver: "Cyclone exposure", contribution: 45 },
      { driver: "Port dependency", contribution: 25 },
      { driver: "Single source materials", contribution: 20 },
      { driver: "Regulatory compliance", contribution: 10 },
    ],
  },
  "4": {
    fullAddress: "Surat Polymer Park, Gujarat 395010",
    dependencies: ["Crude derivatives from Jamnagar", "Catalysts from imports", "Power from GSEB"],
    recentDisruptions: [],
    riskDrivers: [
      { driver: "Oil price volatility", contribution: 50 },
      { driver: "Import dependency", contribution: 30 },
      { driver: "Environmental regulations", contribution: 20 },
    ],
  },
  "5": {
    fullAddress: "Hi-Tech City, Hyderabad, Telangana 500081",
    dependencies: ["Semiconductors from Taiwan", "PCBs from Bangalore", "Testing equipment from Japan"],
    recentDisruptions: [
      { date: "Apr 15, 2026", event: "Chip shortage", impact: "Order backlog increase" },
      { date: "Mar 1, 2026", event: "Quality recall", impact: "Batch replacement" },
    ],
    riskDrivers: [
      { driver: "Semiconductor supply", contribution: 45 },
      { driver: "Geopolitical risk", contribution: 25 },
      { driver: "Technology obsolescence", contribution: 18 },
      { driver: "Skilled labor shortage", contribution: 12 },
    ],
  },
  "6": {
    fullAddress: "Peenya Industrial Area, Bangalore, Karnataka 560058",
    dependencies: ["Cotton from Maharashtra", "Dyes from Ahmedabad", "Machinery from Germany"],
    recentDisruptions: [
      { date: "Feb 28, 2026", event: "Cotton price spike", impact: "Margin pressure" },
    ],
    riskDrivers: [
      { driver: "Commodity prices", contribution: 40 },
      { driver: "Labor availability", contribution: 30 },
      { driver: "Water scarcity", contribution: 20 },
      { driver: "Competition", contribution: 10 },
    ],
  },
}

const statusStyles = {
  active: "bg-risk-low/20 text-risk-low border-risk-low/30",
  "at-risk": "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
  critical: "bg-risk-high/20 text-risk-high border-risk-high/30",
}

const tierColors = {
  1: "bg-primary/20 text-primary border-primary/30",
  2: "bg-muted text-muted-foreground border-border",
  3: "bg-secondary text-secondary-foreground border-border",
}

function getRiskColor(score: number) {
  if (score <= 30) return "text-risk-low"
  if (score <= 60) return "text-risk-moderate"
  return "text-risk-high"
}

function getRiskBg(score: number) {
  if (score <= 30) return "bg-risk-low"
  if (score <= 60) return "bg-risk-moderate"
  return "bg-risk-high"
}

export function SupplierDetailPanel({ supplier, isOpen, onClose }: SupplierDetailPanelProps) {
  const details = supplier ? supplierDetails[supplier.id] : null

  return (
    <AnimatePresence>
      {isOpen && supplier && details && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-card shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{supplier.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", tierColors[supplier.tier])}>
                    Tier {supplier.tier}
                  </Badge>
                  <Badge className={cn("text-xs capitalize", statusStyles[supplier.status])}>
                    {supplier.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 p-6">
              {/* Location */}
              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{details.fullAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Score */}
              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Risk Score</p>
                    <span className={cn("text-2xl font-bold", getRiskColor(supplier.riskScore))}>
                      {supplier.riskScore}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", getRiskBg(supplier.riskScore))}
                      style={{ width: `${supplier.riskScore}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">Dependencies</h3>
                </div>
                <div className="space-y-2">
                  {details.dependencies.map((dep, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{dep}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Disruptions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">Recent Disruptions</h3>
                </div>
                {details.recentDisruptions.length > 0 ? (
                  <div className="space-y-2">
                    {details.recentDisruptions.map((disruption, index) => (
                      <Card key={index} className="border-border bg-secondary/30">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{disruption.event}</p>
                              <p className="text-xs text-muted-foreground">{disruption.impact}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {disruption.date}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No recent disruptions</p>
                )}
              </div>

              {/* Risk Drivers */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-foreground">Risk Drivers</h3>
                </div>
                <div className="space-y-3">
                  {details.riskDrivers.map((driver, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{driver.driver}</span>
                        <span className="text-sm font-medium text-foreground">{driver.contribution}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${driver.contribution}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
