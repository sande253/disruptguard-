"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Wallet, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRoute, OptimizationMode } from "@/contexts/route-context"

interface OptimizationOption {
  id: OptimizationMode
  label: string
  icon: typeof Zap
  description: string
}

const options: OptimizationOption[] = [
  {
    id: "balanced",
    label: "Balanced",
    icon: Scale,
    description: "Best overall",
  },
  {
    id: "fastest",
    label: "Fastest",
    icon: Zap,
    description: "Minimum time",
  },
  {
    id: "lowest-risk",
    label: "Lowest Risk",
    icon: Shield,
    description: "Maximum safety",
  },
  {
    id: "cheapest",
    label: "Cheapest",
    icon: Wallet,
    description: "Minimum cost",
  },
]

export function OptimizationSelector() {
  const { optimizationMode, setOptimizationMode, hasAnalyzed } = useRoute()

  if (!hasAnalyzed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-xs font-medium text-muted-foreground mr-1">
        Optimize for:
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = optimizationMode === option.id
          return (
            <motion.button
              key={option.id}
              onClick={() => setOptimizationMode(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <option.icon className={cn("h-3.5 w-3.5", isSelected && "text-primary-foreground")} />
              <span>{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
