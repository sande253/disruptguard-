"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Route, Truck, Clock, Zap, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionOption {
  id: string
  icon: React.ElementType
  title: string
  description: string
  impact: string
  variant: "default" | "primary" | "warning"
}

const actionOptions: ActionOption[] = [
  {
    id: "reroute",
    icon: Route,
    title: "Reroute Shipment",
    description: "Switch to recommended alternate route",
    impact: "Reduces risk by 48%",
    variant: "primary",
  },
  {
    id: "switch-transport",
    icon: Truck,
    title: "Switch Transport",
    description: "Change from road to rail freight",
    impact: "Adds 6h, reduces cost 15%",
    variant: "default",
  },
  {
    id: "delay",
    icon: Clock,
    title: "Delay Shipment",
    description: "Wait for weather conditions to improve",
    impact: "Reduces risk by 35%",
    variant: "warning",
  },
]

const variantStyles = {
  default: {
    button: "bg-secondary hover:bg-secondary/80 text-foreground",
    icon: "text-muted-foreground",
  },
  primary: {
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
    icon: "text-primary-foreground",
  },
  warning: {
    button: "bg-risk-moderate/20 hover:bg-risk-moderate/30 text-risk-moderate border border-risk-moderate/30",
    icon: "text-risk-moderate",
  },
}

export function ActionPanel() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = (actionId: string) => {
    setIsApplying(true)
    setSelectedAction(actionId)
    
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actionOptions.map((action, index) => {
            const Icon = action.icon
            const styles = variantStyles[action.variant]
            const isSelected = selectedAction === action.id

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button
                  className={cn(
                    "w-full h-auto p-4 flex flex-col items-start gap-2 relative overflow-hidden",
                    styles.button,
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => handleApply(action.id)}
                  disabled={isApplying}
                >
                  {isSelected && isApplying && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  
                  {isSelected && !isApplying && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <CheckCircle2 className="h-5 w-5 text-risk-low" />
                    </motion.div>
                  )}

                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", styles.icon)} />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-xs opacity-80 text-left">
                    {action.description}
                  </p>
                  <span className="text-xs font-medium opacity-90">
                    {action.impact}
                  </span>
                </Button>
              </motion.div>
            )
          })}

          <div className="pt-3 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground text-center">
              Actions are applied to shipment #SH-2024-1847
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
