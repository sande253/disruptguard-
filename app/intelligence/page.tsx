"use client"

import { useState } from "react"
import { RouteSearchPanel } from "@/components/dashboard/route-search-panel"
import { RouteMap } from "@/components/dashboard/route-map"
import { RouteAlerts } from "@/components/dashboard/route-alerts"
import { FuelStopsPanel } from "@/components/dashboard/fuel-stops-panel"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { type Place } from "@/lib/services/geocoding"
import { type Route } from "@/lib/services/routing"
import { motion } from "framer-motion"
import { ChevronRight, Map, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IntelligenceDashboard() {
  const [origin, setOrigin] = useState<Place | null>(null)
  const [destination, setDestination] = useState<Place | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mapExpanded, setMapExpanded] = useState(false)

  const handleRouteSelect = (originPlace: Place, destPlace: Place) => {
    setOrigin(originPlace)
    setDestination(destPlace)
  }

  const handleRouteChange = (newRoute: { origin: Place | null; destination: Place | null }) => {
    setOrigin(newRoute.origin)
    setDestination(newRoute.destination)
  }

  const handleRouteLoaded = (routeData: Route) => {
    setRoute(routeData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 400 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden border-r border-border bg-card relative"
        >
          <div className="w-[400px] h-full overflow-y-auto p-4 space-y-4">
            {/* Header */}
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl font-bold text-foreground">DisruptGuard</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Route Intelligence</p>
            </div>

            {/* Search Panel */}
            <RouteSearchPanel onRouteSelect={handleRouteSelect} onRouteChange={handleRouteChange} />

            {/* Alerts */}
            {origin && destination && (
              <RouteAlerts latitude={destination.latitude} longitude={destination.longitude} location={destination.name} />
            )}

            {/* Fuel Stops */}
            {route && (
              <FuelStopsPanel
                routeDistance={Math.round(route.distance / 1000)}
                routeDuration={Math.round(route.duration)}
              />
            )}

            {/* AI Recommendations */}
            {route && (
              <AIRecommendations
                distance={Math.round(route.distance / 1000)}
                duration={Math.round(route.duration / 3600)}
              />
            )}
          </div>

          {/* Sidebar Toggle Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute -right-10 top-4 h-8 w-8 p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </Button>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setSidebarOpen(true)}
                >
                  <List className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Route Map
                </h2>
                {origin && destination && (
                  <p className="text-xs text-muted-foreground">
                    {origin.name} → {destination.name}
                  </p>
                )}
              </div>
            </div>

            {route && (
              <Button
                size="sm"
                onClick={() => setMapExpanded(!mapExpanded)}
                className="text-xs"
              >
                {mapExpanded ? "Normal View" : "Expand Map"}
              </Button>
            )}
          </div>

          {/* Map Area */}
          <div className="flex-1 overflow-hidden p-4">
            {mapExpanded ? (
              // Expanded Map View
              <RouteMap origin={origin} destination={destination} onRouteLoaded={handleRouteLoaded} />
            ) : (
              // Split View: Map and Info
              <div className="h-full flex gap-4">
                {/* Map (70%) */}
                <div className="flex-1 rounded-lg overflow-hidden border border-border">
                  <RouteMap origin={origin} destination={destination} onRouteLoaded={handleRouteLoaded} />
                </div>

                {/* Info Panel (30%) */}
                <div className="w-1/3 space-y-4 overflow-y-auto">
                  {route ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Route Summary */}
                      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-foreground">Route Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distance</span>
                            <span className="font-medium text-foreground">{Math.round(route.distance / 1000)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium text-foreground">{Math.round(route.duration / 3600)}h {Math.round((route.duration % 3600) / 60)}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Cost</span>
                            <span className="font-medium text-foreground text-primary">₹{Math.round((route.distance / 1000) * 8)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-foreground text-sm">Quick Actions</h3>
                        <Button className="w-full" size="sm">
                          Plan This Route
                        </Button>
                        <Button className="w-full" size="sm" variant="outline">
                          Share Route
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Map className="h-8 w-8 opacity-30 mb-2" />
                      <p className="text-sm">Select a route to begin</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
