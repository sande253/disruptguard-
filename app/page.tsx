"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RiskForecastChart } from "@/components/dashboard/risk-forecast-chart"
import { RiskMap } from "@/components/dashboard/risk-map"
import { AlertsFeed } from "@/components/dashboard/alerts-feed"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { SupplierTable } from "@/components/dashboard/supplier-table"

export default function DashboardPage() {
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
      </div>
    </DashboardLayout>
  )
}
