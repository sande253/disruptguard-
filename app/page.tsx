"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RouteInputPanel, RouteEmptyState } from "@/components/dashboard/route-input-panel"
import { IndiaRouteMap } from "@/components/dashboard/india-route-map"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RiskForecastChart } from "@/components/dashboard/risk-forecast-chart"
import { RiskMap } from "@/components/dashboard/risk-map"
import { AlertsFeed } from "@/components/dashboard/alerts-feed"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { SupplierTable } from "@/components/dashboard/supplier-table"
import { useRoute } from "@/contexts/route-context"

export default function DashboardPage() {
  const { route, isAnalyzing, hasAnalyzed, analyzeRoute } = useRoute()

  const handleAnalyze = (source: string, destination: string, mode: string) => {
    analyzeRoute(source, destination, mode as "Road" | "Rail" | "Sea")
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

        {/* India Route Map */}
        <IndiaRouteMap 
          source={route?.origin ?? null} 
          destination={route?.destination ?? null} 
          isLoading={isAnalyzing}
        />

        {/* Show empty state or dashboard content */}
        {!hasAnalyzed ? (
          <RouteEmptyState />
        ) : (
          <>
            {/* Route info banner */}
            {route && (
              <div className="text-sm text-muted-foreground">
                Showing risks for: <span className="font-medium text-foreground">{route.origin}</span> → <span className="font-medium text-foreground">{route.destination}</span> via <span className="capitalize text-foreground">{route.mode}</span>
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
