"use client"

import { motion } from "framer-motion"
import { Cloud, Car, Ship, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Alert {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  source: "Weather" | "Traffic" | "News" | "Port"
  timestamp: string
}

const alerts: Alert[] = [
  {
    id: "1",
    title: "Cyclone forming near Bay of Bengal",
    severity: "critical",
    source: "Weather",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    title: "Major accident on NH-44",
    severity: "critical",
    source: "Traffic",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    title: "Port congestion at Chennai",
    severity: "warning",
    source: "Port",
    timestamp: "1 hr ago",
  },
  {
    id: "4",
    title: "Heavy rainfall advisory",
    severity: "warning",
    source: "Weather",
    timestamp: "2 hrs ago",
  },
  {
    id: "5",
    title: "New toll plaza operational",
    severity: "info",
    source: "News",
    timestamp: "4 hrs ago",
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
  const topAlerts = alerts.slice(0, 5)

  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-risk-high" />
            Risk Alerts
          </CardTitle>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border text-muted-foreground">
            {alerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2">
        <ScrollArea className="h-[180px]">
          <div className="space-y-1 px-2">
            {topAlerts.map((alert, index) => {
              const SourceIcon = sourceIcons[alert.source]
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", severityDot[alert.severity])} />
                  <SourceIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-foreground truncate flex-1">{alert.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{alert.timestamp}</span>
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
