"use client"

import { use } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { RouteHeader } from "@/components/route-detail/route-header"
import { RiskOverviewCard } from "@/components/route-detail/risk-overview-card"
import { ForecastTimeline } from "@/components/route-detail/forecast-timeline"
import { RouteSegments } from "@/components/route-detail/route-segments"
import { AlternateRoutesComparison } from "@/components/route-detail/alternate-routes-comparison"
import { ActionPanel } from "@/components/route-detail/action-panel"

// Mock route data - in production this would come from an API
const routesData: Record<string, {
  id: string
  origin: string
  destination: string
  riskLevel: "low" | "moderate" | "high"
  lastUpdated: string
  delayProbability: number
  expectedDelayRange: string
  confidenceLevel: number
}> = {
  "hyderabad-chennai": {
    id: "hyderabad-chennai",
    origin: "Hyderabad",
    destination: "Chennai",
    riskLevel: "high",
    lastUpdated: "2 minutes ago",
    delayProbability: 62,
    expectedDelayRange: "4-8 hours",
    confidenceLevel: 87,
  },
  "mumbai-pune": {
    id: "mumbai-pune",
    origin: "Mumbai",
    destination: "Pune",
    riskLevel: "low",
    lastUpdated: "5 minutes ago",
    delayProbability: 15,
    expectedDelayRange: "0-1 hours",
    confidenceLevel: 94,
  },
  "delhi-jaipur": {
    id: "delhi-jaipur",
    origin: "Delhi",
    destination: "Jaipur",
    riskLevel: "moderate",
    lastUpdated: "3 minutes ago",
    delayProbability: 38,
    expectedDelayRange: "2-4 hours",
    confidenceLevel: 82,
  },
}

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const route = routesData[id] || routesData["hyderabad-chennai"]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <RouteHeader
          origin={route.origin}
          destination={route.destination}
          riskLevel={route.riskLevel}
          lastUpdated={route.lastUpdated}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskOverviewCard
            delayProbability={route.delayProbability}
            expectedDelayRange={route.expectedDelayRange}
            confidenceLevel={route.confidenceLevel}
          />
          <div className="lg:col-span-2">
            <ForecastTimeline />
          </div>
        </div>

        <RouteSegments />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlternateRoutesComparison />
          </div>
          <ActionPanel />
        </div>
      </div>
    </DashboardLayout>
  )
}
