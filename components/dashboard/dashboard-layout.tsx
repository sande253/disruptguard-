"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { AIAssistantPanel } from "./ai-assistant-panel"
import { useRoute, formatRoute } from "@/contexts/route-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const { route } = useRoute()
  const routeLabel = formatRoute(route)

  useEffect(() => {
    // Listen for sidebar collapse/expand
    const sidebar = document.querySelector("aside")
    if (!sidebar) return

    const observer = new MutationObserver(() => {
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth)
      }
    })

    observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] })
    setSidebarWidth(sidebar.offsetWidth)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.div
        className="min-h-screen"
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Navbar onOpenAI={() => setIsAIOpen(true)} />
        <main className="p-6">{children}</main>
      </motion.div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentRoute={routeLabel || "No route selected"}
      />
    </div>
  )
}
