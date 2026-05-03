"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, ArrowRight, Loader2, Truck, Train, Ship } from "lucide-react"
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

interface RouteInputPanelProps {
  onAnalyze: (source: string, destination: string, mode: string) => void
  isLoading: boolean
}

const transportModes = [
  { value: "road", label: "Road", icon: Truck },
  { value: "rail", label: "Rail", icon: Train },
  { value: "sea", label: "Sea", icon: Ship },
]

export function RouteInputPanel({ onAnalyze, isLoading }: RouteInputPanelProps) {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [transportMode, setTransportMode] = useState("")

  const handleAnalyze = () => {
    if (source && destination && transportMode) {
      onAnalyze(source, destination, transportMode)
    }
  }

  const isValid = source.trim() !== "" && destination.trim() !== "" && transportMode !== ""

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Source Input */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Origin
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter origin city"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
          </div>

          {/* Arrow indicator (desktop only) */}
          <div className="hidden md:flex items-center justify-center pb-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Destination Input */}
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <Input
                placeholder="Enter destination city"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
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
