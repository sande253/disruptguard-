"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Clock,
  FileSpreadsheet,
  File,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Report {
  id: string
  name: string
  type: "weekly" | "monthly" | "custom"
  format: "pdf" | "excel"
  status: "ready" | "generating" | "failed"
  createdAt: string
  size: string
}

const recentReports: Report[] = [
  { id: "1", name: "Weekly Risk Summary - Week 18", type: "weekly", format: "pdf", status: "ready", createdAt: "May 3, 2026", size: "2.4 MB" },
  { id: "2", name: "Monthly Analytics - April 2026", type: "monthly", format: "excel", status: "ready", createdAt: "May 1, 2026", size: "5.8 MB" },
  { id: "3", name: "Supplier Performance Q1 2026", type: "custom", format: "pdf", status: "ready", createdAt: "Apr 28, 2026", size: "3.1 MB" },
  { id: "4", name: "Route Analysis - HYD-CHN", type: "custom", format: "excel", status: "generating", createdAt: "May 3, 2026", size: "-" },
  { id: "5", name: "Weekly Risk Summary - Week 17", type: "weekly", format: "pdf", status: "ready", createdAt: "Apr 26, 2026", size: "2.2 MB" },
]

const reportTemplates = [
  { id: "risk-summary", name: "Risk Summary", description: "Overview of all risk events and predictions", icon: FileText },
  { id: "route-analysis", name: "Route Analysis", description: "Detailed analysis of route performance", icon: FileText },
  { id: "supplier-perf", name: "Supplier Performance", description: "Reliability scores and trends by supplier", icon: FileText },
  { id: "delay-report", name: "Delay Report", description: "All delays with root cause analysis", icon: FileText },
  { id: "cost-analysis", name: "Cost Analysis", description: "Shipping costs breakdown and optimization", icon: FileText },
  { id: "sustainability", name: "Sustainability Report", description: "Carbon footprint and green metrics", icon: FileText },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and download custom reports
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="generate" className="gap-2">
              <Plus className="h-4 w-4" />
              Generate Report
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Report History
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          {/* Generate Report */}
          <TabsContent value="generate">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Template Selection */}
              <Card className="border-border bg-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Select Report Template</CardTitle>
                  <CardDescription>Choose a template to customize</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {reportTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors",
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "rounded-lg p-2",
                            selectedTemplate === template.id ? "bg-primary/10" : "bg-secondary"
                          )}>
                            <template.icon className={cn(
                              "h-5 w-5",
                              selectedTemplate === template.id ? "text-primary" : "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{template.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Report Configuration */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Configure Report</CardTitle>
                  <CardDescription>Set parameters for your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-secondary border-border"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "MMM d, yyyy")
                            )
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover" align="start">
                        <Calendar
                          mode="range"
                          selected={{ from: dateRange.from, to: dateRange.to }}
                          onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Format */}
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="pdf">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-red-400" />
                            PDF Document
                          </div>
                        </SelectItem>
                        <SelectItem value="excel">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-400" />
                            Excel Spreadsheet
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Routes Filter */}
                  <div className="space-y-2">
                    <Label>Routes (Optional)</Label>
                    <Input
                      placeholder="e.g., HYD-CHN, MUM-DEL"
                      className="bg-secondary border-border"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to include all routes</p>
                  </div>

                  {/* Generate Button */}
                  <Button
                    className="w-full mt-4"
                    disabled={!selectedTemplate || isGenerating}
                    onClick={handleGenerate}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Report History */}
          <TabsContent value="history">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Download or delete your generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "rounded-lg p-2",
                            report.format === "pdf" ? "bg-red-500/10" : "bg-green-500/10"
                          )}>
                            {report.format === "pdf" ? (
                              <File className="h-5 w-5 text-red-400" />
                            ) : (
                              <FileSpreadsheet className="h-5 w-5 text-green-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{report.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{report.createdAt}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.status === "ready" && (
                            <Badge className="bg-risk-low/20 text-risk-low border-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                          {report.status === "generating" && (
                            <Badge className="bg-risk-moderate/20 text-risk-moderate border-0">
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Generating
                            </Badge>
                          )}
                          {report.status === "failed" && (
                            <Badge className="bg-risk-high/20 text-risk-high border-0">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={report.status !== "ready"}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-risk-high">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Reports */}
          <TabsContent value="scheduled">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Automatically generated reports</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Weekly Risk Summary", schedule: "Every Monday, 9:00 AM", recipients: 3, active: true },
                    { name: "Monthly Analytics", schedule: "1st of month, 8:00 AM", recipients: 5, active: true },
                    { name: "Daily Delay Report", schedule: "Every day, 6:00 PM", recipients: 2, active: false },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{schedule.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{schedule.schedule}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{schedule.recipients} recipients</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          "border-0",
                          schedule.active ? "bg-risk-low/20 text-risk-low" : "bg-secondary text-muted-foreground"
                        )}>
                          {schedule.active ? "Active" : "Paused"}
                        </Badge>
                        <Button variant="outline" size="sm">Edit</Button>
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
