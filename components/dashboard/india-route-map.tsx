"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"

interface IndiaRouteMapProps {
  source: string | null
  destination: string | null
  isLoading?: boolean
}

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 }
const DEFAULT_ZOOM = 5

// Dark map style for consistency with dashboard theme
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283548" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#1a3a2f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#374151" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#475569" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2d3748" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
]

const containerStyle = {
  width: "100%",
  height: "100%",
}

const mapOptions: google.maps.MapOptions = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
}

export function IndiaRouteMap({ source, destination, isLoading = false }: IndiaRouteMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const hasRoute = source && destination

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Fetch directions when source/destination change
  useEffect(() => {
    if (!isLoaded || !source || !destination) {
      setDirections(null)
      setRouteError(null)
      return
    }

    setRouteLoading(true)
    setRouteError(null)

    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin: `${source}, India`,
        destination: `${destination}, India`,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setRouteLoading(false)
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
          setRouteError(null)
          // Fit bounds to show the entire route
          if (map && result.routes[0]?.bounds) {
            map.fitBounds(result.routes[0].bounds)
          }
        } else {
          console.error("Directions request failed:", status)
          setDirections(null)
          setRouteError("Unable to find route. Try a more specific city name.")
        }
      }
    )
  }, [isLoaded, source, destination, map])

  // Show loading or error states
  const showLoading = isLoading || routeLoading || !isLoaded

  if (loadError) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            India Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[420px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Failed to load map</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          India Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[420px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <AnimatePresence mode="wait">
            {showLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    {!isLoaded ? "Loading map..." : "Analyzing route..."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={INDIA_CENTER}
                  zoom={DEFAULT_ZOOM}
                  options={mapOptions}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: false,
                        polylineOptions: {
                          strokeColor: "#3b82f6",
                          strokeWeight: 5,
                          strokeOpacity: 0.9,
                        },
                        markerOptions: {
                          zIndex: 100,
                        },
                      }}
                    />
                  )}
                </GoogleMap>
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
          {!hasRoute && !showLoading && isLoaded && (
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
          {hasRoute && directions && !showLoading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50"
            >
              <p className="text-xs text-slate-400">Route Distance</p>
              <p className="text-sm font-semibold text-white">
                {directions.routes[0]?.legs[0]?.distance?.text || "N/A"}
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
