"use client"

import { useState, useMemo } from "react"
import { Brain, TrendingUp, AlertTriangle, DollarSign, Zap, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface RouteMetrics {
  distance: number // km
  duration: number // hours
  cost: number // estimated cost in rupees
  risk: number // 0-100
  delays: number // estimated minutes
  weather: "clear" | "warning" | "critical"
}

interface Recommendation {
  title: string
  description: string
  impact: "positive" | "warning" | "critical"
  savings?: number // rupees
  timeGained?: number // minutes
  riskReduced?: number // percentage
  priority: "high" | "medium" | "low"
  action: string
}

interface AIRecommendationsProps {
  distance?: number
  duration?: number
  weather?: "clear" | "warning" | "critical"
  trafficLevel?: "low" | "moderate" | "high" | "critical"
  dayOfWeek?: number
  time?: "morning" | "afternoon" | "evening" | "night"
}

export function AIRecommendations({
  distance = 1000,
  duration = 18,
  weather = "clear",
  trafficLevel = "moderate",
  dayOfWeek = new Date().getDay(),
  time = "afternoon",
}: AIRecommendationsProps) {
  const [selectedRec, setSelectedRec] = useState<string | null>(null)

  // Calculate route metrics
  const metrics = useMemo<RouteMetrics>(() => {
    let cost = distance * 8 // ₹8 per km base cost
    let risk = 30
    let delays = 0

    // Adjust for time of day
    const timeMultipliers = { morning: 1, afternoon: 1.1, evening: 1.2, night: 1.3 }
    cost *= timeMultipliers[time]

    // Adjust for day of week (weekends have more traffic)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      cost *= 1.15
      delays += 45
      risk += 15
    }

    // Adjust for traffic level
    const trafficMultipliers = { low: 1, moderate: 1.2, high: 1.4, critical: 1.7 }
    cost *= trafficMultipliers[trafficLevel]
    delays += { low: 0, moderate: 30, high: 90, critical: 180 }[trafficLevel]
    risk += { low: 10, moderate: 25, high: 50, critical: 75 }[trafficLevel]

    // Adjust for weather
    if (weather === "warning") {
      cost *= 1.1
      delays += 60
      risk += 20
    } else if (weather === "critical") {
      cost *= 1.25
      delays += 120
      risk += 40
    }

    return {
      distance,
      duration,
      cost: Math.round(cost),
      risk: Math.min(100, risk),
      delays: Math.round(delays),
      weather,
    }
  }, [distance, duration, weather, trafficLevel, dayOfWeek, time])

  // Generate recommendations
  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = []

    // Weather recommendation
    if (weather === "critical") {
      recs.push({
        title: "Severe Weather Alert",
        description: "Heavy rainfall or storms detected on route. Consider postponing or taking alternative route.",
        impact: "critical",
        riskReduced: 40,
        priority: "high",
        action: "View Alternative Routes",
      })
    } else if (weather === "warning") {
      recs.push({
        title: "Weather Advisory",
        description: "Light rain expected. Reduce speed and increase following distance.",
        impact: "warning",
        riskReduced: 15,
        priority: "medium",
        action: "Get Weather Details",
      })
    }

    // Traffic recommendation
    if (trafficLevel === "critical") {
      recs.push({
        title: "Heavy Traffic Detected",
        description: "Heavy congestion on primary route. AI suggests leaving earlier or using alternative route to save 2-3 hours.",
        impact: "critical",
        timeGained: 180,
        priority: "high",
        action: "Use Alternative Route",
      })
    } else if (trafficLevel === "high") {
      recs.push({
        title: "Moderate Congestion",
        description: "Current traffic conditions suggest a 1-2 hour delay. Consider adjusting departure time.",
        impact: "warning",
        timeGained: 60,
        priority: "medium",
        action: "Reschedule Departure",
      })
    }

    // Time of day recommendation
    if (time === "evening" || time === "night") {
      recs.push({
        title: "Late Evening Travel",
        description: "Traveling during peak evening hours increases accident risk by 30%. Morning departure recommended.",
        impact: "warning",
        riskReduced: 30,
        priority: "medium",
        action: "Plan Morning Departure",
      })
    } else if (time === "night") {
      recs.push({
        title: "Night Driving Risk",
        description: "Night routes have 3x higher accident rates. Strong recommendation to travel during daytime.",
        impact: "critical",
        riskReduced: 60,
        priority: "high",
        action: "Change Travel Time",
      })
    }

    // Cost optimization
    if (trafficLevel !== "low") {
      const savings = Math.round((metrics.cost * 0.15) / Math.max(1, metrics.delays / 60))
      recs.push({
        title: "Cost Savings Opportunity",
        description: `Departing 2 hours earlier could save ₹${savings} in fuel and reduce delays by ${metrics.delays} minutes.`,
        impact: "positive",
        savings,
        timeGained: metrics.delays,
        priority: "low",
        action: "Adjust Departure",
      })
    }

    // Day of week recommendation
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      recs.push({
        title: "Weekend Peak Hours",
        description: "Traveling on weekends? Weekday routes typically have 20% less congestion and lower costs.",
        impact: "warning",
        savings: Math.round(metrics.cost * 0.2),
        priority: "low",
        action: "Consider Weekday",
      })
    }

    // Fuel recommendation
    if (distance > 500) {
      recs.push({
        title: "Multi-Stop Recommended",
        description: `At ${distance} km, plan 3-4 fuel stops for optimal driver safety and vehicle maintenance.`,
        impact: "positive",
        priority: "medium",
        action: "View Fuel Stops",
      })
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [metrics, weather, trafficLevel, dayOfWeek, time, distance])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-500/10 border-red-500/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "positive":
        return "bg-green-500/10 border-green-500/30"
      default:
        return "bg-blue-500/10 border-blue-500/30"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      default:
        return <Brain className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Route Metrics Summary */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-foreground">AI Route Intelligence</h3>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Distance</p>
              <p className="font-bold text-foreground">{metrics.distance} km</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="font-bold text-foreground">{metrics.duration}h</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
              <p className="font-bold text-foreground">₹{metrics.cost}</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">{metrics.risk}</p>
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      metrics.risk > 70 ? "bg-red-500" : metrics.risk > 40 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${metrics.risk}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Est. Delays</p>
              <p className="font-bold text-foreground">{metrics.delays}m</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Weather</p>
              <Badge
                className={`${
                  metrics.weather === "critical"
                    ? "bg-red-500/20 text-red-400"
                    : metrics.weather === "warning"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/20 text-green-400"
                }`}
              >
                {metrics.weather}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-4 space-y-4">
          <h4 className="font-semibold text-foreground">Smart Recommendations</h4>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recommendations.map((rec, idx) => {
              const isSelected = selectedRec === rec.title

              return (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedRec(isSelected ? null : rec.title)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${getImpactColor(
                    rec.impact
                  )} ${isSelected ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {getImpactIcon(rec.impact)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-current/20 space-y-2"
                        >
                          {rec.savings && (
                            <div className="flex items-center gap-2 text-xs">
                              <DollarSign className="h-3 w-3 text-green-400" />
                              <span>Save ₹{rec.savings}</span>
                            </div>
                          )}
                          {rec.timeGained && (
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-3 w-3 text-blue-400" />
                              <span>Gain {rec.timeGained} minutes</span>
                            </div>
                          )}
                          {rec.riskReduced && (
                            <div className="flex items-center gap-2 text-xs">
                              <Zap className="h-3 w-3 text-yellow-400" />
                              <span>Reduce risk by {rec.riskReduced}%</span>
                            </div>
                          )}
                          <Button size="sm" className="w-full mt-2 h-7 text-xs">
                            {rec.action}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
