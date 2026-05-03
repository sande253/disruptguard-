"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SupplierFilters } from "@/components/suppliers/supplier-filters"
import { SupplierDetailPanel } from "@/components/suppliers/supplier-detail-panel"
import { NetworkVisualization } from "@/components/suppliers/network-visualization"
import { cn } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  tier: 1 | 2 | 3
  location: string
  region: string
  riskScore: number
  status: "active" | "at-risk" | "critical"
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Tata Steel Limited",
    tier: 1,
    location: "Jamshedpur, Jharkhand",
    region: "jharkhand",
    riskScore: 23,
    status: "active",
  },
  {
    id: "2",
    name: "Mahindra Auto Parts",
    tier: 1,
    location: "Pune, Maharashtra",
    region: "maharashtra",
    riskScore: 45,
    status: "at-risk",
  },
  {
    id: "3",
    name: "Chennai Plastics Corp",
    tier: 2,
    location: "Chennai, Tamil Nadu",
    region: "tamil nadu",
    riskScore: 78,
    status: "critical",
  },
  {
    id: "4",
    name: "Reliance Polymers",
    tier: 1,
    location: "Surat, Gujarat",
    region: "gujarat",
    riskScore: 18,
    status: "active",
  },
  {
    id: "5",
    name: "Hyderabad Electronics",
    tier: 2,
    location: "Hyderabad, Telangana",
    region: "telangana",
    riskScore: 52,
    status: "at-risk",
  },
  {
    id: "6",
    name: "Bangalore Textiles",
    tier: 3,
    location: "Bangalore, Karnataka",
    region: "karnataka",
    riskScore: 31,
    status: "active",
  },
]

const statusStyles = {
  active: "bg-risk-low/20 text-risk-low border-risk-low/30",
  "at-risk": "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
  critical: "bg-risk-high/20 text-risk-high border-risk-high/30",
}

const tierColors = {
  1: "bg-primary/20 text-primary border-primary/30",
  2: "bg-muted text-muted-foreground border-border",
  3: "bg-secondary text-secondary-foreground border-border",
}

function getRiskColor(score: number) {
  if (score <= 30) return "text-risk-low"
  if (score <= 60) return "text-risk-moderate"
  return "text-risk-high"
}

function getRiskBg(score: number) {
  if (score <= 30) return "bg-risk-low"
  if (score <= 60) return "bg-risk-moderate"
  return "bg-risk-high"
}

function getRiskLevel(score: number) {
  if (score <= 30) return "low"
  if (score <= 60) return "moderate"
  return "high"
}

export default function SuppliersPage() {
  const [tierFilter, setTierFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      if (tierFilter !== "all" && supplier.tier.toString() !== tierFilter) return false
      if (regionFilter !== "all" && supplier.region !== regionFilter) return false
      if (riskFilter !== "all" && getRiskLevel(supplier.riskScore) !== riskFilter) return false
      return true
    })
  }, [tierFilter, regionFilter, riskFilter])

  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsPanelOpen(true)
  }

  const handleClearFilters = () => {
    setTierFilter("all")
    setRegionFilter("all")
    setRiskFilter("all")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Supplier Risk Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and analyze supplier risk across your supply chain network
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <SupplierFilters
              tierFilter={tierFilter}
              regionFilter={regionFilter}
              riskFilter={riskFilter}
              onTierChange={setTierFilter}
              onRegionChange={setRegionFilter}
              onRiskChange={setRiskFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supplier Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Suppliers
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {filteredSuppliers.length} of {suppliers.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-border">
                        <TableHead className="text-muted-foreground font-medium">Supplier</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Tier</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Location</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Risk</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.map((supplier, index) => (
                        <motion.tr
                          key={supplier.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                          className={cn(
                            "border-border hover:bg-secondary/30 transition-colors cursor-pointer",
                            selectedSupplier?.id === supplier.id && "bg-primary/5"
                          )}
                          onClick={() => handleSupplierClick(supplier)}
                        >
                          <TableCell className="font-medium text-foreground">
                            {supplier.name}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", tierColors[supplier.tier])}>
                              T{supplier.tier}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {supplier.location.split(",")[0]}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", getRiskBg(supplier.riskScore))}
                                  style={{ width: `${supplier.riskScore}%` }}
                                />
                              </div>
                              <span className={cn("text-xs font-medium", getRiskColor(supplier.riskScore))}>
                                {supplier.riskScore}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs capitalize", statusStyles[supplier.status])}>
                              {supplier.status.replace("-", " ")}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                      {filteredSuppliers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No suppliers match the selected filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Network Visualization */}
          <div className="lg:col-span-1">
            <NetworkVisualization
              suppliers={filteredSuppliers}
              onSelectSupplier={handleSupplierClick}
            />
          </div>
        </div>
      </div>

      {/* Supplier Detail Panel */}
      <SupplierDetailPanel
        supplier={selectedSupplier}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </DashboardLayout>
  )
}
