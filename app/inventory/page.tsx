"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Package,
  Warehouse,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  MapPin,
  Clock,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WarehouseStock {
  id: string
  name: string
  location: string
  totalCapacity: number
  currentStock: number
  safetyStock: number
  reorderPoint: number
  status: "healthy" | "low" | "critical" | "overstocked"
  items: InventoryItem[]
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity: number
  safetyLevel: number
  daysOfStock: number
  lastRestocked: string
  inTransit: number
}

const warehouses: WarehouseStock[] = [
  {
    id: "1",
    name: "Hyderabad Hub",
    location: "Hyderabad, Telangana",
    totalCapacity: 10000,
    currentStock: 7500,
    safetyStock: 2000,
    reorderPoint: 3000,
    status: "healthy",
    items: [
      { id: "1", name: "Auto Parts - Engine", sku: "AP-ENG-001", quantity: 2500, safetyLevel: 500, daysOfStock: 12, lastRestocked: "Apr 28", inTransit: 800 },
      { id: "2", name: "Steel Components", sku: "SC-STL-042", quantity: 1800, safetyLevel: 400, daysOfStock: 8, lastRestocked: "Apr 30", inTransit: 500 },
      { id: "3", name: "Electronics Module", sku: "EM-ECU-015", quantity: 3200, safetyLevel: 600, daysOfStock: 15, lastRestocked: "May 1", inTransit: 0 },
    ],
  },
  {
    id: "2",
    name: "Chennai Warehouse",
    location: "Chennai, Tamil Nadu",
    totalCapacity: 8000,
    currentStock: 2100,
    safetyStock: 1500,
    reorderPoint: 2500,
    status: "low",
    items: [
      { id: "4", name: "Plastic Components", sku: "PC-PLS-008", quantity: 800, safetyLevel: 400, daysOfStock: 4, lastRestocked: "Apr 25", inTransit: 1200 },
      { id: "5", name: "Rubber Seals", sku: "RS-RBR-023", quantity: 600, safetyLevel: 300, daysOfStock: 3, lastRestocked: "Apr 22", inTransit: 600 },
      { id: "6", name: "Wiring Harness", sku: "WH-WIR-017", quantity: 700, safetyLevel: 350, daysOfStock: 5, lastRestocked: "Apr 28", inTransit: 0 },
    ],
  },
  {
    id: "3",
    name: "Mumbai Distribution",
    location: "Mumbai, Maharashtra",
    totalCapacity: 12000,
    currentStock: 1200,
    safetyStock: 2500,
    reorderPoint: 4000,
    status: "critical",
    items: [
      { id: "7", name: "Metal Castings", sku: "MC-MET-034", quantity: 400, safetyLevel: 800, daysOfStock: 2, lastRestocked: "Apr 20", inTransit: 2000 },
      { id: "8", name: "Hydraulic Parts", sku: "HP-HYD-011", quantity: 350, safetyLevel: 700, daysOfStock: 1, lastRestocked: "Apr 18", inTransit: 1500 },
      { id: "9", name: "Bearings", sku: "BR-BRG-029", quantity: 450, safetyLevel: 600, daysOfStock: 2, lastRestocked: "Apr 21", inTransit: 800 },
    ],
  },
  {
    id: "4",
    name: "Delhi North Hub",
    location: "Delhi NCR",
    totalCapacity: 6000,
    currentStock: 5800,
    safetyStock: 1200,
    reorderPoint: 2000,
    status: "overstocked",
    items: [
      { id: "10", name: "Finished Goods A", sku: "FG-FIN-001", quantity: 2800, safetyLevel: 400, daysOfStock: 25, lastRestocked: "May 2", inTransit: 0 },
      { id: "11", name: "Finished Goods B", sku: "FG-FIN-002", quantity: 1800, safetyLevel: 400, daysOfStock: 20, lastRestocked: "May 1", inTransit: 0 },
      { id: "12", name: "Packaging Materials", sku: "PM-PKG-045", quantity: 1200, safetyLevel: 300, daysOfStock: 18, lastRestocked: "Apr 30", inTransit: 0 },
    ],
  },
]

const statusConfig = {
  healthy: { label: "Healthy", color: "text-risk-low", bg: "bg-risk-low/10", icon: CheckCircle },
  low: { label: "Low Stock", color: "text-risk-moderate", bg: "bg-risk-moderate/10", icon: AlertTriangle },
  critical: { label: "Critical", color: "text-risk-high", bg: "bg-risk-high/10", icon: XCircle },
  overstocked: { label: "Overstocked", color: "text-primary", bg: "bg-primary/10", icon: Package },
}

const reorderSuggestions = [
  { id: "1", warehouse: "Mumbai Distribution", item: "Metal Castings", quantity: 2000, urgency: "critical", eta: "2-3 days" },
  { id: "2", warehouse: "Mumbai Distribution", item: "Hydraulic Parts", quantity: 1500, urgency: "critical", eta: "3-4 days" },
  { id: "3", warehouse: "Chennai Warehouse", item: "Plastic Components", quantity: 1000, urgency: "medium", eta: "4-5 days" },
  { id: "4", warehouse: "Chennai Warehouse", item: "Rubber Seals", quantity: 800, urgency: "medium", eta: "3-4 days" },
]

