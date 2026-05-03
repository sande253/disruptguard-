"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface RouteData {
  origin: string
  destination: string
  mode: "Road" | "Rail" | "Sea"
}

interface RouteContextType {
  route: RouteData | null
  isAnalyzing: boolean
  hasAnalyzed: boolean
  setRoute: (route: RouteData) => void
  analyzeRoute: (origin: string, destination: string, mode: "Road" | "Rail" | "Sea") => void
  clearRoute: () => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [route, setRouteState] = useState<RouteData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const setRoute = (newRoute: RouteData) => {
    setRouteState(newRoute)
    setHasAnalyzed(true)
  }

  const analyzeRoute = (origin: string, destination: string, mode: "Road" | "Rail" | "Sea") => {
    setIsAnalyzing(true)
    // Clear previous data while loading
    setHasAnalyzed(false)
    
    // Simulate API call
    setTimeout(() => {
      setRouteState({ origin, destination, mode })
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 1500)
  }

  const clearRoute = () => {
    setRouteState(null)
    setHasAnalyzed(false)
  }

  return (
    <RouteContext.Provider value={{ 
      route, 
      isAnalyzing, 
      hasAnalyzed, 
      setRoute, 
      analyzeRoute, 
      clearRoute 
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
