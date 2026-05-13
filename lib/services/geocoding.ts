// OpenStreetMap Nominatim Geocoding - No API key required, completely free
export interface Place {
  id: number
  name: string
  latitude: number
  longitude: number
  address: string
  type: string
}

export async function geocodeAddress(query: string): Promise<Place[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) throw new Error('Geocoding failed')
    
    const data = await response.json()
    return data.map((item: any) => ({
      id: item.osm_id,
      name: item.name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
      type: item.type,
    }))
  } catch (error) {
    console.error('Geocoding error:', error)
    return []
  }
}

// Reverse geocoding - get address from coordinates
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) throw new Error('Reverse geocoding failed')
    
    const data = await response.json()
    return data.address?.city || data.address?.town || data.display_name || 'Unknown location'
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return 'Unknown location'
  }
}

// Autocomplete suggestions using Nominatim
export async function getAutocompleteSuggestions(query: string): Promise<Place[]> {
  if (query.length < 2) return []
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&countrycodes=in&featuretype=settlement`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) throw new Error('Autocomplete failed')
    
    const data = await response.json()
    return data.slice(0, 5).map((item: any) => ({
      id: item.osm_id,
      name: item.name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
      type: item.type,
    }))
  } catch (error) {
    console.error('Autocomplete error:', error)
    return []
  }
}
