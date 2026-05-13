"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2, Fuel, MapPin as TruckStopIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTruckStopsLayer } from "./truck-stops-layer"

interface IndiaRouteMapProps {
  source: string | null
  destination: string | null
  stops?: Array<{ name: string; lat: number; lng: number }> | null
  isLoading?: boolean
}

// India center coordinates
const INDIA_CENTER: [number, number] = [78.9629, 20.5937]
const DEFAULT_ZOOM = 4.5

// Mock city coordinates for route visualization
const CITY_COORDINATES: Record<string, [number, number]> = {
  // Format: [longitude, latitude]
  "hyderabad": [78.4867, 17.3850],
  "chennai": [80.2707, 13.0827],
  "mumbai": [72.8777, 19.0760],
  "delhi": [77.1025, 28.7041],
  "bangalore": [77.5946, 12.9716],
  "bengaluru": [77.5946, 12.9716],
  "kolkata": [88.3639, 22.5726],
  "pune": [73.8567, 18.5204],
  "jaipur": [75.7873, 26.9124],
  "ahmedabad": [72.5714, 23.0225],
  "lucknow": [80.9462, 26.8467],
  "kochi": [76.2673, 9.9312],
  "cochin": [76.2673, 9.9312],
  "thiruvananthapuram": [76.9366, 8.5241],
  "trivandrum": [76.9366, 8.5241],
  "visakhapatnam": [83.2185, 17.6868],
  "vizag": [83.2185, 17.6868],
  "nagpur": [79.0882, 21.1458],
  "bhopal": [77.4126, 23.2599],
  "indore": [75.8577, 22.7196],
  "chandigarh": [76.7794, 30.7333],
  "guwahati": [91.7362, 26.1445],
  "surat": [72.8311, 21.1702],
  "coimbatore": [76.9558, 11.0168],
  "vadodara": [73.1812, 22.3072],
  "patna": [85.1376, 25.5941],
  "ranchi": [85.3096, 23.3441],
  "bhubaneswar": [85.8245, 20.2961],
  "goa": [73.8278, 15.4909],
  "panaji": [73.8278, 15.4909],
  "new delhi": [77.2090, 28.6139],
}

// Get coordinates for a city (case insensitive)
function getCityCoordinates(city: string): [number, number] | null {
  const normalized = city.toLowerCase().trim()
  return CITY_COORDINATES[normalized] || null
}

// Calculate intermediate points for a curved route
function getRoutePoints(start: [number, number], end: [number, number]): [number, number][] {
  const points: [number, number][] = []
  const steps = 50
  
  // Calculate midpoint with offset for curve
  const midLng = (start[0] + end[0]) / 2
  const midLat = (start[1] + end[1]) / 2
  
  // Add slight curve offset based on direction
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const curveOffset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.1
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Quadratic bezier curve
    const lng = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * (midLng + curveOffset) + t * t * end[0]
    const lat = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * (midLat + curveOffset) + t * t * end[1]
    points.push([lng, lat])
  }
  
  return points
}

