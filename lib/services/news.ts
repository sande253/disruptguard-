// NewsAPI Service for route-related alerts and disruptions
export interface NewsAlert {
  id: string
  title: string
  description: string
  source: string
  timestamp: string
  severity: 'critical' | 'warning' | 'info'
  relevance: number // 0-1, how relevant to logistics
}

export async function getRouteNews(
  location: string,
  keywords: string[] = ['accident', 'traffic', 'road', 'highway', 'disruption']
): Promise<NewsAlert[]> {
  try {
    const apiKey = process.env.NEWSAPI_KEY
    if (!apiKey) {
      console.warn('NewsAPI key not configured')
      return []
    }

    const searchQuery = `${location} (${keywords.join(' OR ')})`
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`,
      { cache: 'no-store' }
    )

    if (!response.ok) throw new Error('News API failed')
    
    const data = await response.json()
    
    if (!data.articles || data.articles.length === 0) {
      return []
    }

    return data.articles.slice(0, 5).map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title,
      description: article.description || article.content,
      source: article.source.name,
      timestamp: article.publishedAt,
      severity: calculateSeverity(article.title + ' ' + (article.description || '')),
      relevance: calculateRelevance(article.title + ' ' + (article.description || ''), keywords),
    }))
  } catch (error) {
    console.error('News error:', error)
    return []
  }
}

function calculateSeverity(content: string): 'critical' | 'warning' | 'info' {
  const criticalKeywords = ['accident', 'collision', 'crash', 'closure', 'blocked', 'severe']
  const warningKeywords = ['delay', 'congestion', 'heavy', 'traffic', 'incident']

  const contentLower = content.toLowerCase()
  if (criticalKeywords.some(keyword => contentLower.includes(keyword))) return 'critical'
  if (warningKeywords.some(keyword => contentLower.includes(keyword))) return 'warning'
  return 'info'
}

function calculateRelevance(content: string, keywords: string[]): number {
  const contentLower = content.toLowerCase()
  const matches = keywords.filter(keyword => contentLower.includes(keyword.toLowerCase())).length
  return Math.min(matches / keywords.length, 1)
}
