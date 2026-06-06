"use client"

import { useState } from "react"
import { useApp } from "@/components/app-context"
import { cn } from "@/lib/utils"
import { PORTFOLIO, PROJECTS, fmtCurrency, fmtNumber } from "@/lib/data"
import {
  Sparkles, X, Send, FileText, Search, Lightbulb, ShieldAlert, TrendingUp, Presentation,
} from "lucide-react"

const CAPABILITIES = [
  { icon: FileText, label: "Executive Summary", q: "Give me an executive summary of the FY26 portfolio." },
  { icon: Search, label: "Portfolio Search", q: "Which AI projects are live?" },
  { icon: Lightbulb, label: "Project Insights", q: "What's driving the most value?" },
  { icon: ShieldAlert, label: "Risk Analysis", q: "Where are the biggest delivery risks?" },
  { icon: TrendingUp, label: "Recommendations", q: "Recommend next transformation moves." },
  { icon: Presentation, label: "VP Deck", q: "Generate a VP deck outline." },
]

type Msg = { role: "user" | "assistant"; text: string }

function answer(q: string): string {
  const ql = q.toLowerCase()
  const live = PROJECTS.filter((p) => p.status === "Live")
  if (ql.includes("summary")) {
    return `FY26 Portfolio comprises ${PORTFOLIO.activeProjects} active initiatives generating ${fmtCurrency(PORTFOLIO.valuePerYear)}/year and saving ${fmtNumber(PORTFOLIO.weeklyHoursSaved)} weekly hours (~${PORTFOLIO.fteSavings} FTE). Portfolio health is ${PORTFOLIO.health}/100 with +${PORTFOLIO.growth}% growth. ${PORTFOLIO.upcomingMilestones} milestones are due this quarter.`
  }
  if (ql.includes("live")) {
    return `${live.length} initiatives are Live, led by ${live.slice(0, 3).map((p) => p.name).join(", ")}. Combined they deliver ${fmtCurrency(live.reduce((s, p) => s + p.annualValue, 0))} in annual value.`
  }
  if (ql.includes("risk")) {
    const risk = PROJECTS.filter((p) => p.priority === "Critical" && p.progress < 70)
    return `${risk.length} critical-priority initiatives are below 70% progress and warrant governance attention — notably ${risk.slice(0, 2).map((p) => p.name).join(", ") || "none currently flagged"}. Recommend weekly steering review and dependency unblocking.`
  }
  if (ql.includes("value") || ql.includes("driving")) {
    const top = [...PROJECTS].sort((a, b) => b.annualValue - a.annualValue).slice(0, 3)
    return `Top value drivers: ${top.map((p) => `${p.name} (${fmtCurrency(p.annualValue)})`).join(", ")}. Together they represent the strongest ROI signal in the portfolio.`
  }
  if (ql.includes("recommend")) {
    return `Recommendations: 1) Fast-track Agentic AI pilots building on Polaris. 2) Consolidate overlapping Automation initiatives in EMIA. 3) Reallocate capacity from Discovery-stage low-priority items to in-flight Live programs to compound value.`
  }
  if (ql.includes("deck")) {
    return `VP Deck outline ready: 1) Portfolio at a Glance, 2) Value & FTE Impact, 3) Transformation Journey FY25→FY29, 4) Regional Coverage, 5) Top Initiatives & Risks, 6) Next-Quarter Recommendations. Click "Generate VP Deck" to export.`
  }
  return `I analyzed the portfolio of ${PORTFOLIO.activeProjects} initiatives. Ask me about value drivers, risks, regional coverage, or to generate an executive summary.`
}

export function PolarisAssistant() {
  const { polarisOpen, setPolarisOpen } = useApp()
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hello, I'm Polaris — your AI transformation co-pilot. How can I support your portfolio review today?" },
  ])
  const [input, setInput] = useState("")

  const ask = (q: string) => {
    if (!q.trim()) return
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answer(q) }])
    setInput("")
  }

  return (
    <>
      {!polarisOpen && (
        <button
          onClick={() => setPolarisOpen(true)}
          className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 shadow-premium-lg shadow-primary/40 transition hover:scale-105"
          aria-label="Open Polaris AI assistant"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" style={{ animationDuration: "3s" }} />
          <Sparkles className="relative h-6 w-6 text-white" />
        </button>
      )}

      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex max-h-[640px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-premium-lg transition-all duration-300",
          polarisOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="relative flex items-center gap-3 bg-sidebar px-5 py-4 text-white">
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <div className="relative flex-1">
            <div className="text-sm font-semibold">Polaris AI</div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online · Portfolio-aware
            </div>
          </div>
          <button onClick={() => setPolarisOpen(false)} className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/40 px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border",
              )}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border bg-background px-3 pb-3 pt-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {CAPABILITIES.map((c) => (
              <button
                key={c.label}
                onClick={() => ask(c.q)}
                className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <c.icon className="h-3 w-3" />
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder="Ask Polaris about the portfolio…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => ask(input)} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
