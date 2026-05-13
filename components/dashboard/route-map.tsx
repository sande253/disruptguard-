"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { getRoute, type Route } from "@/lib/services/routing"
import { type Place } from "@/lib/services/geocoding"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation, Clock, TrendingUp, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface RouteMapProps {
  origin?: Place | null
  destination?: Place | null
  onRouteLoaded?: (route: Route) => void
}

export function RouteMap({ origin, destination, onRouteLoaded }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.5, 20],
        zoom: 4,
        attributionControl: false,
      })

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
    }

    return () => {
      // Keep map instance alive
    }
  }, [])

  // Load route when origin and destination change
  useEffect(() => {
    if (!origin || !destination || !map.current) return

    const loadRoute = async () => {
      setLoading(true)
      setError(null)

      try {
        const routeData = await getRoute(
          origin.longitude,
          origin.latitude,
          destination.longitude,
          destination.latitude
        )

        if (routeData) {
          setRoute(routeData)
          onRouteLoaded?.(routeData)
          drawRoute(routeData, origin, destination)
        } else {
          setError("Could not calculate route")
        }
      } catch (err) {
        setError("Error loading route")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
  }, [origin, destination, onRouteLoaded])

  // Draw route on map
  const drawRoute = (routeData: Route, orig: Place, dest: Place) => {
    if (!map.current) return

    // Clear existing markers and layers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    if (map.current.getLayer("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
    }

    // Add route source and layer
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeData.geometry,
        },
      },
    })

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0066ff",
        "line-width": 3,
        "line-opacity": 0.8,
      },
    })

    // Add glow effect
    map.current.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0066ff",
        "line-width": 8,
        "line-opacity": 0.2,
      },
    }, "route")

    // Add origin marker
    const originMarker = new mapboxgl.Marker({ color: "#10b981" })
      .setLngLat([orig.longitude, orig.latitude])
      .setPopup(new mapboxgl.Popup().setText(`Start: ${orig.name}`))
      .addTo(map.current)
    markersRef.current.push(originMarker)

    // Add destination marker
    const destMarker = new mapboxgl.Marker({ color: "#ef4444" })
      .setLngLat([dest.longitude, dest.latitude])
      .setPopup(new mapboxgl.Popup().setText(`End: ${dest.name}`))
      .addTo(map.current)
    markersRef.current.push(destMarker)

    // Fit map to route bounds
    const bounds = calculateBounds(routeData.geometry)
    map.current.fitBounds(bounds, { padding: 100, maxZoom: 12 })
  }

  // Calculate bounding box for route
  const calculateBounds = (coordinates: Array<[number, number]>): [[number, number], [number, number]] => {
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity

    coordinates.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng)
      minLat = Math.min(minLat, lat)
      maxLng = Math.max(maxLng, lng)
      maxLat = Math.max(maxLat, lat)
    })

    return [
      [minLng, minLat],
      [maxLng, maxLat],
    ]
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDistance = (meters: number): string => {
    const km = Math.round(meters / 1000)
    return `${km} km`
  }

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <Card className="overflow-hidden border-border">
        <div ref={mapContainer} className="w-full h-[500px] relative bg-secondary" />
      </Card>

      {/* Route Info */}
      {route && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="p-3 bg-card border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <p className="text-lg font-bold text-foreground">{formatDistance(route.distance)}</p>
          </Card>

          <Card className="p-3 bg-card border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <p className="text-lg font-bold text-foreground">{formatTime(route.duration)}</p>
          </Card>

          <Card className="p-3 bg-card border-border">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Route Type</p>
            </div>
            <p className="text-lg font-bold text-foreground">Optimal</p>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-secondary/50 rounded-lg border border-border text-center"
        >
          <p className="text-sm text-muted-foreground">Calculating optimal route...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-risk-high/10 border border-risk-high/30 rounded-lg flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-risk-high" />
          <p className="text-sm text-risk-high">{error}</p>
        </motion.div>
      )}

      {/* Route not loaded */}
      {!origin || !destination ? (
        <div className="p-8 text-center bg-secondary/30 rounded-lg border border-border/50">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Select origin and destination to view route</p>
        </div>
      ) : null}
    </div>
  )
}

import { MapPin } from "lucide-react"
