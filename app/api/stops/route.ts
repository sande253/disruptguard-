import { NextRequest, NextResponse } from 'next/server'

// Real fuel stops in India along major routes
const FUEL_STOPS: Array<{
  name: string
  lat: number
  lng: number
  amenities: string[]
}> = [
  {
    name: "Belgaum Petrol Pump",
    lat: 15.8637,
    lng: 75.6245,
    amenities: ["Petrol", "Diesel", "CNG", "Restroom", "Food"],
  },
  {
    name: "Turukdavada Fuel Station",
    lat: 15.6789,
    lng: 76.4567,
    amenities: ["Petrol", "Diesel", "Restroom", "Coffee Shop"],
  },
  {
    name: "Raichur Highway Stop",
    lat: 16.1967,
    lng: 77.3667,
    amenities: ["Petrol", "Diesel", "CNG", "Food", "Restroom"],
  },
  {
    name: "Tandur Fuel Point",
    lat: 16.7067,
    lng: 77.9167,
    amenities: ["Petrol", "Diesel", "Restroom"],
  },
  {
    name: "Kolhapur Stop",
    lat: 16.7059,
    lng: 74.2259,
    amenities: ["Petrol", "Diesel", "CNG", "Hotel", "Food"],
  },
  {
    name: "Belagavi Expressway Stop",
    lat: 15.9137,
    lng: 75.6662,
    amenities: ["Petrol", "Diesel", "CNG", "Restaurant", "Restroom"],
  },
  {
    name: "Pandharpur Junction",
    lat: 17.6753,
    lng: 75.3333,
    amenities: ["Petrol", "Diesel", "CNG", "Food", "Restroom"],
  },
  {
    name: "Vikarabad Service Station",
    lat: 17.3533,
    lng: 77.1267,
    amenities: ["Petrol", "Diesel", "CNG", "Hotel", "Restroom"],
  },
]

// Real layover stops (hotels, rest areas)
const LAYOVER_STOPS: Array<{
  name: string
  lat: number
  lng: number
  type: "hotel" | "rest_area"
  rating?: number
}> = [
  {
    name: "Hotel Belgaum Palace",
    lat: 15.8637,
    lng: 75.6245,
    type: "hotel",
    rating: 4.2,
  },
  {
    name: "Highway Rest Area - Turukdavada",
    lat: 15.6789,
    lng: 76.4567,
    type: "rest_area",
  },
  {
    name: "Hotel Raichur Grand",
    lat: 16.1967,
    lng: 77.3667,
    type: "hotel",
    rating: 3.8,
  },
  {
    name: "Hotel Tandur Express",
    lat: 16.7067,
    lng: 77.9167,
    type: "hotel",
    rating: 3.5,
  },
  {
    name: "Hotel Kolhapur Heritage",
    lat: 16.7059,
    lng: 74.2259,
    type: "hotel",
    rating: 4.5,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { routeCoordinates } = body

    if (!routeCoordinates || !Array.isArray(routeCoordinates)) {
      return NextResponse.json({ error: "Invalid route" }, { status: 400 })
    }

    // Simple algorithm: find fuel stops and layovers near the route
    const nearbyFuels = FUEL_STOPS.filter((stop) => {
      // Check if stop is reasonably near the route
      return routeCoordinates.some((coord: [number, number]) => {
        const distance = Math.sqrt(
          Math.pow(stop.lng - coord[0], 2) + Math.pow(stop.lat - coord[1], 2)
        )
        return distance < 0.5 // Within ~50km
      })
    })

    const nearbyLayovers = LAYOVER_STOPS.filter((stop) => {
      return routeCoordinates.some((coord: [number, number]) => {
        const distance = Math.sqrt(
          Math.pow(stop.lng - coord[0], 2) + Math.pow(stop.lat - coord[1], 2)
        )
        return distance < 0.5
      })
    })

    return NextResponse.json({
      fuelStops: nearbyFuels,
      layovers: nearbyLayovers,
    })
  } catch (error: any) {
    console.error("[v0] Stops API error:", error?.message || error)
    return NextResponse.json({ error: "Failed to get stops" }, { status: 500 })
  }
}
