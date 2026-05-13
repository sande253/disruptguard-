"use server"

import { cache } from "react"

export interface LiveAlert {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  source: "Weather" | "Traffic"
  timestamp: string
  affectsRoute: boolean
  impact?: string
  location?: string
  latitude?: number
  longitude?: number
}

// Fetch live weather alerts from OpenWeatherMap
async function fetchWeatherData(): Promise<LiveAlert[]> {
  try {
    // Using free weather data - in production use paid API for real-time alerts
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=15.2993&longitude=86.9789&current=weather_code,wind_speed&alerts=true",
      { cache: "no-store" }
    )
    const data = await response.json()
    
    const alerts: LiveAlert[] = []
    if (data.weather_code && data.weather_code > 50) {
      alerts.push({
        id: `weather-${Date.now()}`,
        title: "Severe Weather Alert",
        severity: data.weather_code > 80 ? "critical" : "warning",
        source: "Weather",
        timestamp: new Date().toISOString(),
        affectsRoute: true,
        impact: "May affect route conditions",
        location: "Bay of Bengal",
        latitude: 15.2993,
        longitude: 86.9789,
      })
    }
    return alerts
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return []
  }
}

// Fetch real traffic data from TomTom or similar service
async function fetchTrafficData(): Promise<LiveAlert[]> {
  try {
    // Note: TomTom requires API key. This is a placeholder structure
    // In production, add your TomTom API key to environment variables
    const apiKey = process.env.TOMTOM_API_KEY
    
    if (!apiKey) {
      console.warn("TomTom API key not configured")
      return []
    }

    const routes = [
      { name: "NH-44", lat: 15.8242, lng: 78.1348 },
      { name: "NH-65", lat: 14.4426, lng: 79.8789 },
    ]

    const alerts: LiveAlert[] = []
    
    for (const route of routes) {
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowTile/json?key=${apiKey}&zoom=15&x=&y=`,
        { cache: "no-store" }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.flowSegmentData && data.flowSegmentData.length > 0) {
          const segment = data.flowSegmentData[0]
          if (segment.currentSpeed < segment.freeFlowSpeed * 0.5) {
            alerts.push({
              id: `traffic-${Date.now()}`,
              title: `Heavy Traffic on ${route.name}`,
              severity: "critical",
              source: "Traffic",
              timestamp: new Date().toISOString(),
              affectsRoute: true,
              impact: "May cause delays",
              location: route.name,
              latitude: route.lat,
              longitude: route.lng,
            })
          }
        }
      }
    }
    return alerts
  } catch (error) {
    console.error("Error fetching traffic data:", error)
    return []
  }
}

// Fetch news from NewsAPI
async function fetchNewsData(): Promise<LiveAlert[]> {
  return [] // Only weather and traffic alerts - news disabled
}

// Main function to fetch all live alerts - weather and traffic only
export const fetchLiveAlerts = cache(async (): Promise<LiveAlert[]> => {
  try {
    const [weatherAlerts, trafficAlerts] = await Promise.all([
      fetchWeatherData(),
      fetchTrafficData(),
    ])

    const allAlerts = [...weatherAlerts, ...trafficAlerts]
    return allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Error fetching live alerts:", error)
    return []
  }
})
