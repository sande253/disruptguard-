"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, Car, Ship, AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  source: "Weather" | "Traffic" | "News" | "Port"
  timestamp: string
  details?: string
}

const alerts: Alert[] = [
  {
    id: "1",
    title: "Cyclone forming near Bay of Bengal",
    description: "Category 2 cyclone expected to make landfall in 48 hours",
    severity: "critical",
    source: "Weather",
    timestamp: "2 min ago",
    details: "The India Meteorological Department has issued a red alert for coastal Tamil Nadu. Expected wind speeds of 120-150 km/h. All port operations at Chennai may be suspended for 72 hours starting May 5th.",
  },
  {
    id: "2",
    title: "Major accident on NH-44",
    description: "Multi-vehicle collision blocking 2 lanes near Kurnool",
    severity: "critical",
    source: "Traffic",
    timestamp: "15 min ago",
    details: "Emergency services on scene. Expected clearance time: 4-6 hours. Alternative route via NH-65 adds approximately 45 minutes to journey time.",
  },
  {
    id: "3",
    title: "Port congestion at Chennai",
    description: "Container backlog causing 8-12 hour delays",
    severity: "warning",
    source: "Port",
    timestamp: "1 hr ago",
    details: "Due to increased import volume and labor shortages, vessel berthing delays are expected. Ships arriving before May 8th may experience extended wait times.",
  },
  {
    id: "4",
    title: "Heavy rainfall advisory",
    description: "100-150mm expected along NH-65 corridor",
    severity: "warning",
    source: "Weather",
    timestamp: "2 hrs ago",
    details: "Southwest monsoon activity intensifying. Road conditions may deteriorate. Recommend postponing non-urgent shipments by 24 hours.",
  },
  {
    id: "5",
    title: "New toll plaza operational",
    description: "FASTag mandatory at Chittoor checkpoint",
    severity: "info",
    source: "News",
    timestamp: "4 hrs ago",
    details: "Starting May 6th, the new electronic toll plaza at Chittoor will be fully operational. Vehicles without FASTag will face 2x charges and potential delays.",
  },
]

const sourceIcons = {
  Weather: Cloud,
  Traffic: Car,
  News: AlertTriangle,
  Port: Ship,
}

const severityStyles = {
  critical: "bg-risk-high/20 text-risk-high border-risk-high/30",
  warning: "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
  info: "bg-primary/20 text-primary border-primary/30",
}

export function AlertsFeed() {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  const toggleExpand = (id: string) => {
    setExpandedAlert(expandedAlert === id ? null : id)
  }

  const dismissAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissedAlerts([...dismissedAlerts, id])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Risk Alerts
            </CardTitle>
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              {visibleAlerts.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <ScrollArea className="h-[400px] pr-3">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {visibleAlerts.map((alert) => {
                  const SourceIcon = sourceIcons[alert.source]
                  const isExpanded = expandedAlert === alert.id

                  return (
                    <motion.div
                      key={alert.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={cn(
                          "rounded-xl border bg-secondary/50 p-3 cursor-pointer transition-all hover:bg-secondary",
                          isExpanded && "ring-1 ring-primary/50"
                        )}
                        onClick={() => toggleExpand(alert.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={cn(
                              "rounded-lg p-2 shrink-0",
                              alert.severity === "critical" && "bg-risk-high/20",
                              alert.severity === "warning" && "bg-risk-moderate/20",
                              alert.severity === "info" && "bg-primary/20"
                            )}>
                              <SourceIcon className={cn(
                                "h-4 w-4",
                                alert.severity === "critical" && "text-risk-high",
                                alert.severity === "warning" && "text-risk-moderate",
                                alert.severity === "info" && "text-primary"
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {alert.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge
                                  className={cn("text-[10px] px-1.5 py-0", severityStyles[alert.severity])}
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
                                  {alert.source}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {alert.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              onClick={(e) => dismissAlert(alert.id, e)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && alert.details && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border leading-relaxed">
                                {alert.details}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
