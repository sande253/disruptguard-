"use client"

import { useEffect, useState, useCallback } from "react"
import { Fuel, Coffee, Clock, MapPin, Star, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface FuelStop {
  id: string
  name: string
  type: "fuel" | "rest" | "food" | "hotel"
  distance: number // km from start
  fuel_price?: number
  rating: number
  amenities: string[]
  estimated_wait_time: number // minutes
}

interface RouteStops {
  fuelStops: FuelStop[]
  recommendedRestPoints: FuelStop[]
  totalStops: number
}

interface FuelStopsProps {
  routeDistance?: number
  routeDuration?: number
  originLat?: number
  originLng?: number
  destLat?: number
  destLng?: number
}

// Mock data for fuel stops - in production, query OSM/Overpass API
const generateFuelStops = (distance: number): FuelStop[] => {
  const stops: FuelStop[] = []
  const interval = distance / 4 // 4 stops per route

  const fuelBrands = ["Indian Oil", "Bharat Petroleum", "HPCL", "Reliance", "Shell"]
  const amenityOptions = [
    ["Restroom", "Water", "Snacks"],
    ["Restaurant", "Parking", "WiFi"],
    ["Hotel", "Shower", "Parking"],
    ["ATM", "Phone", "Restroom"],
    ["Shop", "Cafe", "Restroom"],
  ]

  for (let i = 1; i <= 4; i++) {
    const dist = interval * i
    const typeNum = i % 3
    let type: FuelStop["type"] = "fuel"
    if (typeNum === 1) type = "rest"
    else if (typeNum === 2) type = "food"

    stops.push({
      id: `stop-${i}`,
      name: `${fuelBrands[Math.floor(Math.random() * fuelBrands.length)]} Station ${i}`,
      type,
      distance: Math.round(dist),
      fuel_price: 95 + Math.random() * 8,
      rating: 3.5 + Math.random() * 1.5,
      amenities: amenityOptions[Math.floor(Math.random() * amenityOptions.length)],
      estimated_wait_time: 10 + Math.floor(Math.random() * 15),
    })
  }

  return stops
}

// Calculate recommended rest points based on driving hours
const calculateRestPoints = (stops: FuelStop[], duration: number): FuelStop[] => {
  const recommendedRest: FuelStop[] = []

  // Recommend a rest point every 4-5 hours of driving
  const restIntervals = Math.ceil(duration / 3600 / 4)

  for (let i = 0; i < Math.min(restIntervals, stops.length); i++) {
    const restIndex = Math.floor((stops.length / (restIntervals + 1)) * (i + 1))
    if (stops[restIndex]) {
      recommendedRest.push(stops[restIndex])
    }
  }

  return recommendedRest
}

export function FuelStopsPanel({ routeDistance = 1000, routeDuration = 18000 }: FuelStopsProps) {
  const [stops, setStops] = useState<RouteStops>({
    fuelStops: [],
    recommendedRestPoints: [],
    totalStops: 0,
  })
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate stops
  useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      const fuelStops = generateFuelStops(routeDistance)
      const restPoints = calculateRestPoints(fuelStops, routeDuration)

      setStops({
        fuelStops,
        recommendedRestPoints: restPoints,
        totalStops: fuelStops.length,
      })
      setLoading(false)
    }, 500)
  }, [routeDistance, routeDuration])

  const getStopIcon = (type: FuelStop["type"]) => {
    switch (type) {
      case "fuel":
        return <Fuel className="h-4 w-4 text-yellow-400" />
      case "rest":
        return <Coffee className="h-4 w-4 text-blue-400" />
      case "food":
        return <Coffee className="h-4 w-4 text-orange-400" />
      case "hotel":
        return <MapPin className="h-4 w-4 text-purple-400" />
    }
  }

  const getStopBgColor = (type: FuelStop["type"]) => {
    switch (type) {
      case "fuel":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "rest":
        return "bg-blue-500/10 border-blue-500/30"
      case "food":
        return "bg-orange-500/10 border-orange-500/30"
      case "hotel":
        return "bg-purple-500/10 border-purple-500/30"
    }
  }

  return (
    <div className="space-y-4">
      {/* Fuel Stops */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-yellow-400" />
              <h3 className="font-semibold text-foreground">Fuel & Rest Stops</h3>
              <Badge className="bg-yellow-500/20 text-yellow-400">{stops.totalStops}</Badge>
            </div>
            {loading && <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-secondary/20 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Avg Fuel Price</p>
              <p className="font-semibold text-foreground">
                ₹{(
                  stops.fuelStops.reduce((sum, s) => sum + (s.fuel_price || 0), 0) / stops.fuelStops.length || 0
                ).toFixed(2)}/L
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Recommended Stops</p>
              <p className="font-semibold text-foreground">{stops.recommendedRestPoints.length}</p>
            </div>
          </div>

          {/* Stops List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stops.fuelStops.map((stop, idx) => {
              const isSelected = selectedStop === stop.id
              const isRecommended = stops.recommendedRestPoints.some((r) => r.id === stop.id)

              return (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedStop(isSelected ? null : stop.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${getStopBgColor(
                    stop.type
                  )} ${isSelected ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {getStopIcon(stop.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <p className="font-medium text-sm truncate">{stop.name}</p>
                        {isRecommended && (
                          <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {stop.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {stop.estimated_wait_time} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {stop.rating.toFixed(1)}
                        </span>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 border-t border-current/20 space-y-2 text-xs"
                        >
                          {stop.fuel_price && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Fuel Price:</span>
                              <span className="font-medium">₹{stop.fuel_price.toFixed(2)}/L</span>
                            </div>
                          )}
                          <div>
                            <p className="text-muted-foreground mb-1">Amenities:</p>
                            <div className="flex flex-wrap gap-1">
                              {stop.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-[9px] px-1.5">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" className="w-full mt-2 h-7 text-xs">
                            Get Directions
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

      {/* Rest Time Recommendation */}
      <Card className="bg-card border-border p-3">
        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 text-blue-400 mt-1 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Recommended Rest Time</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {Math.round(routeDuration / 3600)} hours of driving, we recommend a 30-minute break every 4-5 hours to maintain driver safety.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
