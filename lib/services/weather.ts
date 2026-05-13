// OpenWeather API Service for real-time weather alerts
export interface WeatherAlert {
  id: string
  event: string
  start: number
  end: number
  description: string
  severity: 'low' | 'moderate' | 'high' | 'severe'
}

export interface WeatherData {
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  visibility: number
  alerts: WeatherAlert[]
}

export async function getWeatherAlerts(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn('OpenWeather API key not configured')
      return null
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('Weather API failed')
    
    const data = await response.json()
    
    // Parse alerts if available
    const alerts: WeatherAlert[] = []
    if (data.alerts && Array.isArray(data.alerts)) {
      data.alerts.forEach((alert: any, index: number) => {
        alerts.push({
          id: `weather-${index}`,
          event: alert.event,
          start: alert.start,
          end: alert.end,
          description: alert.description || '',
          severity: getSeverity(alert.event),
        })
      })
    }

    return {
      temperature: data.main.temp,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      visibility: data.visibility / 1000, // convert to km
      alerts,
    }
  } catch (error) {
    console.error('Weather error:', error)
    return null
  }
}

// Get forecast data
export async function getWeatherForecast(lat: number, lon: number): Promise<any[] | null> {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) return null

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('Forecast API failed')
    
    const data = await response.json()
    return data.list || null
  } catch (error) {
    console.error('Forecast error:', error)
    return null
  }
}

function getSeverity(event: string): 'low' | 'moderate' | 'high' | 'severe' {
  const severe = ['Tornado', 'Extreme', 'Severe', 'Hurricane']
  const high = ['Storm', 'Wind', 'Heavy', 'Thunderstorm']
  const moderate = ['Rain', 'Snow', 'Fog']

  if (severe.some(word => event.includes(word))) return 'severe'
  if (high.some(word => event.includes(word))) return 'high'
  if (moderate.some(word => event.includes(word))) return 'moderate'
  return 'low'
}
