// Mapbox Routing Service
export interface Route {
  distance: number // meters
  duration: number // seconds
  geometry: Array<[number, number]>
  instructions: string
}

export async function getRoute(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number,
  profile: 'driving' | 'driving-traffic' = 'driving'
): Promise<Route | null> {
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) throw new Error('Mapbox token not configured')

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLng},${startLat};${endLng},${endLat}?access_token=${token}&geometries=geojson&steps=true&bannerInstructions=true&language=en&overview=full`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('Routing failed')
    
    const data = await response.json()
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      return {
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry.coordinates,
        instructions: route.legs[0]?.steps?.map((s: any) => s.maneuver?.instruction).join('. ') || '',
      }
    }
    return null
  } catch (error) {
    console.error('Routing error:', error)
    return null
  }
}

// Get distance matrix for multiple points
export async function getDistanceMatrix(
  origins: Array<[number, number]>,
  destinations: Array<[number, number]>
): Promise<number[][] | null> {
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) throw new Error('Mapbox token not configured')

    const coordinatesStr = [...origins, ...destinations]
      .map(coord => `${coord[0]},${coord[1]}`)
      .join(';')

    const response = await fetch(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinatesStr}?access_token=${token}`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('Distance matrix failed')
    
    const data = await response.json()
    return data.distances || null
  } catch (error) {
    console.error('Distance matrix error:', error)
    return null
  }
}
