"use client"

import { motion } from "framer-motion"
import { Cloud, Car, Ship, AlertTriangle, ArrowRight, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRoute } from "@/contexts/route-context"

interface Alert {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  source: "Weather" | "Traffic" | "News" | "Port"
  timestamp: string
  affectsRoute: boolean
  impact?: string
}

const alerts: Alert[] = [
  {
    id: "1",
    title: "Cyclone forming near Bay of Bengal",
    severity: "critical",
    source: "Weather",
    timestamp: "2 min ago",
    affectsRoute: true,
    impact: "May cause 6-8 hr delay",
  },
  {
    id: "2",
    title: "Major accident on NH-44",
    severity: "critical",
    source: "Traffic",
    timestamp: "15 min ago",
    affectsRoute: true,
    impact: "Currently blocking 2 lanes",
  },
  {
    id: "3",
    title: "Port congestion at Chennai",
    severity: "warning",
    source: "Port",
    timestamp: "1 hr ago",
    affectsRoute: true,
    impact: "2-3 hr wait expected",
  },
  {
    id: "4",
    title: "Heavy rainfall advisory - Mumbai",
    severity: "warning",
    source: "Weather",
    timestamp: "2 hrs ago",
    affectsRoute: false,
  },
  {
    id: "5",
    title: "New toll plaza operational - NH-48",
    severity: "info",
    source: "News",
    timestamp: "4 hrs ago",
    affectsRoute: false,
  },
]

const sourceIcons = {
  Weather: Cloud,
  Traffic: Car,
  News: AlertTriangle,
  Port: Ship,
}

const severityDot = {
  critical: "bg-risk-high",
  warning: "bg-risk-moderate",
  info: "bg-primary",
}

export function AlertsCompact() {
  const { route } = useRoute()
  
  // Group alerts by impact
  const routeAlerts = alerts.filter(a => a.affectsRoute)
  const generalAlerts = alerts.filter(a => !a.affectsRoute)
  const topAlerts = [...routeAlerts, ...generalAlerts].slice(0, 5)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-risk-high" />
            Risk Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-risk-high/10 border-risk-high/30 text-risk-high">
              {routeAlerts.length} on route
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
              {alerts.length} total
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ScrollArea className="h-[200px]">
          <div className="space-y-1 px-2">
            {topAlerts.map((alert, index) => {
              const SourceIcon = sourceIcons[alert.source]
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-colors",
                    alert.affectsRoute 
                      ? "bg-risk-high/5 hover:bg-risk-high/10 border border-risk-high/20" 
                      : "hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", severityDot[alert.severity])} />
                    <SourceIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-xs text-foreground truncate flex-1">{alert.title}</p>
                    {alert.affectsRoute && (
                      <Badge className="h-4 px-1 text-[8px] bg-risk-high/20 text-risk-high border-0 shrink-0">
                        <MapPin className="h-2 w-2 mr-0.5" />
                        Your Route
                      </Badge>
                    )}
                  </div>
                  {alert.affectsRoute && alert.impact && (
                    <p className="text-[10px] text-risk-high/80 mt-1 ml-5 pl-0.5">
                      Impact: {alert.impact}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1 ml-5 pl-0.5">
                    <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
        <div className="px-2 pt-2 border-t border-border mt-2">
          <Link href="/alerts">
            <Button variant="ghost" size="sm" className="w-full h-7 text-xs text-muted-foreground hover:text-foreground">
              View All Alerts
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
