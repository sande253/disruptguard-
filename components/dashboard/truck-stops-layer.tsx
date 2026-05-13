"use client"

import { useEffect, useState } from "react"

export interface TruckStop {
  id: string
  name: string
  latitude: number
  longitude: number
  type: "fuel" | "rest" | "service"
  amenities: string[]
  rating: number
  distance?: number
}

export interface FuelPump {
  id: string
  name: string
  latitude: number
  longitude: number
  fuelTypes: string[]
  pricePerLiter: number
  openNow: boolean
}

// Fetch real truck stops and fuel pumps from Google Places API
async function fetchTruckStops(centerLat: number, centerLng: number): Promise<TruckStop[]> {
  try {
    // Using Open Street Map/Nominatim for truck stop data
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=[bbox:${centerLat - 2},${centerLng - 2},${centerLat + 2},${centerLng + 2}];(node["amenity"="truck_stop"];way["amenity"="truck_stop"];relation["amenity"="truck_stop"];);out center;`,
      { next: { revalidate: 3600 } }
    )
    
    if (!response.ok) throw new Error("Failed to fetch truck stops")
    
    const data = await response.json()
    
    return (data.elements || [])
      .filter((el: any) => el.lat && el.lon)
      .map((el: any, idx: number) => ({
        id: `ts-${el.id || idx}`,
        name: el.tags?.name || "Truck Stop",
        latitude: el.lat,
        longitude: el.lon,
        type: "rest" as const,
        amenities: el.tags?.amenities ? el.tags.amenities.split(";") : ["Parking", "Rest Area"],
        rating: 4.0,
      }))
  } catch (error) {
    console.error("Error fetching truck stops:", error)
    return []
  }
}

// Fetch real fuel pump locations from Google Places or OpenStreetMap
async function fetchFuelPumps(centerLat: number, centerLng: number): Promise<FuelPump[]> {
  try {
    // Using Overpass API for fuel station data
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=[bbox:${centerLat - 2},${centerLng - 2},${centerLat + 2},${centerLng + 2}];(node["amenity"="fuel"];way["amenity"="fuel"];relation["amenity"="fuel"];);out center;`,
      { next: { revalidate: 3600 } }
    )
    
    if (!response.ok) throw new Error("Failed to fetch fuel pumps")
    
    const data = await response.json()
    
    return (data.elements || [])
      .filter((el: any) => el.lat && el.lon)
      .slice(0, 10)
      .map((el: any, idx: number) => ({
        id: `fp-${el.id || idx}`,
        name: el.tags?.name || "Fuel Station",
        latitude: el.lat,
        longitude: el.lon,
        fuelTypes: el.tags?.fuel ? el.tags.fuel.split(";") : ["Diesel", "Petrol"],
        pricePerLiter: Math.random() * (105 - 95) + 95, // Random price between 95-105 INR
        openNow: true,
      }))
  } catch (error) {
    console.error("Error fetching fuel pumps:", error)
    return []
  }
}

export function useTruckStopsLayer(centerLat = 16.5, centerLng = 80) {
  const [visibleStops, setVisibleStops] = useState<TruckStop[]>([])
  const [visiblePumps, setVisiblePumps] = useState<FuelPump[]>([])
  const [showTruckStops, setShowTruckStops] = useState(false)
  const [showFuelPumps, setShowFuelPumps] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showTruckStops && visibleStops.length === 0) {
      setLoading(true)
      fetchTruckStops(centerLat, centerLng)
        .then(stops => {
          setVisibleStops(stops)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else if (!showTruckStops) {
      setVisibleStops([])
    }
  }, [showTruckStops, centerLat, centerLng])

  useEffect(() => {
    if (showFuelPumps && visiblePumps.length === 0) {
      setLoading(true)
      fetchFuelPumps(centerLat, centerLng)
        .then(pumps => {
          setVisiblePumps(pumps)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else if (!showFuelPumps) {
      setVisiblePumps([])
    }
  }, [showFuelPumps, centerLat, centerLng])

  return {
    visibleStops,
    visiblePumps,
    showTruckStops,
    setShowTruckStops,
    showFuelPumps,
    setShowFuelPumps,
    loading,
  }
}
