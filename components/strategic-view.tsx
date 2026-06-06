"use client"

import { InvestmentCurve } from "@/components/investment-curve"
import { AnimatedCounter } from "@/components/animated-counter"
import { Check, Workflow, Brain, Bot, Infinity as InfinityIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { name: "Current State", icon: Check },
  { name: "Automation", icon: Workflow },
  { name: "AI Adoption", icon: Brain },
  { name: "Agentic AI", icon: Bot },
  { name: "Autonomous Enterprise", icon: InfinityIcon },
]

const ROADMAP = [
  { fy: "FY25", stage: "Current State", value: 0.4, initiatives: 6, milestone: "Baseline established, foundation platforms assessed", active: false },
  { fy: "FY26", stage: "Automation", value: 2.3, initiatives: 44, milestone: "Process automation scaled across EMIA & AMER", active: true },
  { fy: "FY27", stage: "AI Adoption", value: 5.1, initiatives: 68, milestone: "Enterprise AI co-pilots embedded in core workflows", active: false },
  { fy: "FY28", stage: "Agentic AI", value: 9.4, initiatives: 92, milestone: "Autonomous agents orchestrate end-to-end processes", active: false },
  { fy: "FY29", stage: "Autonomous Enterprise", value: 16.2, initiatives: 120, milestone: "Self-optimizing, agent-run operating model", active: false },
]

export function StrategicView() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Strategic View</span>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">Transformation Journey</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          The five-stage path from manual operations to an autonomous, agent-run enterprise.
        </p>
      </div>

      {/* Stage stepper */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-premium lg:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-0">
          {STAGES.map((s, i) => {
            const active = i <= 1
            return (
              <div key={s.name} className="flex flex-1 items-center gap-3 lg:flex-col lg:gap-2">
                <div className="flex items-center gap-3 lg:w-full lg:flex-col">
                  <span className={cn(
                    "flex h-11 w-11 flex-none items-center justify-center rounded-2xl border transition",
                    active ? "border-primary bg-primary text-white shadow-lg shadow-primary/30" : "border-border bg-secondary text-muted-foreground",
                  )}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  {i < STAGES.length - 1 && (
                    <span className={cn("hidden h-0.5 flex-1 lg:hidden", active ? "bg-primary" : "bg-border")} />
                  )}
                </div>
                <div className="lg:text-center">
                  <div className="text-[11px] font-medium text-muted-foreground">Stage {i + 1}</div>
                  <div className={cn("text-sm font-semibold", active ? "text-foreground" : "text-muted-foreground")}>{s.name}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Investment Curve */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-premium lg:p-8">
        <h2 className="text-lg font-semibold text-foreground">Strategic Investment Curve</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Shift of effort from manual work and human oversight toward automation, analytics and agentic AI.
        </p>
        <InvestmentCurve />
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Transformation Roadmap</h2>
        <p className="mb-5 text-sm text-muted-foreground">Fiscal-year milestones, business value and initiative scale.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {ROADMAP.map((r) => (
            <div
              key={r.fy}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5 shadow-premium transition hover:-translate-y-1 hover:shadow-premium-lg",
                r.active ? "border-primary/40 bg-sidebar text-white" : "border-border bg-card",
              )}
            >
              {r.active && <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />}
              <div className={cn("text-xs font-semibold uppercase tracking-wide", r.active ? "text-primary" : "text-primary")}>{r.fy}</div>
              <div className={cn("mt-1 text-base font-semibold", r.active ? "text-white" : "text-foreground")}>{r.stage}</div>

              <div className={cn("mt-4 text-2xl font-semibold", r.active ? "text-white" : "text-foreground")}>
                <AnimatedCounter value={r.value} prefix="$" suffix="M" decimals={1} />
              </div>
              <div className={cn("text-[11px]", r.active ? "text-white/60" : "text-muted-foreground")}>business value / year</div>

              <div className={cn("mt-3 border-t pt-3 text-sm", r.active ? "border-white/15" : "border-border")}>
                <div className="flex items-center justify-between">
                  <span className={r.active ? "text-white/60" : "text-muted-foreground"}>Initiatives</span>
                  <span className={cn("font-semibold", r.active ? "text-white" : "text-foreground")}>{r.initiatives}</span>
                </div>
              </div>
              <p className={cn("mt-3 text-xs leading-relaxed", r.active ? "text-white/70" : "text-muted-foreground")}>{r.milestone}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
