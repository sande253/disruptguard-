"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, ArrowRight, Loader2, Truck, Train, Ship, Clock, TrendingUp, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface RouteInputPanelProps {
  onAnalyze: (source: string, destination: string, mode: string, stops?: LocationSuggestion[]) => void
  isLoading: boolean
}

const transportModes = [
  { value: "road", label: "Road", icon: Truck },
  { value: "rail", label: "Rail", icon: Train },
  { value: "sea", label: "Sea", icon: Ship },
]

interface LocationSuggestion {
  name: string
  region: string
  type: "port" | "city"
  category: "recent" | "nearby" | "trending"
  lat?: number
  lng?: number
}

export function RouteInputPanel({ onAnalyze, isLoading }: RouteInputPanelProps) {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [stops, setStops] = useState<LocationSuggestion[]>([])
  const [transportMode, setTransportMode] = useState("")
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([])
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([])
  const [stopSuggestions, setStopSuggestions] = useState<LocationSuggestion[]>([])
  const [activeStopInput, setActiveStopInput] = useState<string>("")
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const [showStopDropdown, setShowStopDropdown] = useState(false)
  const sourceRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)
  const stopRef = useRef<HTMLDivElement>(null)

  // Fetch real locations from Nominatim API
  const fetchRealLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim() || query.length < 2) return []

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&limit=20`,
        { headers: { "Accept-Language": "en" } }
      )
      const data = await response.json()

      return data.map((result: any) => ({
        name: result.name || result.display_name.split(",")[0],
        region: result.address?.state || result.address?.province || "India",
        type: result.type === "port" || result.type === "harbour" ? "port" : "city",
        category: "recent" as const,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      }))
    } catch (err) {
      console.error("Error fetching locations:", err)
      return []
    }
  }

  // Get suggestions for source/destination
  const getSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query.trim()) {
      // Return empty array, will be populated on focus
      return []
    }

    const filtered = await fetchRealLocations(query)

    return filtered.map(loc => ({
      ...loc,
      category: "recent" as const,
    }))
  }

  useEffect(() => {
    const loadSuggestions = async () => {
      if (source) {
        const suggestions = await fetchRealLocations(source)
        setSourceSuggestions(suggestions)
        setShowSourceDropdown(true)
      } else {
        setShowSourceDropdown(false)
      }
    }
    loadSuggestions()
  }, [source])

  useEffect(() => {
    const loadSuggestions = async () => {
      if (destination) {
        const suggestions = await fetchRealLocations(destination)
        setDestSuggestions(suggestions)
        setShowDestDropdown(true)
      } else {
        setShowDestDropdown(false)
      }
    }
    loadSuggestions()
  }, [destination])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceDropdown(false)
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAnalyze = () => {
    if (source && destination && transportMode) {
      onAnalyze(source, destination, transportMode, stops.length > 0 ? stops : undefined)
    }
  }

  const handleAddStop = (suggestion: LocationSuggestion) => {
    setStops([...stops, suggestion])
    setActiveStopInput("")
    setShowStopDropdown(false)
  }

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index))
  }

  const handleSelectSource = (suggestion: LocationSuggestion) => {
    setSource(suggestion.name)
    setShowSourceDropdown(false)
  }

  const handleSelectDest = (suggestion: LocationSuggestion) => {
    setDestination(suggestion.name)
    setShowDestDropdown(false)
  }

  const isValid = source.trim() !== "" && destination.trim() !== "" && transportMode !== ""

  const SuggestionItem = ({ suggestion }: { suggestion: LocationSuggestion }) => (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-start justify-between"
      onClick={() => suggestion === sourceSuggestions[0] && source ? handleSelectSource(suggestion) : handleSelectDest(suggestion)}
    >
      <div className="flex items-start gap-3 flex-1">
        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
          <p className="text-xs text-muted-foreground">{suggestion.region}</p>
        </div>
      </div>
      <Badge variant="outline" className="shrink-0 ml-2 text-[10px]">
        {suggestion.type === "port" ? "Port" : "City"}
      </Badge>
    </motion.button>
  )

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:items-end">
          {/* Source Input */}
          <div className="md:col-span-2 space-y-1.5 relative" ref={sourceRef}>
            <label className="text-xs font-medium text-muted-foreground">
              Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter origin city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                onFocus={() => setShowSourceDropdown(true)}
                className="pl-9 bg-secondary border-border"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            </div>

            {/* Source Suggestions Dropdown */}
            <AnimatePresence>
              {showSourceDropdown && sourceSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {sourceSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border/30 last:border-b-0"
                        onClick={() => handleSelectSource(suggestion)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.region}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {suggestion.type === "port" ? "Port" : "City"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Arrow indicator (desktop only) */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center pb-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Destination Input */}
          <div className="md:col-span-2 space-y-1.5 relative" ref={destRef}>
            <label className="text-xs font-medium text-muted-foreground">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                placeholder="Enter destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowDestDropdown(true)}
                className="pl-9 bg-secondary border-border"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            </div>

            {/* Destination Suggestions Dropdown */}
            <AnimatePresence>
              {showDestDropdown && destSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {destSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border/30 last:border-b-0"
                        onClick={() => handleSelectDest(suggestion)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.region}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {suggestion.type === "port" ? "Port" : "City"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Stops Section */}
          <div className="w-full md:col-span-4 space-y-2">
            {stops.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Stops ({stops.length})
                </label>
                <div className="space-y-1.5">
                  {stops.map((stop, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary/40 rounded-lg border border-border/50"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{stop.name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveStop(idx)}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Stop Input */}
            <div className="relative" ref={stopRef}>
              <label className="text-xs font-medium text-muted-foreground">
                {stops.length > 0 ? "Add another stop" : "Add stops (optional)"}
              </label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search and add intermediate stops..."
                  value={activeStopInput}
                  onChange={(e) => {
                    setActiveStopInput(e.target.value)
                    if (e.target.value.length > 1) {
                      fetchRealLocations(e.target.value).then(setStopSuggestions)
                      setShowStopDropdown(true)
                    }
                  }}
                  onFocus={() => activeStopInput.length > 1 && setShowStopDropdown(true)}
                  className="pl-9 bg-secondary border-border"
                />
                <Plus className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              </div>

              {/* Stop Suggestions */}
              <AnimatePresence>
                {showStopDropdown && stopSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <div className="max-h-48 overflow-y-auto">
                      {stopSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors flex items-center justify-between border-b border-border/30 last:border-b-0"
                          onClick={() => handleAddStop(suggestion)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground">{suggestion.region}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {suggestion.type === "port" ? "Port" : "City"}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Transport Mode Dropdown */}
          <div className="md:col-span-2 md:max-w-[180px] space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Transport Mode
            </label>
            <Select value={transportMode} onValueChange={setTransportMode}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    <div className="flex items-center gap-2">
                      <mode.icon className="h-4 w-4" />
                      <span>{mode.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Analyze Button */}
          <div className="md:col-span-2 md:pb-0">
            <Button
              onClick={handleAnalyze}
              disabled={!isValid || isLoading}
              className="w-full md:w-auto gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyze Route
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RouteEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="rounded-full bg-secondary p-4 mb-4">
        <MapPin className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">
        Enter a route to analyze risks
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Select an origin, destination, and transport mode above to view risk analytics, delay predictions, and AI-powered recommendations.
      </p>
    </motion.div>
  )
}
