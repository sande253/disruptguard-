"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type OptimizationMode = "balanced" | "fastest" | "lowest-risk" | "cheapest"

export interface RouteData {
  origin: string
  destination: string
  mode: "Road" | "Rail" | "Sea"
  stops?: Array<{ name: string; lat: number; lng: number }>
}

export interface OptimizedMetrics {
  delayProbability: number
  expectedDelay: string
  estimatedCost: string
  estimatedTime: string
  riskReduction: number
}

// Mock data for different optimization modes
const optimizationMetrics: Record<OptimizationMode, OptimizedMetrics> = {
  balanced: {
    delayProbability: 64,
    expectedDelay: "6-10 hours",
    estimatedCost: "₹45,000",
    estimatedTime: "14 hrs",
    riskReduction: 0,
  },
  fastest: {
    delayProbability: 78,
    expectedDelay: "2-4 hours",
    estimatedCost: "₹62,000",
    estimatedTime: "9 hrs",
    riskReduction: -22,
  },
  "lowest-risk": {
    delayProbability: 28,
    expectedDelay: "1-2 hours",
    estimatedCost: "₹58,000",
    estimatedTime: "18 hrs",
    riskReduction: 56,
  },
  cheapest: {
    delayProbability: 52,
    expectedDelay: "8-12 hours",
    estimatedCost: "₹32,000",
    estimatedTime: "22 hrs",
    riskReduction: 19,
  },
}

interface RouteContextType {
  route: RouteData | null
  isAnalyzing: boolean
  hasAnalyzed: boolean
  optimizationMode: OptimizationMode
  metrics: OptimizedMetrics
  setRoute: (route: RouteData) => void
  analyzeRoute: (origin: string, destination: string, mode: "Road" | "Rail" | "Sea", stops?: Array<{ name: string; lat: number; lng: number }>) => void
  clearRoute: () => void
  setOptimizationMode: (mode: OptimizationMode) => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [route, setRouteState] = useState<RouteData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [optimizationMode, setOptimizationModeState] = useState<OptimizationMode>("balanced")

  const metrics = optimizationMetrics[optimizationMode]

  const setRoute = (newRoute: RouteData) => {
    setRouteState(newRoute)
    setHasAnalyzed(true)
  }

  const analyzeRoute = (origin: string, destination: string, mode: "Road" | "Rail" | "Sea", stops?: Array<{ name: string; lat: number; lng: number }>) => {
    setIsAnalyzing(true)
    // Clear previous data while loading
    setHasAnalyzed(false)
    
    // Simulate API call
    setTimeout(() => {
      setRouteState({ origin, destination, mode, stops })
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 1500)
  }

  const clearRoute = () => {
    setRouteState(null)
    setHasAnalyzed(false)
    setOptimizationModeState("balanced")
  }

  const setOptimizationMode = (mode: OptimizationMode) => {
    setOptimizationModeState(mode)
  }

  return (
    <RouteContext.Provider value={{ 
      route, 
      isAnalyzing, 
      hasAnalyzed, 
      optimizationMode,
      metrics,
      setRoute, 
      analyzeRoute, 
      clearRoute,
      setOptimizationMode,
    }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider")
  }
  return context
}

// Helper to format route display
export function formatRoute(route: RouteData | null): string {
  if (!route) return ""
  return `${route.origin} → ${route.destination}`
}
