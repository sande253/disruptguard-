"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Route, CloudRain, Clock, Truck, AlertTriangle } from "lucide-react"

const routes = [
  { id: "hyd-che", name: "Hyderabad → Chennai", distance: "630 km" },
  { id: "mum-del", name: "Mumbai → Delhi", distance: "1,420 km" },
  { id: "ban-pun", name: "Bangalore → Pune", distance: "840 km" },
  { id: "kol-che", name: "Kolkata → Chennai", distance: "1,660 km" },
  { id: "del-jai", name: "Delhi → Jaipur", distance: "280 km" },
]

interface SimulationInputsProps {
  selectedRoute: string
  onRouteChange: (route: string) => void
  weatherSeverity: number
  onWeatherChange: (value: number) => void
  delayHours: number
  onDelayChange: (value: number) => void
  transportMode: string
  onTransportChange: (mode: string) => void
  disruptionType: string
  onDisruptionTypeChange: (type: string) => void
}

export function SimulationInputs({
  selectedRoute,
  onRouteChange,
  weatherSeverity,
  onWeatherChange,
  delayHours,
  onDelayChange,
  transportMode,
  onTransportChange,
  disruptionType,
  onDisruptionTypeChange,
}: SimulationInputsProps) {
  const getWeatherLabel = (value: number) => {
    if (value <= 25) return "Clear"
    if (value <= 50) return "Moderate"
    if (value <= 75) return "Severe"
    return "Extreme"
  }

  const getWeatherColor = (value: number) => {
    if (value <= 25) return "text-risk-low"
    if (value <= 50) return "text-chart-2"
    if (value <= 75) return "text-risk-moderate"
    return "text-risk-high"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            Scenario Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Route className="h-4 w-4 text-muted-foreground" />
              Select Route
            </Label>
            <Select value={selectedRoute} onValueChange={onRouteChange}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Choose a route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{route.name}</span>
                      <span className="text-xs text-muted-foreground">{route.distance}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Disruption Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Disruption Type
            </Label>
            <Select value={disruptionType} onValueChange={onDisruptionTypeChange}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select disruption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weather">Weather Event</SelectItem>
                <SelectItem value="infrastructure">Infrastructure Failure</SelectItem>
                <SelectItem value="supplier">Supplier Delay</SelectItem>
                <SelectItem value="demand">Demand Surge</SelectItem>
                <SelectItem value="port">Port Congestion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weather Severity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                Weather Severity
              </Label>
              <span className={`text-sm font-medium ${getWeatherColor(weatherSeverity)}`}>
                {getWeatherLabel(weatherSeverity)}
              </span>
            </div>
            <Slider
              value={[weatherSeverity]}
              onValueChange={(value) => onWeatherChange(value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Clear</span>
              <span>Moderate</span>
              <span>Severe</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Delay Assumption */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Assumed Delay
              </Label>
              <span className="text-sm font-medium text-foreground">
                {delayHours} hours
              </span>
            </div>
            <Slider
              value={[delayHours]}
              onValueChange={(value) => onDelayChange(value[0])}
              max={72}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>24h</span>
              <span>48h</span>
              <span>72h</span>
            </div>
          </div>

          {/* Transport Mode */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              Transport Mode
            </Label>
            <Select value={transportMode} onValueChange={onTransportChange}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="road">Road Freight</SelectItem>
                <SelectItem value="rail">Rail Freight</SelectItem>
                <SelectItem value="air">Air Cargo</SelectItem>
                <SelectItem value="multimodal">Multimodal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
