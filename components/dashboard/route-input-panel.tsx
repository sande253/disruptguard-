"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, ArrowRight, Loader2, Truck, Train, Ship, Clock, TrendingUp } from "lucide-react"
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
  onAnalyze: (source: string, destination: string, mode: string) => void
  isLoading: boolean
}

const transportModes = [
  { value: "road", label: "Road", icon: Truck },
  { value: "rail", label: "Rail", icon: Train },
  { value: "sea", label: "Sea", icon: Ship },
]

// Mock location suggestions
const allLocations = [
  { name: "Chennai", region: "Tamil Nadu", type: "port" },
  { name: "Delhi", region: "NCR", type: "city" },
  { name: "Mumbai", region: "Maharashtra", type: "port" },
  { name: "Bangalore", region: "Karnataka", type: "city" },
  { name: "Hyderabad", region: "Telangana", type: "city" },
  { name: "Kolkata", region: "West Bengal", type: "port" },
  { name: "Pune", region: "Maharashtra", type: "city" },
  { name: "Ahmedabad", region: "Gujarat", type: "city" },
  { name: "Surat", region: "Gujarat", type: "city" },
  { name: "Jaipur", region: "Rajasthan", type: "city" },
  { name: "Lucknow", region: "Uttar Pradesh", type: "city" },
  { name: "Kochi", region: "Kerala", type: "port" },
  { name: "Chandigarh", region: "Punjab", type: "city" },
  { name: "Coimbatore", region: "Tamil Nadu", type: "city" },
  { name: "Vizag", region: "Andhra Pradesh", type: "port" },
]

interface LocationSuggestion {
  name: string
  region: string
  type: "port" | "city"
  category: "recent" | "nearby" | "trending"
}

export function RouteInputPanel({ onAnalyze, isLoading }: RouteInputPanelProps) {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [transportMode, setTransportMode] = useState("")
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([])
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([])
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const sourceRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  // Get suggestions for source/destination
  const getSuggestions = (query: string): LocationSuggestion[] => {
    if (!query.trim()) {
      return [
        { name: "Chennai", region: "Tamil Nadu", type: "port", category: "recent" },
        { name: "Mumbai", region: "Maharashtra", type: "port", category: "recent" },
        { name: "Delhi", region: "NCR", type: "city", category: "trending" },
        { name: "Bangalore", region: "Karnataka", type: "city", category: "trending" },
      ]
    }

    const filtered = allLocations.filter(loc =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.region.toLowerCase().includes(query.toLowerCase())
    )

    return filtered.map(loc => ({
      ...loc,
      category: "recent" as const,
    }))
  }

  useEffect(() => {
    if (source) {
      setSourceSuggestions(getSuggestions(source))
      setShowSourceDropdown(true)
    } else {
      setShowSourceDropdown(false)
    }
  }, [source])

  useEffect(() => {
    if (destination) {
      setDestSuggestions(getSuggestions(destination))
      setShowDestDropdown(true)
    } else {
      setShowDestDropdown(false)
    }
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
      onAnalyze(source, destination, transportMode)
    }
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
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Source Input */}
          <div className="flex-1 space-y-1.5 relative" ref={sourceRef}>
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
          <div className="hidden md:flex items-center justify-center pb-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Destination Input */}
          <div className="flex-1 space-y-1.5 relative" ref={destRef}>
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

          {/* Transport Mode Dropdown */}
          <div className="flex-1 md:max-w-[180px] space-y-1.5">
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
          <div className="md:pb-0">
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
