"use client"

import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SupplierFiltersProps {
  tierFilter: string
  regionFilter: string
  riskFilter: string
  onTierChange: (value: string) => void
  onRegionChange: (value: string) => void
  onRiskChange: (value: string) => void
  onClearFilters: () => void
}

const regions = [
  "All Regions",
  "Maharashtra",
  "Tamil Nadu",
  "Gujarat",
  "Telangana",
  "Karnataka",
  "Jharkhand",
]

const tiers = ["All Tiers", "Tier 1", "Tier 2", "Tier 3"]
const riskLevels = ["All Risk Levels", "Low", "Moderate", "High"]

export function SupplierFilters({
  tierFilter,
  regionFilter,
  riskFilter,
  onTierChange,
  onRegionChange,
  onRiskChange,
  onClearFilters,
}: SupplierFiltersProps) {
  const hasActiveFilters = tierFilter !== "all" || regionFilter !== "all" || riskFilter !== "all"

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-3"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <Select value={tierFilter} onValueChange={onTierChange}>
        <SelectTrigger className="w-[130px] bg-secondary border-border">
          <SelectValue placeholder="All Tiers" />
        </SelectTrigger>
        <SelectContent>
          {tiers.map((tier) => (
            <SelectItem
              key={tier}
              value={tier === "All Tiers" ? "all" : tier.split(" ")[1].toLowerCase()}
            >
              {tier}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={regionFilter} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[160px] bg-secondary border-border">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem
              key={region}
              value={region === "All Regions" ? "all" : region.toLowerCase()}
            >
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={riskFilter} onValueChange={onRiskChange}>
        <SelectTrigger className="w-[160px] bg-secondary border-border">
          <SelectValue placeholder="All Risk Levels" />
        </SelectTrigger>
        <SelectContent>
          {riskLevels.map((level) => (
            <SelectItem
              key={level}
              value={level === "All Risk Levels" ? "all" : level.toLowerCase()}
            >
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      )}

      {hasActiveFilters && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {tierFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Tier {tierFilter}
            </Badge>
          )}
          {regionFilter !== "all" && (
            <Badge variant="secondary" className="text-xs capitalize">
              {regionFilter}
            </Badge>
          )}
          {riskFilter !== "all" && (
            <Badge
              className={cn(
                "text-xs capitalize",
                riskFilter === "low" && "bg-risk-low/20 text-risk-low border-risk-low/30",
                riskFilter === "moderate" && "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30",
                riskFilter === "high" && "bg-risk-high/20 text-risk-high border-risk-high/30"
              )}
            >
              {riskFilter} Risk
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  )
}
