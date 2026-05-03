"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RouteHeaderProps {
  origin: string
  destination: string
  riskLevel: "low" | "moderate" | "high"
  lastUpdated: string
}

export function RouteHeader({ origin, destination, riskLevel, lastUpdated }: RouteHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {origin}
              <span className="text-muted-foreground mx-1">→</span>
              {destination}
            </h1>
            <Badge
              className={cn(
                "text-xs font-medium",
                riskLevel === "low" && "bg-risk-low/20 text-risk-low border-risk-low/30",
                riskLevel === "moderate" && "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
                riskLevel === "high" && "bg-risk-high/20 text-risk-high border-risk-high/30"
              )}
            >
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Last updated {lastUpdated}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
