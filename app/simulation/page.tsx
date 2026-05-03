"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SimulationInputs } from "@/components/simulation/simulation-inputs"
import { SimulationOutput } from "@/components/simulation/simulation-output"
import { ComparisonView } from "@/components/simulation/comparison-view"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Save, Download } from "lucide-react"

interface SimulationResult {
  predictedDelay: number
  stockoutRisk: number
  revenueImpact: number
  confidence: number
  affectedShipments: number
  mitigationCost: number
}

interface ScenarioData {
  delay: number
  stockoutRisk: number
  revenueImpact: number
  deliveryRate: number
  customerSatisfaction: number
}

const baseline: ScenarioData = {
  delay: 2.5,
  stockoutRisk: 8,
  revenueImpact: 0,
  deliveryRate: 94,
  customerSatisfaction: 87,
}

export default function SimulationPage() {
  // Input states
  const [selectedRoute, setSelectedRoute] = useState("hyd-che")
  const [weatherSeverity, setWeatherSeverity] = useState(25)
  const [delayHours, setDelayHours] = useState(8)
  const [transportMode, setTransportMode] = useState("road")
  const [disruptionType, setDisruptionType] = useState("weather")

  // Simulation states
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [simulatedScenario, setSimulatedScenario] = useState<ScenarioData | null>(null)

  const runSimulation = useCallback(async () => {
    setIsRunning(true)
    setResult(null)
    setSimulatedScenario(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate simulated results based on inputs
    const weatherFactor = weatherSeverity / 100
    const delayFactor = delayHours / 72

    const predictedDelay = Math.round(delayHours * (1 + weatherFactor * 0.5))
    const stockoutRisk = Math.min(95, Math.round(8 + (weatherFactor * 40) + (delayFactor * 30)))
    const revenueImpact = Math.round(
      (weatherFactor * 500000 + delayFactor * 300000) * 
      (transportMode === "air" ? 0.7 : 1) *
      (disruptionType === "demand" ? 1.5 : 1)
    )
    const confidence = Math.round(85 - (weatherFactor * 15))
    const affectedShipments = Math.round(12 + (weatherFactor * 20) + (delayFactor * 10))
    const mitigationCost = Math.round(revenueImpact * 0.15)

    const newResult: SimulationResult = {
      predictedDelay,
      stockoutRisk,
      revenueImpact,
      confidence,
      affectedShipments,
      mitigationCost,
    }

    const newSimulated: ScenarioData = {
      delay: predictedDelay,
      stockoutRisk,
      revenueImpact,
      deliveryRate: Math.max(60, 94 - Math.round(weatherFactor * 20 + delayFactor * 15)),
      customerSatisfaction: Math.max(50, 87 - Math.round(weatherFactor * 18 + delayFactor * 12)),
    }

    setResult(newResult)
    setSimulatedScenario(newSimulated)
    setIsRunning(false)
  }, [weatherSeverity, delayHours, transportMode, disruptionType])

  const resetSimulation = () => {
    setSelectedRoute("hyd-che")
    setWeatherSeverity(25)
    setDelayHours(8)
    setTransportMode("road")
    setDisruptionType("weather")
    setResult(null)
    setSimulatedScenario(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Disruption Simulation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Model disruption scenarios and predict supply chain impact
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!result}
            >
              <Save className="h-4 w-4" />
              Save Scenario
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={!result}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Panel */}
          <div className="lg:col-span-1">
            <SimulationInputs
              selectedRoute={selectedRoute}
              onRouteChange={setSelectedRoute}
              weatherSeverity={weatherSeverity}
              onWeatherChange={setWeatherSeverity}
              delayHours={delayHours}
              onDelayChange={setDelayHours}
              transportMode={transportMode}
              onTransportChange={setTransportMode}
              disruptionType={disruptionType}
              onDisruptionTypeChange={setDisruptionType}
            />

            {/* Run Simulation Button */}
            <motion.div
              className="mt-4"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                className="w-full gap-2 h-12 text-base font-medium"
                onClick={runSimulation}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Run Simulation
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2">
            <SimulationOutput result={result} isRunning={isRunning} />
          </div>
        </div>

        {/* Comparison View */}
        <ComparisonView
          baseline={baseline}
          simulated={simulatedScenario}
          hasResults={!!result}
        />
      </div>
    </DashboardLayout>
  )
}
