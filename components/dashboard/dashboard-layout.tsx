"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(240)

  useEffect(() => {
    // Listen for sidebar collapse/expand
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector("aside")
      if (sidebar) {
        setSidebarWidth(sidebar.offsetWidth)
      }
    })

    const sidebar = document.querySelector("aside")
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] })
      setSidebarWidth(sidebar.offsetWidth)
    }

    return () => observer.disconnect()
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
        <Navbar />
        <main className="p-6">{children}</main>
      </motion.div>
    </div>
  )
}
