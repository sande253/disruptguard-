"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RouteInputPanel, RouteEmptyState } from "@/components/dashboard/route-input-panel"
import { IndiaRouteMap } from "@/components/dashboard/india-route-map"
import { RiskSummaryCard } from "@/components/dashboard/risk-summary-card"
import { AlertsCompact } from "@/components/dashboard/alerts-compact"
import { AICompact } from "@/components/dashboard/ai-compact"
import { RiskForecastChart } from "@/components/dashboard/risk-forecast-chart"
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
            Supply Chain Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time risk monitoring and predictive analytics for India logistics
          </p>
        </div>

        {/* Route Input Panel - Always at top */}
        <RouteInputPanel onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

        {/* Show empty state or dashboard content */}
        {!hasAnalyzed ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RouteEmptyState />
          </div>
        ) : (
          <>
            {/* Route info banner */}
            {route && (
              <div className="text-sm text-muted-foreground">
                Analyzing: <span className="font-medium text-foreground">{route.origin}</span> → <span className="font-medium text-foreground">{route.destination}</span> via <span className="capitalize text-foreground">{route.mode}</span>
              </div>
            )}

            {/* MAIN SECTION: 2-column layout - Map (65%) + Decision Panel (35%) */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* LEFT: Large Route Map - Primary Focus */}
              <div className="lg:col-span-8">
                <IndiaRouteMap 
                  source={route?.origin ?? null} 
                  destination={route?.destination ?? null} 
                  isLoading={isAnalyzing}
                />
              </div>

              {/* RIGHT: Decision Stack */}
              <div className="lg:col-span-4 space-y-4">
                {/* A. Risk Summary Card */}
                <RiskSummaryCard />

                {/* B. Compact Alerts (Top 5) */}
                <AlertsCompact />

                {/* C. AI Quick Actions */}
                <AICompact />
              </div>
            </div>

            {/* FORECAST SECTION: Full-width below main grid */}
            <div className="pt-2">
              <RiskForecastChart />
            </div>

            {/* TERTIARY: Supplier Table - Collapsed by default or smaller */}
            <div className="pt-2">
              <SupplierTable />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
