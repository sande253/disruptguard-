"use client"

import { ReactNode } from "react"
import { RouteProvider } from "@/contexts/route-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RouteProvider>
      {children}
    </RouteProvider>
  )
}
