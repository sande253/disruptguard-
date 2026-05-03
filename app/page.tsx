"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RouteInputPanel, RouteEmptyState } from "@/components/dashboard/route-input-panel"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RiskForecastChart } from "@/components/dashboard/risk-forecast-chart"
import { RiskMap } from "@/components/dashboard/risk-map"
import { AlertsFeed } from "@/components/dashboard/alerts-feed"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { SupplierTable } from "@/components/dashboard/supplier-table"

export default function DashboardPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [currentRoute, setCurrentRoute] = useState<{ source: string; destination: string; mode: string } | null>(null)

  const handleAnalyze = (source: string, destination: string, mode: string) => {
    setIsAnalyzing(true)
    setCurrentRoute({ source, destination, mode })
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false)
      setHasAnalyzed(true)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">
            Supply Chain Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time risk monitoring and predictive analytics for India logistics
          </p>
        </div>

        {/* Route Input Panel */}
        <RouteInputPanel onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

        {/* Show empty state or dashboard content */}
        {!hasAnalyzed ? (
          <RouteEmptyState />
        ) : (
          <>
            {/* Route info banner */}
            {currentRoute && (
              <div className="text-sm text-muted-foreground">
                Showing risks for: <span className="font-medium text-foreground">{currentRoute.source}</span> → <span className="font-medium text-foreground">{currentRoute.destination}</span> via <span className="capitalize text-foreground">{currentRoute.mode}</span>
              </div>
            )}

            {/* KPI Cards */}
            <KPICards />

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Charts and Map */}
          <div className="lg:col-span-2 space-y-6">
            <RiskForecastChart />
            <RiskMap />
            <AIRecommendations />
          </div>

          {/* Right column - Alerts */}
          <div className="lg:col-span-1">
            <AlertsFeed />
          </div>
        </div>

        {/* Supplier Table */}
            <SupplierTable />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
