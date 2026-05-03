"use client"

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
import { cn } from "@/lib/utils"

interface Supplier {
  id: string
  name: string
  tier: 1 | 2 | 3
  location: string
  riskScore: number
  status: "active" | "at-risk" | "critical"
}

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Tata Steel Limited",
    tier: 1,
    location: "Jamshedpur, Jharkhand",
    riskScore: 23,
    status: "active",
  },
  {
    id: "2",
    name: "Mahindra Auto Parts",
    tier: 1,
    location: "Pune, Maharashtra",
    riskScore: 45,
    status: "at-risk",
  },
  {
    id: "3",
    name: "Chennai Plastics Corp",
    tier: 2,
    location: "Chennai, Tamil Nadu",
    riskScore: 78,
    status: "critical",
  },
  {
    id: "4",
    name: "Reliance Polymers",
    tier: 1,
    location: "Surat, Gujarat",
    riskScore: 18,
    status: "active",
  },
  {
    id: "5",
    name: "Hyderabad Electronics",
    tier: 2,
    location: "Hyderabad, Telangana",
    riskScore: 52,
    status: "at-risk",
  },
  {
    id: "6",
    name: "Bangalore Textiles",
    tier: 3,
    location: "Bangalore, Karnataka",
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

export function SupplierTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Supplier Risk Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-border">
                  <TableHead className="text-muted-foreground font-medium">Supplier</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Tier</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Location</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Risk Score</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier, index) => (
                  <motion.tr
                    key={supplier.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.7 + index * 0.05 }}
                    className="border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium text-foreground">
                      {supplier.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", tierColors[supplier.tier])}>
                        Tier {supplier.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {supplier.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", getRiskBg(supplier.riskScore))}
                            style={{ width: `${supplier.riskScore}%` }}
                          />
                        </div>
                        <span className={cn("text-sm font-medium", getRiskColor(supplier.riskScore))}>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
