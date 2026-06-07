"use client"

import { InvestmentCurve } from "@/components/investment-curve"
import { AnimatedCounter } from "@/components/animated-counter"
import { Check, Workflow, Brain, Bot, Infinity as InfinityIcon, TrendingUp, Zap, Target, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  {
    name: "Current State",
    icon: Check,
    color: "from-slate-500 to-slate-700",
    glow: "shadow-slate-500/40",
    ring: "ring-slate-400/30",
    lineColor: "from-slate-400 to-orange-400",
  },
  {
    name: "Automation",
    icon: Workflow,
    color: "from-orange-500 to-orange-700",
    glow: "shadow-orange-500/40",
    ring: "ring-orange-400/30",
    lineColor: "from-orange-400 to-amber-400",
  },
  {
    name: "AI Adoption",
    icon: Brain,
    color: "from-amber-400 to-orange-500",
    glow: "shadow-amber-400/30",
    ring: "ring-amber-400/20",
    lineColor: "from-amber-400 to-blue-400",
  },
  {
    name: "Agentic AI",
    icon: Bot,
    color: "from-blue-500 to-violet-600",
    glow: "shadow-blue-500/30",
    ring: "ring-blue-400/20",
    lineColor: "from-blue-400 to-emerald-400",
  },
  {
    name: "Autonomous Enterprise",
    icon: InfinityIcon,
    color: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-400/30",
    ring: "ring-emerald-400/20",
    lineColor: "",
  },
]