// Calculate approximate distance between two coordinates in km
function calculateDistance(start: [number, number], end: [number, number]): number {
  const R = 6371 // Earth's radius in km
  const dLat = (end[1] - start[1]) * Math.PI / 180
  const dLon = (end[0] - start[0]) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start[1] * Math.PI / 180) * Math.cos(end[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export function IndiaRouteMap({ source, destination, stops, isLoading = false }: IndiaRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [routeDistance, setRouteDistance] = useState<number | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const { visibleStops, visiblePumps, showTruckStops, setShowTruckStops, showFuelPumps, setShowFuelPumps } = useTruckStopsLayer()

  const hasRoute = source && destination

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error("Mapbox token is not configured. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.")
      return
    }

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: INDIA_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.current.on("load", () => {
      setMapLoaded(true)
      
      // Add truck stops layer
      addTruckStopsLayer()
      addFuelPumpsLayer()
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Draw route when source/destination change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Remove previous route layer and source
    if (map.current.getLayer("route-glow")) {
      map.current.removeLayer("route-glow")
    }
    if (map.current.getLayer("route")) {
      map.current.removeLayer("route")
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route")
    }

    // Reset state
    setRouteError(null)
    setRouteDistance(null)

    if (!source || !destination) {
      // Reset to India view
      map.current.flyTo({
        center: INDIA_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 1000,
      })
      return
    }

    const sourceCoords = getCityCoordinates(source)
    const destCoords = getCityCoordinates(destination)

    if (!sourceCoords || !destCoords) {
      setRouteError("City not found. Try: Mumbai, Delhi, Chennai, Hyderabad, Bangalore...")
      return
    }

    // Build waypoints array including stops
    const allWaypoints: [number, number][] = [sourceCoords]
    
    // Add stops in order if they have valid coordinates
    if (stops && stops.length > 0) {
      stops.forEach(stop => {
        if (stop.lat && stop.lng) {
          allWaypoints.push([stop.lng, stop.lat])
        }
      })
    }
    
    allWaypoints.push(destCoords)

    // Calculate total distance through all waypoints
    let totalDistance = 0
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      totalDistance += calculateDistance(allWaypoints[i], allWaypoints[i + 1])
    }
    setRouteDistance(totalDistance)

    // Get curved route points through all waypoints
    let allRoutePoints: [number, number][] = []
    for (let i = 0; i < allWaypoints.length - 1; i++) {
      const segmentPoints = getRoutePoints(allWaypoints[i], allWaypoints[i + 1])
      // Remove last point to avoid duplication
      allRoutePoints = allRoutePoints.concat(segmentPoints.slice(0, -1))
    }
    // Add final point
    allRoutePoints.push(allWaypoints[allWaypoints.length - 1])

    // Add route source
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: allRoutePoints,
        },
      },
    })

    // Add glow effect layer
    map.current.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 12,
        "line-opacity": 0.3,
        "line-blur": 8,
      },
    })

    // Add main route layer
    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3b82f6",
        "line-width": 4,
        "line-opacity": 0.9,
      },
    })

    // Add origin marker (blue)
    const originMarker = new mapboxgl.Marker({
      color: "#3b82f6",
    })
      .setLngLat(sourceCoords)
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${source}</strong><br/>Origin`))
      .addTo(map.current)
    markersRef.current.push(originMarker)

    // Add stop markers (orange/yellow)
    if (stops && stops.length > 0) {
      stops.forEach((stop, idx) => {
        if (stop.lat && stop.lng) {
          const stopMarker = new mapboxgl.Marker({
            color: "#f59e0b",
          })
            .setLngLat([stop.lng, stop.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${stop.name}</strong><br/>Stop ${idx + 1}`))
            .addTo(map.current!)
          markersRef.current.push(stopMarker)
        }
      })
    }

    // Add destination marker (cyan)
    const destMarker = new mapboxgl.Marker({
      color: "#06b6d4",
    })
      .setLngLat(destCoords)
      .setPopup(new mapboxgl.Popup().setHTML(`<strong>${destination}</strong><br/>Destination`))
      .addTo(map.current)
    markersRef.current.push(destMarker)

    // Fit bounds to show the entire route including all waypoints
    const bounds = new mapboxgl.LngLatBounds()
    allWaypoints.forEach(point => bounds.extend(point))
    map.current.fitBounds(bounds, {
      padding: 80,
      duration: 1000,
    })
  }, [source, destination, stops, mapLoaded])

  const showLoading = isLoading || !mapLoaded

  // Add truck stops layer to map
  const addTruckStopsLayer = () => {
    if (!map.current || !showTruckStops || visibleStops.length === 0) return

    const geojson = {
      type: "FeatureCollection" as const,
      features: visibleStops.map(stop => ({
        type: "Feature" as const,
        properties: {
          title: stop.name,
          type: stop.type,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [stop.longitude, stop.latitude],
        },
      })),
    }

    if (!map.current.getSource("truck-stops")) {
      map.current.addSource("truck-stops", {
        type: "geojson",
        data: geojson as any,
      })

      map.current.addLayer({
        id: "truck-stops",
        type: "circle",
        source: "truck-stops",
        paint: {
          "circle-radius": 6,
          "circle-color": "#f59e0b",
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      })
    }
  }

  // Add fuel pumps layer to map
  const addFuelPumpsLayer = () => {
    if (!map.current || !showFuelPumps || visiblePumps.length === 0) return

    const geojson = {
      type: "FeatureCollection" as const,
      features: visiblePumps.map(pump => ({
        type: "Feature" as const,
        properties: {
          title: pump.name,
          fuel: pump.fuelTypes.join(", "),
        },
        geometry: {
          type: "Point" as const,
          coordinates: [pump.longitude, pump.latitude],
        },
      })),
    }

    if (!map.current.getSource("fuel-pumps")) {
      map.current.addSource("fuel-pumps", {
        type: "geojson",
        data: geojson as any,
      })

      map.current.addLayer({
        id: "fuel-pumps",
        type: "circle",
        source: "fuel-pumps",
        paint: {
          "circle-radius": 5,
          "circle-color": "#ef4444",
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      })
    }
  }

  // Update layers when visibility changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    if (showTruckStops && !map.current.getLayer("truck-stops")) {
      addTruckStopsLayer()
    } else if (!showTruckStops && map.current.getLayer("truck-stops")) {
      map.current.removeLayer("truck-stops")
      map.current.removeSource("truck-stops")
    }

    if (showFuelPumps && !map.current.getLayer("fuel-pumps")) {
      addFuelPumpsLayer()
    } else if (!showFuelPumps && map.current.getLayer("fuel-pumps")) {
      map.current.removeLayer("fuel-pumps")
      map.current.removeSource("fuel-pumps")
    }
  }, [showTruckStops, showFuelPumps, mapLoaded])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            India Route Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={showTruckStops ? "default" : "outline"}
              className="h-7 text-xs gap-1"
              onClick={() => setShowTruckStops(!showTruckStops)}
            >
              <TruckStopIcon className="h-3.5 w-3.5" />
              Truck Stops
            </Button>
            <Button 
              size="sm" 
              variant={showFuelPumps ? "default" : "outline"}
              className="h-7 text-xs gap-1"
              onClick={() => setShowFuelPumps(!showFuelPumps)}
            >
              <Fuel className="h-3.5 w-3.5" />
              Fuel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[520px] w-full rounded-xl overflow-hidden bg-slate-900">
          {/* Map container */}
          <div 
            ref={mapContainer} 
            className="absolute inset-0 w-full h-full"
            style={{ minHeight: "520px" }}
          />

          <AnimatePresence mode="wait">
            {showLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 bg-slate-900/80"
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    {!mapLoaded ? "Loading map..." : "Analyzing route..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Route error message */}
          {routeError && hasRoute && !showLoading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/90 backdrop-blur-md px-4 py-2 rounded-lg text-center shadow-xl border border-red-700/50"
              >
                <p className="text-sm text-red-200">{routeError}</p>
              </motion.div>
            </div>
          )}

          {/* Empty state overlay */}
          {!hasRoute && !showLoading && mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-xl text-center shadow-xl border border-slate-700/50"
              >
                <MapPin className="h-10 w-10 text-primary/60 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-200">
                  Enter a route to visualize
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Select source and destination cities above
                </p>
              </motion.div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-slate-300">Low</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-slate-300">Medium</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-300">High</span>
              </span>
            </div>
          </div>

          {/* Route info badge */}
          {hasRoute && routeDistance && !showLoading && !routeError && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50"
            >
              <p className="text-xs text-slate-400">Route Distance</p>
              <p className="text-sm font-semibold text-white">
                {routeDistance.toLocaleString()} km
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
