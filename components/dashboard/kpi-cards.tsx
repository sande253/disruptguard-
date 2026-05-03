"use client"

import { motion } from "framer-motion"
import { Truck, AlertTriangle, Clock, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const kpiData = [
  {
    title: "Active Shipments",
    value: "1,284",
    trend: "+12.5%",
    trendUp: true,
    icon: Truck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "High Risk Routes",
    value: "23",
    trend: "+3.2%",
    trendUp: false,
    icon: AlertTriangle,
    iconColor: "text-risk-high",
    iconBg: "bg-risk-high/10",
  },
  {
    title: "Avg Delay Prediction",
    value: "4.2 hrs",
    trend: "-8.1%",
    trendUp: true,
    icon: Clock,
    iconColor: "text-risk-moderate",
    iconBg: "bg-risk-moderate/10",
  },
  {
    title: "Disruption Alerts (24h)",
    value: "47",
    trend: "+15.3%",
    trendUp: false,
    icon: Bell,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      kpi.trendUp ? "text-risk-low" : "text-risk-high"
                    )}
                  >
                    {kpi.trend} from last week
                  </p>
                </div>
                <div className={cn("rounded-xl p-3", kpi.iconBg)}>
                  <kpi.icon className={cn("h-6 w-6", kpi.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
