"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  routeContext?: string
}

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  currentRoute?: string
}

const suggestedPrompts = [
  "What's the risk for Hyderabad to Chennai?",
  "Suggest alternate route",
  "Impact of cyclone?",
  "Show high-risk suppliers",
]

const mockResponses: Record<string, string> = {
  "what's the risk for hyderabad to chennai?": "The Hyderabad to Chennai route currently has a **62% delay probability** due to:\n\n• Cyclone warning near coastal region (High severity)\n• NH-44 congestion near Kurnool (Moderate)\n• Scheduled maintenance at Chennai Port\n\nRecommended action: Consider the alternate route via Bangalore, which adds 2 hours but reduces risk to 28%.",
  "suggest alternate route": "Based on current conditions, I recommend:\n\n**Route B: Hyderabad → Bangalore → Chennai**\n• Distance: +120 km\n• Time: +2 hours\n• Risk Score: 28% (vs 62% current)\n• Cost Impact: +₹4,500\n\nThis route avoids the cyclone-affected coastal areas and NH-44 congestion.",
  "impact of cyclone?": "**Cyclone Vayu Impact Assessment:**\n\n• Affected Routes: 12 active shipments\n• Expected Delays: 8-16 hours\n• Risk Level: High (coastal routes)\n• Duration: Next 48-72 hours\n\nI recommend activating contingency plans for shipments HYD-CHN-001 through HYD-CHN-008.",
  "show high-risk suppliers": "**High-Risk Suppliers (Score > 70):**\n\n1. **Tata Motors Chennai** - Score: 78\n   • Issue: Port congestion delays\n   • Action: Pre-position inventory\n\n2. **Mahindra Logistics** - Score: 72\n   • Issue: Weather-related disruptions\n   • Action: Diversify transport modes\n\n3. **Ashok Leyland** - Score: 71\n   • Issue: Capacity constraints\n   • Action: Secure backup supplier",
}

export function AIAssistantPanel({ isOpen, onClose, currentRoute }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
      routeContext: currentRoute,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const lowerText = messageText.toLowerCase()
      let response = "I understand you're asking about supply chain risks. Could you provide more details about the specific route or supplier you're concerned about?"

      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerText.includes(key.split(" ").slice(0, 3).join(" ")) || key.includes(lowerText.split(" ").slice(0, 3).join(" "))) {
          response = value
          break
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, assistantMessage])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">DisruptGuard AI</h2>
                  <p className="text-xs text-muted-foreground">Powered by predictive analytics</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Route Context */}
            {currentRoute && (
              <div className="border-b border-border px-4 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Context:</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentRoute}
                  </Badge>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 py-8">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-xl opacity-50" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-foreground">How can I help?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ask about routes, risks, or recommendations
                    </p>
                  </div>

                  {/* Suggested Prompts */}
                  <div className="w-full space-y-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSend(prompt)}
                        className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary hover:border-primary/50"
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index === messages.length - 1 ? 0.1 : 0 }}
                      className={cn(
                        "flex flex-col gap-1",
                        message.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      {message.routeContext && message.role === "user" && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {message.routeContext}
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-foreground rounded-bl-md"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none">
                            {message.content.split("\n").map((line, i) => (
                              <p key={i} className="mb-1 last:mb-0">
                                {line.replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
                              </p>
                            ))}
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.timestamp)}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start"
                    >
                      <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="h-2 w-2 rounded-full bg-muted-foreground"
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about route risks, delays, or recommendations..."
                    className="bg-secondary border-0 pr-10 focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                AI predictions are estimates and should be verified
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
