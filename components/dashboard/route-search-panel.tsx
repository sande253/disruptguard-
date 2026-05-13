"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Search, MapPin, Clock, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { geocodeAddress, getAutocompleteSuggestions, type Place } from "@/lib/services/geocoding"
import { motion, AnimatePresence } from "framer-motion"

interface RouteSearchProps {
  onRouteSelect?: (origin: Place, destination: Place) => void
  onRouteChange?: (route: { origin: Place | null; destination: Place | null }) => void
}

export function RouteSearchPanel({ onRouteSelect, onRouteChange }: RouteSearchProps) {
  const [origin, setOrigin] = useState<Place | null>(null)
  const [destination, setDestination] = useState<Place | null>(null)
  const [originInput, setOriginInput] = useState("")
  const [destinationInput, setDestinationInput] = useState("")
  const [originSuggestions, setOriginSuggestions] = useState<Place[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const originRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  // Handle autocomplete for origin
  const handleOriginChange = useCallback(async (value: string) => {
    setOriginInput(value)
    if (value.length > 2) {
      setLoading(true)
      const suggestions = await getAutocompleteSuggestions(value)
      setOriginSuggestions(suggestions)
      setShowOriginDropdown(true)
      setLoading(false)
    } else {
      setOriginSuggestions([])
      setShowOriginDropdown(false)
    }
  }, [])

  // Handle autocomplete for destination
  const handleDestinationChange = useCallback(async (value: string) => {
    setDestinationInput(value)
    if (value.length > 2) {
      setLoading(true)
      const suggestions = await getAutocompleteSuggestions(value)
      setDestinationSuggestions(suggestions)
      setShowDestinationDropdown(true)
      setLoading(false)
    } else {
      setDestinationSuggestions([])
      setShowDestinationDropdown(false)
    }
  }, [])

  // Select origin place
  const selectOrigin = (place: Place) => {
    setOrigin(place)
    setOriginInput(place.name)
    setShowOriginDropdown(false)
    onRouteChange?.({ origin: place, destination })
  }

  // Select destination place
  const selectDestination = (place: Place) => {
    setDestination(place)
    setDestinationInput(place.name)
    setShowDestinationDropdown(false)
    onRouteChange?.({ origin, destination: place })
  }

  // Swap origin and destination
  const swapLocations = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
    const tempInput = originInput
    setOriginInput(destinationInput)
    setDestinationInput(tempInput)
    onRouteChange?.({ origin: destination, destination: origin })
  }

  // Get route when both locations are selected
  const handleGetRoute = () => {
    if (origin && destination) {
      onRouteSelect?.(origin, destination)
    }
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false)
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestinationDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Card className="w-full bg-card border-border shadow-xl">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Find Your Route</h2>
        </div>

        {/* Origin Input */}
        <div className="relative" ref={originRef}>
          <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2 border border-border focus-within:border-primary transition-colors">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="From (origin city)"
              value={originInput}
              onChange={(e) => handleOriginChange(e.target.value)}
              onFocus={() => originInput.length > 0 && setShowOriginDropdown(true)}
              className="border-0 bg-transparent placeholder-muted-foreground focus:outline-none"
            />
            {origin && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setOrigin(null)
                  setOriginInput("")
                  onRouteChange?.({ origin: null, destination })
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Origin Suggestions Dropdown */}
          <AnimatePresence>
            {showOriginDropdown && originSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                {originSuggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => selectOrigin(place)}
                    className="w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 flex items-start gap-2"
                  >
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Destination Input */}
        <div className="relative" ref={destRef}>
          <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2 border border-border focus-within:border-primary transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            <Input
              type="text"
              placeholder="To (destination city)"
              value={destinationInput}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => destinationInput.length > 0 && setShowDestinationDropdown(true)}
              className="border-0 bg-transparent placeholder-muted-foreground focus:outline-none"
            />
            {destination && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setDestination(null)
                  setDestinationInput("")
                  onRouteChange?.({ origin, destination: null })
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Destination Suggestions Dropdown */}
          <AnimatePresence>
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
              >
                {destinationSuggestions.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => selectDestination(place)}
                    className="w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors border-b border-border/50 last:border-0 flex items-start gap-2"
                  >
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={swapLocations}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!origin || !destination}
          >
            Swap
          </Button>
          <Button
            onClick={handleGetRoute}
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!origin || !destination || loading}
          >
            {loading ? "Loading..." : "Analyze Route"}
          </Button>
        </div>

        {/* Quick suggestions */}
        {(!origin || !destination) && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Popular routes:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Delhi to Mumbai", lat: 19.08, lng: 72.88 },
                { name: "Bangalore to Chennai", lat: 13.0, lng: 80.27 },
                { name: "Jaipur to Delhi", lat: 28.61, lng: 77.23 },
              ].map((route) => (
                <Badge key={route.name} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10">
                  {route.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