export default function InventoryPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseStock | null>(warehouses[0])
  const [searchQuery, setSearchQuery] = useState("")

  const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0)
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0)
  const criticalWarehouses = warehouses.filter((w) => w.status === "critical").length
  const lowStockItems = warehouses.flatMap((w) => w.items).filter((i) => i.daysOfStock <= 5).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Buffer</h1>
            <p className="text-sm text-muted-foreground">
              Monitor stock levels and safety buffers across warehouses
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Inventory
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalStock.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
              <Progress value={(totalStock / totalCapacity) * 100} className="h-1.5 mt-3 bg-secondary" />
              <p className="text-xs text-muted-foreground mt-1">{((totalStock / totalCapacity) * 100).toFixed(0)}% capacity</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warehouses</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{warehouses.length}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <Warehouse className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Across India</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <p className="text-2xl font-bold text-risk-high mt-1">{criticalWarehouses}</p>
                </div>
                <div className="rounded-lg bg-risk-high/10 p-3">
                  <AlertTriangle className="h-5 w-5 text-risk-high" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Need immediate action</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold text-risk-moderate mt-1">{lowStockItems}</p>
                </div>
                <div className="rounded-lg bg-risk-moderate/10 p-3">
                  <TrendingDown className="h-5 w-5 text-risk-moderate" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Below 5 days supply</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="warehouses" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
            <TabsTrigger value="transit">In Transit</TabsTrigger>
          </TabsList>

          {/* Warehouses Tab */}
          <TabsContent value="warehouses">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Warehouse List */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search warehouses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[450px]">
                    <div className="space-y-2 p-2">
                      {warehouses.map((warehouse) => {
                        const config = statusConfig[warehouse.status]
                        const isSelected = selectedWarehouse?.id === warehouse.id
                        const utilization = (warehouse.currentStock / warehouse.totalCapacity) * 100
                        return (
                          <motion.div
                            key={warehouse.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setSelectedWarehouse(warehouse)}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors",
                              isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground text-sm">{warehouse.name}</span>
                              <Badge className={cn("text-[10px]", config.bg, config.color, "border-0")}>
                                {config.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{warehouse.location}</span>
                            </div>
                            <Progress value={utilization} className="h-1.5 bg-secondary" />
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] text-muted-foreground">
                                {warehouse.currentStock.toLocaleString()} / {warehouse.totalCapacity.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{utilization.toFixed(0)}%</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Warehouse Details */}
              <Card className="border-border bg-card lg:col-span-2">
                {selectedWarehouse ? (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedWarehouse.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {selectedWarehouse.location}
                          </CardDescription>
                        </div>
                        <Badge className={cn(
                          "text-xs",
                          statusConfig[selectedWarehouse.status].bg,
                          statusConfig[selectedWarehouse.status].color,
                          "border-0"
                        )}>
                          {statusConfig[selectedWarehouse.status].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Capacity Overview */}
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground">Current Stock</p>
                          <p className="text-xl font-bold text-foreground">{selectedWarehouse.currentStock.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground">Safety Stock</p>
                          <p className="text-xl font-bold text-risk-moderate">{selectedWarehouse.safetyStock.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground">Reorder Point</p>
                          <p className="text-xl font-bold text-primary">{selectedWarehouse.reorderPoint.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Item List */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Inventory Items</h4>
                        <div className="space-y-3">
                          {selectedWarehouse.items.map((item) => {
                            const isLowStock = item.quantity <= item.safetyLevel
                            return (
                              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground text-sm">{item.name}</span>
                                    <span className="text-xs text-muted-foreground">{item.sku}</span>
                                    {isLowStock && (
                                      <Badge className="bg-risk-high/20 text-risk-high border-0 text-[10px]">
                                        <AlertTriangle className="h-3 w-3 mr-0.5" />
                                        Low
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span>Qty: {item.quantity.toLocaleString()}</span>
                                    <span>Safety: {item.safetyLevel}</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {item.daysOfStock} days supply
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {item.inTransit > 0 && (
                                    <Badge variant="outline" className="text-[10px] border-primary text-primary">
                                      +{item.inTransit} in transit
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="h-[500px] flex items-center justify-center">
                    <div className="text-center">
                      <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a warehouse to view details</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Reorder Suggestions Tab */}
          <TabsContent value="reorder">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>AI Reorder Suggestions</CardTitle>
                <CardDescription>Automated recommendations based on consumption patterns and lead times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reorderSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      suggestion.urgency === "critical" 
                        ? "border-risk-high/30 bg-risk-high/5" 
                        : "border-border bg-secondary/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "rounded-lg p-3",
                        suggestion.urgency === "critical" ? "bg-risk-high/10" : "bg-risk-moderate/10"
                      )}>
                        <ShoppingCart className={cn(
                          "h-5 w-5",
                          suggestion.urgency === "critical" ? "text-risk-high" : "text-risk-moderate"
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{suggestion.item}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.warehouse}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-foreground">{suggestion.quantity.toLocaleString()} units</p>
                        <p className="text-xs text-muted-foreground">ETA: {suggestion.eta}</p>
                      </div>
                      <Badge className={cn(
                        "capitalize border-0",
                        suggestion.urgency === "critical" ? "bg-risk-high/20 text-risk-high" : "bg-risk-moderate/20 text-risk-moderate"
                      )}>
                        {suggestion.urgency}
                      </Badge>
                      <Button size="sm" className="gap-2">
                        Order Now
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* In Transit Tab */}
          <TabsContent value="transit">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Inventory In Transit</CardTitle>
                <CardDescription>Track shipments heading to your warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouses.flatMap((w) => 
                    w.items.filter((i) => i.inTransit > 0).map((item) => ({
                      ...item,
                      warehouse: w.name,
                    }))
                  ).map((item, index) => (
                    <div key={`${item.id}-transit`} className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sku} → {item.warehouse}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{item.inTransit.toLocaleString()} units</p>
                          <p className="text-xs text-muted-foreground">Expected: 2-3 days</p>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          In Transit
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
