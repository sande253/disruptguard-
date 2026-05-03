"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Truck,
  MapPin,
  Clock,
  Package,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Thermometer,
  Droplets,
  Search,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Shipment {
  id: string
  trackingId: string
  origin: string
  destination: string
  status: "in-transit" | "delayed" | "delivered" | "loading"
  progress: number
  eta: string
  driver: string
  driverPhone: string
  vehicle: string
  currentLocation: string
  lastUpdate: string
  temperature?: number
  humidity?: number
  alerts: string[]
}

const shipments: Shipment[] = [
  {
    id: "1",
    trackingId: "DG-2024-001",
    origin: "Hyderabad",
    destination: "Chennai",
    status: "in-transit",
    progress: 65,
    eta: "4 hrs 30 min",
    driver: "Rajesh Kumar",
    driverPhone: "+91 98765 43210",
    vehicle: "MH-12-AB-1234",
    currentLocation: "Near Nellore, AP",
    lastUpdate: "2 min ago",
    temperature: 24,
    humidity: 45,
    alerts: [],
  },
  {
    id: "2",
    trackingId: "DG-2024-002",
    origin: "Mumbai",
    destination: "Delhi",
    status: "delayed",
    progress: 42,
    eta: "12 hrs (delayed 3 hrs)",
    driver: "Suresh Patel",
    driverPhone: "+91 98765 43211",
    vehicle: "GJ-01-CD-5678",
    currentLocation: "Jaipur bypass",
    lastUpdate: "5 min ago",
    temperature: 28,
    humidity: 52,
    alerts: ["Traffic congestion on NH-48", "Expected 3 hour delay"],
  },
  {
    id: "3",
    trackingId: "DG-2024-003",
    origin: "Bangalore",
    destination: "Kolkata",
    status: "loading",
    progress: 5,
    eta: "Departure in 1 hr",
    driver: "Amit Singh",
    driverPhone: "+91 98765 43212",
    vehicle: "KA-01-EF-9012",
    currentLocation: "Bangalore Warehouse",
    lastUpdate: "10 min ago",
    alerts: [],
  },
  {
    id: "4",
    trackingId: "DG-2024-004",
    origin: "Chennai",
    destination: "Hyderabad",
    status: "delivered",
    progress: 100,
    eta: "Delivered",
    driver: "Ravi Sharma",
    driverPhone: "+91 98765 43213",
    vehicle: "TN-01-GH-3456",
    currentLocation: "Hyderabad Hub",
    lastUpdate: "1 hr ago",
    alerts: [],
  },
]

const statusConfig = {
  "in-transit": { label: "In Transit", color: "text-primary", bg: "bg-primary/10", icon: Truck },
  delayed: { label: "Delayed", color: "text-risk-high", bg: "bg-risk-high/10", icon: AlertTriangle },
  delivered: { label: "Delivered", color: "text-risk-low", bg: "bg-risk-low/10", icon: CheckCircle },
  loading: { label: "Loading", color: "text-risk-moderate", bg: "bg-risk-moderate/10", icon: Package },
}

export default function TrackingPage() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(shipments[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shipment Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Real-time tracking for all active shipments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLastRefresh(new Date())}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Active Shipments", value: "12", status: "in-transit" as const },
            { label: "Delayed", value: "3", status: "delayed" as const },
            { label: "Loading", value: "5", status: "loading" as const },
            { label: "Delivered Today", value: "8", status: "delivered" as const },
          ].map((stat) => {
            const config = statusConfig[stat.status]
            return (
              <Card key={stat.label} className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={cn("rounded-lg p-3", config.bg)}>
                      <config.icon className={cn("h-5 w-5", config.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shipment List */}
          <Card className="border-border bg-card lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1 p-2">
                  {filteredShipments.map((shipment) => {
                    const config = statusConfig[shipment.status]
                    const isSelected = selectedShipment?.id === shipment.id
                    return (
                      <motion.div
                        key={shipment.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedShipment(shipment)}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-colors",
                          isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground text-sm">{shipment.trackingId}</span>
                          <Badge className={cn("text-[10px]", config.bg, config.color, "border-0")}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{shipment.origin}</span>
                          <span>→</span>
                          <span>{shipment.destination}</span>
                        </div>
                        <div className="mt-2">
                          <Progress value={shipment.progress} className="h-1 bg-secondary" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-muted-foreground">ETA: {shipment.eta}</span>
                          <span className="text-[10px] text-muted-foreground">{shipment.lastUpdate}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card className="border-border bg-card lg:col-span-2">
            {selectedShipment ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedShipment.trackingId}
                        <Badge className={cn(
                          "text-xs",
                          statusConfig[selectedShipment.status].bg,
                          statusConfig[selectedShipment.status].color,
                          "border-0"
                        )}>
                          {statusConfig[selectedShipment.status].label}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedShipment.origin} → {selectedShipment.destination}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contact Driver
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Journey Progress</span>
                      <span className="text-sm font-medium text-foreground">{selectedShipment.progress}%</span>
                    </div>
                    <Progress value={selectedShipment.progress} className="h-2 bg-secondary" />
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{selectedShipment.origin}</span>
                      <span>{selectedShipment.destination}</span>
                    </div>
                  </div>

                  {/* Alerts */}
                  {selectedShipment.alerts.length > 0 && (
                    <div className="rounded-lg border border-risk-high/30 bg-risk-high/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-risk-high" />
                        <span className="font-medium text-risk-high">Active Alerts</span>
                      </div>
                      <ul className="space-y-1">
                        {selectedShipment.alerts.map((alert, index) => (
                          <li key={index} className="text-sm text-foreground flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-risk-high" />
                            {alert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Details Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Current Location */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Navigation className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current Location</p>
                        <p className="text-sm font-medium text-foreground">{selectedShipment.currentLocation}</p>
                        <p className="text-xs text-muted-foreground">{selectedShipment.lastUpdate}</p>
                      </div>
                    </div>

                    {/* ETA */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                        <p className="text-sm font-medium text-foreground">{selectedShipment.eta}</p>
                      </div>
                    </div>

                    {/* Driver */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Truck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="text-sm font-medium text-foreground">{selectedShipment.driver}</p>
                        <p className="text-xs text-primary">{selectedShipment.driverPhone}</p>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vehicle</p>
                        <p className="text-sm font-medium text-foreground">{selectedShipment.vehicle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Data */}
                  {selectedShipment.temperature && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-3">Sensor Data</p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                            <Thermometer className="h-5 w-5 text-risk-moderate" />
                            <div>
                              <p className="text-xs text-muted-foreground">Temperature</p>
                              <p className="text-lg font-bold text-foreground">{selectedShipment.temperature}°C</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                            <Droplets className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Humidity</p>
                              <p className="text-lg font-bold text-foreground">{selectedShipment.humidity}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Map Placeholder */}
                  <div className="rounded-xl bg-secondary/30 border border-border h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Live map view</p>
                      <p className="text-xs text-muted-foreground">GPS tracking active</p>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a shipment to view details</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
