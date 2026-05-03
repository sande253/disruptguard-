"use client"

import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const forecastData = [
  { time: "Now", risk: 35, upper: 42, lower: 28 },
  { time: "+6h", risk: 42, upper: 52, lower: 32 },
  { time: "+12h", risk: 58, upper: 68, lower: 48 },
  { time: "+18h", risk: 72, upper: 82, lower: 62 },
  { time: "+24h", risk: 68, upper: 78, lower: 58 },
  { time: "+30h", risk: 55, upper: 65, lower: 45 },
  { time: "+36h", risk: 48, upper: 58, lower: 38 },
  { time: "+42h", risk: 52, upper: 62, lower: 42 },
  { time: "+48h", risk: 45, upper: 55, lower: 35 },
  { time: "+54h", risk: 38, upper: 48, lower: 28 },
  { time: "+60h", risk: 42, upper: 52, lower: 32 },
  { time: "+66h", risk: 35, upper: 45, lower: 25 },
  { time: "+72h", risk: 30, upper: 40, lower: 20 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-primary">
          Risk Score: <span className="font-semibold">{payload[0]?.value}%</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Confidence: {payload[1]?.value}% - {payload[2]?.value}%
        </p>
      </div>
    )
  }
  return null
}

export function RiskForecastChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            72-Hour Disruption Forecast
          </CardTitle>
          <div className="flex gap-2">
            <Select defaultValue="hyderabad-chennai">
              <SelectTrigger className="w-[180px] bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="hyderabad-chennai">Hyderabad → Chennai</SelectItem>
                <SelectItem value="mumbai-delhi">Mumbai → Delhi</SelectItem>
                <SelectItem value="bangalore-kolkata">Bangalore → Kolkata</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="road">
              <SelectTrigger className="w-[120px] bg-secondary border-border text-foreground">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="road">Road</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
                <SelectItem value="air">Air</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Confidence band */}
                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="transparent"
                  fill="url(#confidenceGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="transparent"
                  fill="hsl(var(--background))"
                  fillOpacity={1}
                />
                {/* Main risk line */}
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Risk Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground">Confidence Interval</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
