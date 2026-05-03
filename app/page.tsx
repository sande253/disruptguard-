"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RouteInputPanel, RouteEmptyState } from "@/components/dashboard/route-input-panel"
import { IndiaRouteMap } from "@/components/dashboard/india-route-map"
import { DecisionInsightCard } from "@/components/dashboard/decision-insight-card"
import { AlertsCompact } from "@/components/dashboard/alerts-compact"
import { AICompact } from "@/components/dashboard/ai-compact"
import { TimelineInsight } from "@/components/dashboard/timeline-insight"
import { ScenarioComparison } from "@/components/dashboard/scenario-comparison"
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
            Supply Chain Decision Center
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered risk intelligence and decision support for India logistics
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
            {/* 1. DECISION SUMMARY - Top Priority */}
            <DecisionInsightCard />

            {/* 2. MAIN SECTION: Map + Intelligence Panel */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* LEFT: Route Map with Risk Zones */}
              <div className="lg:col-span-2">
                <IndiaRouteMap 
                  source={route?.origin ?? null} 
                  destination={route?.destination ?? null} 
                  isLoading={isAnalyzing}
                />
              </div>

              {/* RIGHT: Contextual Intelligence Stack */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                {/* A. Alerts grouped by route impact */}
                <AlertsCompact />

                {/* B. AI Recommendations with reasoning */}
                <AICompact />
              </div>
            </div>

            {/* 3. TIMELINE INSIGHT - What happens over time */}
            <TimelineInsight />

            {/* 4. SCENARIO COMPARISON - Best alternatives */}
            <ScenarioComparison />

            {/* 5. FORECAST CHART - Detailed 72-hour view */}
            <RiskForecastChart />

            {/* 6. SUPPLIER TABLE - Supporting data */}
            <SupplierTable />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