const ROADMAP = [
  {
    fy: "FY25",
    stage: "Current State",
    value: 0.4,
    initiatives: 6,
    milestone: "Baseline established, foundation platforms assessed",
    active: false,
    accent: "from-slate-500 to-slate-700",
    badge: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    dot: "bg-slate-400",
  },
  {
    fy: "FY26",
    stage: "Automation",
    value: 2.3,
    initiatives: 44,
    milestone: "Process automation scaled across EMIA & AMER",
    active: true,
    accent: "from-orange-500 to-orange-700",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
  {
    fy: "FY27",
    stage: "AI Adoption",
    value: 5.1,
    initiatives: 68,
    milestone: "Enterprise AI co-pilots embedded in core workflows",
    active: false,
    accent: "from-amber-400 to-orange-500",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  {
    fy: "FY28",
    stage: "Agentic AI",
    value: 9.4,
    initiatives: 92,
    milestone: "Autonomous agents orchestrate end-to-end processes",
    active: false,
    accent: "from-blue-500 to-violet-600",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  {
    fy: "FY29",
    stage: "Autonomous Enterprise",
    value: 16.2,
    initiatives: 120,
    milestone: "Self-optimizing, agent-run operating model",
    active: false,
    accent: "from-emerald-400 to-teal-600",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
]

const KPI_CARDS = [
  {
    label: "Current Value",
    value: 2.3,
    prefix: "$",
    suffix: "M",
    decimals: 1,
    icon: TrendingUp,
    gradient: "from-orange-500 via-orange-600 to-red-600",
    glow: "shadow-orange-500/30",
    pattern: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)",
    tag: "Live · FY26",
  },
  {
    label: "Active Programs",
    value: 44,
    prefix: "",
    suffix: "",
    decimals: 0,
    icon: Zap,
    gradient: "from-blue-500 via-blue-600 to-violet-700",
    glow: "shadow-blue-500/30",
    pattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 60%)",
    tag: "Across all regions",
  },
  {
    label: "Portfolio Growth",
    value: 18,
    prefix: "+",
    suffix: "%",
    decimals: 0,
    icon: Target,
    gradient: "from-emerald-400 via-emerald-500 to-teal-700",
    glow: "shadow-emerald-400/30",
    pattern: "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12) 0%, transparent 60%)",
    tag: "YoY increase",
  },
  {
    label: "Target FY29",
    value: 16.2,
    prefix: "$",
    suffix: "M",
    decimals: 1,
    icon: ArrowRight,
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    glow: "shadow-violet-500/30",
    pattern: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)",
    tag: "Autonomous Enterprise",
  },
]

export function StrategicView() {
  return (
    <div className="space-y-10">

      {/* ── Page Header ── */}
      <div className="relative">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Strategic View</span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
          Transformation Journey
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The five-stage path from manual operations to an autonomous, agent-run enterprise.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((k) => (
          <div
            key={k.label}
            className={cn(
              "group relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
              k.gradient,
              k.glow,
            )}
          >
            {/* Decorative overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: k.pattern }}
            />
            {/* Decorative circle */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:bg-white/15" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <k.icon className="h-5 w-5 text-white" />
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur">
                {k.tag}
              </span>
            </div>

            <div className="relative mt-5 text-4xl font-bold tracking-tight">
              <AnimatedCounter
                value={k.value}
                prefix={k.prefix}
                suffix={k.suffix}
                decimals={k.decimals}
              />
            </div>
            <div className="relative mt-1 text-sm font-medium text-white/70">{k.label}</div>

            {/* Bottom shimmer line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* ── Stage Stepper ── */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-premium lg:p-10">
        <h2 className="mb-8 text-base font-semibold text-foreground">Maturity Stages</h2>
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
          {STAGES.map((s, i) => {
            const isActive = i <= 1
            const isPast = i === 0

            return (
              <div key={s.name} className="relative flex flex-1 flex-col items-center">
                {/* Connector line between stages */}
                {i < STAGES.length - 1 && (
                  <div className="absolute left-1/2 top-7 hidden h-0.5 w-full lg:block"
                    style={{ left: "50%", width: "100%" }}>
                    <div
                      className={cn(
                        "h-full w-full bg-gradient-to-r",
                        isActive ? s.lineColor : "from-border to-border",
                      )}
                    />
                  </div>
                )}

                {/* Icon bubble */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300",
                      isActive
                        ? `bg-gradient-to-br ${s.color} ${s.glow} shadow-xl ring-4 ${s.ring}`
                        : "border border-border bg-secondary",
                    )}
                  >
                    {/* Animated ping for active stage */}
                    {i === 1 && (
                      <span className="absolute -inset-1 animate-ping rounded-2xl bg-orange-400/20" />
                    )}
                    <s.icon className={cn("h-6 w-6", isActive ? "text-white" : "text-muted-foreground")} />
                  </div>

                  {/* Stage label */}
                  <div className="mt-3 text-center">
                    <div
                      className={cn(
                        "mb-0.5 text-[10px] font-bold uppercase tracking-widest",
                        isActive ? "text-primary" : "text-muted-foreground/50",
                      )}
                    >
                      Stage {i + 1}
                    </div>
                    <div
                      className={cn(
                        "max-w-[100px] text-xs font-semibold leading-tight",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.name}
                    </div>

                    {/* Active badge */}
                    {i === 1 && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        Now
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Investment Curve ── */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-premium lg:p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">Strategic Investment Curve</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Shift of effort from manual work and human oversight toward automation, analytics and agentic AI.
        </p>
        <InvestmentCurve />
      </section>

      {/* ── Roadmap ── */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Transformation Roadmap</h2>
            <p className="text-sm text-muted-foreground">Fiscal-year milestones, business value and initiative scale.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {ROADMAP.map((r, i) => (
            <div
              key={r.fy}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1.5",
                r.active
                  ? "border-orange-500/30 bg-sidebar text-white shadow-xl shadow-orange-500/10"
                  : "border-border bg-card hover:border-border/80 hover:shadow-lg",
              )}
            >
              {/* Top gradient accent bar */}
              <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", r.accent)} />

              {/* Glow blob for active */}
              {r.active && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />
              )}

              {/* FY badge */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                    r.active
                      ? "border-orange-500/30 bg-orange-500/15 text-orange-400"
                      : r.badge,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", r.dot)} />
                  {r.fy}
                </span>
                {r.active && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Live
                  </span>
                )}
              </div>

              {/* Stage name */}
              <div className={cn("mt-3 text-sm font-bold", r.active ? "text-white" : "text-foreground")}>
                {r.stage}
              </div>

              {/* Value */}
              <div className={cn("mt-4 text-3xl font-bold tracking-tight", r.active ? "text-white" : "text-foreground")}>
                <AnimatedCounter value={r.value} prefix="$" suffix="M" decimals={1} />
              </div>
              <div className={cn("text-[10px] font-medium uppercase tracking-wide", r.active ? "text-white/50" : "text-muted-foreground")}>
                Value / year
              </div>

              {/* Divider */}
              <div className={cn("my-3 h-px", r.active ? "bg-white/10" : "bg-border")} />

              {/* Initiatives count with progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={r.active ? "text-white/60" : "text-muted-foreground"}>Initiatives</span>
                  <span className={cn("font-bold", r.active ? "text-white" : "text-foreground")}>{r.initiatives}</span>
                </div>
                {/* Progress bar relative to max (120) */}
                <div className={cn("h-1 overflow-hidden rounded-full", r.active ? "bg-white/10" : "bg-secondary")}>
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", r.accent)}
                    style={{ width: `${Math.round((r.initiatives / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Milestone text */}
              <p className={cn("mt-3 text-[11px] leading-relaxed", r.active ? "text-white/60" : "text-muted-foreground")}>
                {r.milestone}
              </p>

              {/* Arrow hover indicator */}
              <div className={cn(
                "absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100",
                r.active ? "bg-white/10" : "bg-accent",
              )}>
                <ArrowRight className={cn("h-3.5 w-3.5", r.active ? "text-white" : "text-muted-foreground")} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}