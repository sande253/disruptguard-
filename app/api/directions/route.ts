import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coordinates } = body // Array of [lng, lat] pairs

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error("[v0] Mapbox token not configured")
      return NextResponse.json({ error: "Mapbox not configured" }, { status: 500 })
    }

    // Build coordinate string for Mapbox API
    const coordString = coordinates.map((c: [number, number]) => `${c[0]},${c[1]}`).join(";")

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?access_token=${token}&overview=full&geometries=geojson`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error(`[v0] Mapbox API error: ${response.status}`)
      throw new Error(`Mapbox API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: "No route found" }, { status: 400 })
    }

    const route = data.routes[0]
    
    return NextResponse.json({
      coordinates: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
    })
  } catch (error: any) {
    console.error("[v0] Directions API error:", error?.message || error)
    return NextResponse.json({ error: "Routing failed" }, { status: 500 })
  }
}
