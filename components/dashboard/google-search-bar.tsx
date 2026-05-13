"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Search, MapPin, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "location" | "recent" | "trending"
  icon: React.ReactNode
  value: string
}

interface GoogleSearchBarProps {
  onSearch?: (query: string, result?: SearchResult) => void
  onRouteSelect?: (origin: string, destination: string) => void
  placeholder?: string
}

export function GoogleSearchBar({
  onSearch,
  onRouteSelect,
  placeholder = "Search routes, locations, or shipments...",
}: GoogleSearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock suggestions data
  const trendingRoutes = [
    { id: "1", title: "Mumbai to Delhi", description: "Truck route • 1400 km", type: "trending" as const, value: "Mumbai to Delhi" },
    { id: "2", title: "Bangalore to Chennai", description: "Regular route • 350 km", type: "trending" as const, value: "Bangalore to Chennai" },
    { id: "3", title: "Pune to Hyderabad", description: "Highway route • 560 km", type: "trending" as const, value: "Pune to Hyderabad" },
  ]

  const recentSearches = [
    { id: "r1", title: "Delhi", description: "Recent search", type: "recent" as const, value: "Delhi" },
    { id: "r2", title: "Mumbai Port", description: "Recent location", type: "recent" as const, value: "Mumbai Port" },
  ]

  const majorCities = [
    { id: "c1", title: "Mumbai", description: "Major city • Western India", type: "location" as const, value: "Mumbai" },
    { id: "c2", title: "Delhi", description: "Major city • Northern India", type: "location" as const, value: "Delhi" },
    { id: "c3", title: "Bangalore", description: "Major city • Southern India", type: "location" as const, value: "Bangalore" },
    { id: "c4", title: "Chennai", description: "Major city • Eastern India", type: "location" as const, value: "Chennai" },
    { id: "c5", title: "Hyderabad", description: "Major city • Central India", type: "location" as const, value: "Hyderabad" },
  ]

  // Handle search input and fetch suggestions
  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value)
      
      if (!value.trim()) {
        setResults([])
        setIsOpen(true)
        return
      }

      setLoading(true)
      setIsOpen(true)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const filtered = [...majorCities, ...trendingRoutes, ...recentSearches].filter(
        result =>
          result.title.toLowerCase().includes(value.toLowerCase()) ||
          result.description.toLowerCase().includes(value.toLowerCase())
      )

      setResults(filtered)
      setLoading(false)
    },
    []
  )

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.value)
    onSearch?.(result.value, result)
    setIsOpen(false)
  }

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="h-4 w-4 text-blue-400" />
      case "trending":
        return <TrendingUp className="h-4 w-4 text-orange-400" />
      case "recent":
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <Search className="h-4 w-4 text-gray-400" />
    }
  }

  // Display initial suggestions when empty
  const displayResults =
    query.trim() === "" && isOpen
      ? [...recentSearches.slice(0, 2), ...trendingRoutes.slice(0, 3)]
      : results

  const groupedResults = {
    locations: displayResults.filter(r => r.type === "location"),
    trending: displayResults.filter(r => r.type === "trending"),
    recent: displayResults.filter(r => r.type === "recent"),
  }

  return (
    <div ref={searchRef} className="w-full">
      <div className="relative">
        {/* Search Bar */}
        <div className="relative bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-slate-700">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          <Input
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-12 pr-4 py-3 rounded-full border-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("")
                setResults([])
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 z-50 max-h-96 overflow-y-auto"
            >
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mb-2" />
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              ) : displayResults.length === 0 && query.trim() !== "" ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                  {/* Recent Searches */}
                  {groupedResults.recent.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800">
                        Recent
                      </div>
                      {groupedResults.recent.map(result => (
                        <motion.button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                        >
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{result.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Locations */}
                  {groupedResults.locations.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800">
                        Locations
                      </div>
                      {groupedResults.locations.map(result => (
                        <motion.button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                        >
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{result.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Trending Routes */}
                  {groupedResults.trending.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-slate-800">
                        Trending Routes
                      </div>
                      {groupedResults.trending.map(result => (
                        <motion.button
                          key={result.id}
                          onClick={() => handleSelectResult(result)}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                        >
                          {getResultIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{result.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setQuery("")
                          setIsOpen(false)
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          if (query) {
                            onSearch?.(query)
                            setIsOpen(false)
                          }
                        }}
                      >
                        Search <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
