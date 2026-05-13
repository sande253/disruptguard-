import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 1) {
    return NextResponse.json([])
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=json&limit=50&addressdetails=1`,
      {
        headers: { 
          "Accept-Language": "en",
          "User-Agent": "DisruptGuard-App/1.0"
        },
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`[v0] Nominatim returned ${response.status}`)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error("[v0] Nominatim returned non-array response")
      return NextResponse.json([])
    }

    const results = data
      .filter((result: any) => result.lat && result.lon)
      .map((result: any) => ({
        name: result.name || result.display_name.split(",")[0],
        region: result.address?.state || result.address?.province || "India",
        type: result.type === "port" || result.type === "harbour" ? "port" : "city",
        category: "recent",
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      }))

    console.log(`[v0] Geocoding returned ${results.length} results for "${query}"`)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("[v0] Geocoding API error:", error?.message || error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of 500
  }
}
