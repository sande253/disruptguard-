"use client"

import { useEffect, useState, useCallback } from "react"
import { Cloud, AlertTriangle, Newspaper, RefreshCw, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getWeatherAlerts, type WeatherAlert as WeatherAlertType } from "@/lib/services/weather"
import { getRouteNews, type NewsAlert } from "@/lib/services/news"
import { motion, AnimatePresence } from "framer-motion"

interface RouteAlertsProps {
  latitude?: number
  longitude?: number
  location?: string
}

type Alert = (WeatherAlertType & { type: "weather" }) | (NewsAlert & { type: "news" })

export function RouteAlerts({ latitude = 20.5937, longitude = 78.9629, location = "India" }: RouteAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const [weatherData, newsAlerts] = await Promise.all([
        getWeatherAlerts(latitude, longitude),
        getRouteNews(location),
      ])

      const combinedAlerts: Alert[] = []

      // Add weather alerts
      if (weatherData?.alerts && weatherData.alerts.length > 0) {
        weatherData.alerts.forEach((alert) => {
          combinedAlerts.push({
            ...alert,
            type: "weather",
          })
        })
      }

      // Add news alerts
      if (newsAlerts.length > 0) {
        newsAlerts.forEach((alert) => {
          combinedAlerts.push({
            ...alert,
            type: "news",
          })
        })
      }

      // Sort by severity
      const severityOrder = { critical: 0, warning: 1, high: 2, info: 3, moderate: 4, low: 5 }
      combinedAlerts.sort(
        (a, b) =>
          (severityOrder[a.severity as keyof typeof severityOrder] || 999) -
          (severityOrder[b.severity as keyof typeof severityOrder] || 999)
      )

      setAlerts(combinedAlerts)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setLoading(false)
    }
  }, [latitude, longitude, location])

  // Initial fetch
  useEffect(() => {
    fetchAlerts()

    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAlerts])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedAlerts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedAlerts(newExpanded)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "severe":
        return "bg-red-500/10 border-red-500/30 text-red-400"
      case "warning":
      case "high":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      case "info":
      case "moderate":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "severe":
      case "warning":
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Cloud className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-foreground">Route Alerts</h3>
            {alerts.length > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{alerts.length}</Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchAlerts}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <p className="text-xs text-muted-foreground">Updated at {lastUpdate}</p>
        )}

        {/* Alerts List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const isExpanded = expandedAlerts.has(alert.id)
                const isWeather = alert.type === "weather"

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => toggleExpanded(alert.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${getSeverityColor(
                      alert.severity
                    )}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between mb-1">
                          <p className="font-medium text-sm truncate">{alert.title || alert.event}</p>
                          <Badge
                            variant="outline"
                            className="text-[10px] shrink-0"
                          >
                            {isWeather ? "Weather" : "News"}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-80 truncate">
                          {alert.description || (isWeather ? alert.description : alert.source)}
                        </p>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 pt-2 border-t border-current/20 text-xs"
                          >
                            {isWeather ? (
                              <div className="space-y-1">
                                <p>
                                  <span className="opacity-70">Duration:</span> {new Date((alert as any).start * 1000).toLocaleString()} - {new Date((alert as any).end * 1000).toLocaleString()}
                                </p>
                                <p className="opacity-70">{alert.description}</p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p>
                                  <span className="opacity-70">Source:</span> {(alert as NewsAlert).source}
                                </p>
                                <p className="opacity-70">{alert.description?.substring(0, 150)}...</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 text-center text-muted-foreground"
              >
                <Cloud className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No active alerts for this route</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center gap-1 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Live alerts • Refreshes every 5 min</span>
        </div>
      </div>
    </Card>
  )
}
