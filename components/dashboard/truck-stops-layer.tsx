"use client"

import { useEffect, useState } from "react"
import { Fuel, MapPin } from "lucide-react"

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

// Mock truck stops across India (Highway routes)
export const TRUCK_STOPS: TruckStop[] = [
  {
    id: "ts-1",
    name: "Oasis Truck Stop - Hyderabad",
    latitude: 17.3850,
    longitude: 78.4867,
    type: "rest",
    amenities: ["Parking", "Restaurant", "Toilets", "WiFi"],
    rating: 4.2,
  },
  {
    id: "ts-2",
    name: "NH-44 Service Center - Kurnool",
    latitude: 15.8242,
    longitude: 78.1348,
    type: "service",
    amenities: ["Mechanic", "Fuel", "Food", "Lodging"],
    rating: 4.5,
  },
  {
    id: "ts-3",
    name: "Chennai Port Truck Stop",
    latitude: 13.1939,
    longitude: 80.2822,
    type: "rest",
    amenities: ["Parking", "Restaurant", "Customs"],
    rating: 4.1,
  },
  {
    id: "ts-4",
    name: "NH-65 Travel Plaza - Nellore",
    latitude: 14.4426,
    longitude: 79.9864,
    type: "rest",
    amenities: ["Restaurant", "Parking", "ATM", "Shower"],
    rating: 4.3,
  },
  {
    id: "ts-5",
    name: "Vijayawada Truck Park",
    latitude: 16.5062,
    longitude: 80.6480,
    type: "rest",
    amenities: ["Parking", "Food Court", "Lodging"],
    rating: 4.0,
  },
]

// Mock fuel pumps across India
export const FUEL_PUMPS: FuelPump[] = [
  {
    id: "fp-1",
    name: "Indian Oil - Hyderabad Main",
    latitude: 17.3850,
    longitude: 78.4867,
    fuelTypes: ["Petrol", "Diesel", "CNG"],
    pricePerLiter: 102.5,
    openNow: true,
  },
  {
    id: "fp-2",
    name: "Bharat Petroleum - Kurnool",
    latitude: 15.8242,
    longitude: 78.1348,
    fuelTypes: ["Diesel", "Petrol"],
    pricePerLiter: 98.2,
    openNow: true,
  },
  {
    id: "fp-3",
    name: "Shell Fuel Station - Nellore",
    latitude: 14.4426,
    longitude: 79.9864,
    fuelTypes: ["Petrol", "Diesel", "Premium"],
    pricePerLiter: 105.0,
    openNow: true,
  },
  {
    id: "fp-4",
    name: "Indian Oil - Vijayawada",
    latitude: 16.5062,
    longitude: 80.6480,
    fuelTypes: ["Diesel", "Petrol"],
    pricePerLiter: 99.8,
    openNow: false,
  },
  {
    id: "fp-5",
    name: "HP Fuel - Chennai",
    latitude: 13.1939,
    longitude: 80.2822,
    fuelTypes: ["Petrol", "Diesel"],
    pricePerLiter: 103.2,
    openNow: true,
  },
]

export function useTruckStopsLayer() {
  const [visibleStops, setVisibleStops] = useState<TruckStop[]>(TRUCK_STOPS)
  const [visiblePumps, setVisiblePumps] = useState<FuelPump[]>(FUEL_PUMPS)
  const [showTruckStops, setShowTruckStops] = useState(true)
  const [showFuelPumps, setShowFuelPumps] = useState(true)

  useEffect(() => {
    if (showTruckStops) {
      setVisibleStops(TRUCK_STOPS)
    } else {
      setVisibleStops([])
    }
  }, [showTruckStops])

  useEffect(() => {
    if (showFuelPumps) {
      setVisiblePumps(FUEL_PUMPS)
    } else {
      setVisiblePumps([])
    }
  }, [showFuelPumps])

  return {
    visibleStops,
    visiblePumps,
    showTruckStops,
    setShowTruckStops,
    showFuelPumps,
    setShowFuelPumps,
  }
}
