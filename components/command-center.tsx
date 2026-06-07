"use client"
 
import Link from "next/link"
import { NetworkCanvas } from "@/components/network-canvas"
import { AnimatedCounter } from "@/components/animated-counter"
import { GlobalCoverage } from "@/components/globe"
import {
  PORTFOLIO, CATEGORIES, REGIONS, categoryStats, regionStats, fmtCurrency,
} from "@/lib/data"
import {
  Activity, Clock, Users, DollarSign, ArrowRight, Sparkles,
  Heart, TrendingUp, Banknote, Boxes, Flag,
  Brain, Workflow, BarChart3, Rocket,
} from "lucide-react"
 
const KPIS = [
  { label: "Active Projects", value: PORTFOLIO.activeProjects, icon: Activity, prefix: "", suffix: "" },
  { label: "Weekly Hours Saved", value: PORTFOLIO.weeklyHoursSaved, icon: Clock, prefix: "", suffix: "" },
  { label: "Estimated Value", value: 2.35, icon: DollarSign, prefix: "$", suffix: "M", decimals: 2 },
]
 
const PULSE = [
  { label: "Portfolio Health", value: PORTFOLIO.health, suffix: "", icon: Heart, accent: "text-emerald-600" },
  { label: "Portfolio Growth", value: PORTFOLIO.growth, prefix: "+", suffix: "%", icon: TrendingUp, accent: "text-primary" },
  { label: "Value Generated", value: 2.3, prefix: "$", suffix: "M/yr", decimals: 1, icon: Banknote, accent: "text-emerald-600" },
  { label: "Active Programs", value: PORTFOLIO.activePrograms, icon: Boxes, accent: "text-blue-600" },
  { label: "Upcoming Milestones", value: PORTFOLIO.upcomingMilestones, icon: Flag, accent: "text-amber-600" },
]
 
const CAT_ICONS: Record<string, any> = {
  AI: Brain, Automation: Workflow, Analytics: BarChart3, "Digital Transformation": Rocket,
}
 
const REGION_IMPACT: Record<string, string> = {
  EMIA: "High", AMER: "Very High", GLOBAL: "Strategic",
}
 
export function CommandCenter() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-sidebar text-white shadow-premium-lg">
        <NetworkCanvas />
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar/40 via-sidebar/10 to-transparent" />
        <div className="relative px-6 py-10 lg:px-12 lg:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            LIVE • FY26 PORTFOLIO • EXECUTIVE VIEW
          </span>
 
          <h1 className="mt-5 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight lg:text-5xl">
            Orchestrating the <span className="text-gradient-orange">AI Transformation</span> of the global enterprise
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/70 lg:text-base">
            A unified command center for the FY26 transformation portfolio — every initiative, milestone and dollar of value, governed in one boardroom-grade view.
          </p>
 
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90">
              Explore Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/galaxy" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
              <Sparkles className="h-4 w-4" /> Open Transformation Galaxy
            </Link>
          </div>
 
          {/* KPI cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {KPIS.map((k) => {
              const cardStyle =
                k.label === "Active Projects"
                  ? "from-orange-500 to-orange-700"
                  : k.label === "Weekly Hours Saved"
                  ? "from-blue-500 to-blue-700"
                  : "from-emerald-500 to-emerald-700"
 
              return (
                <div
                  key={k.label}
                  className={`rounded-3xl bg-gradient-to-br ${cardStyle} p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
                      <k.icon className="h-6 w-6" />
                    </span>
                  </div>
 
                  <div className="mt-6 text-4xl font-bold text-white">
                    <AnimatedCounter
                      value={k.value}
                      prefix={k.prefix}
                      suffix={k.suffix}
                      decimals={(k as any).decimals ?? 0}
                    />
                  </div>
 
                  <div className="mt-2 text-sm font-medium text-white/80">
                    {k.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
 
      {/* Executive Pulse */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Executive Pulse</h2>
            <p className="text-sm text-muted-foreground">Real-time portfolio governance signals.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {PULSE.map((p) => (
            <div key={p.label} className="rounded-2xl border border-border bg-card p-5 shadow-premium transition hover:-translate-y-0.5 hover:shadow-premium-lg">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-accent ${p.accent}`}>
                <p.icon className="h-[18px] w-[18px]" />
              </span>
              <div className="mt-4 text-2xl font-semibold text-foreground">
                <AnimatedCounter
                  value={p.value}
                  prefix={(p as any).prefix ?? ""}
                  suffix={(p as any).suffix ?? ""}
                  decimals={(p as any).decimals ?? 0}
                />
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{p.label}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Global Coverage */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-premium lg:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Global Coverage</h2>
          <p className="text-sm text-muted-foreground">Transformation footprint across operating regions.</p>
        </div>
        <GlobalCoverage
          regions={REGIONS.map((r) => {
            const s = regionStats(r)
            return { label: r, count: s.count, value: fmtCurrency(s.value), impact: REGION_IMPACT[r] }
          })}
        />
      </section>
 
      {/* Transformation Categories */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Transformation Categories</h2>
          <p className="text-sm text-muted-foreground">Value contribution by transformation lever.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((c) => {
            const s = categoryStats(c)
            const Icon = CAT_ICONS[c]
            return (
              <div key={c} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-premium transition hover:-translate-y-1 hover:shadow-premium-lg">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition group-hover:bg-primary/10" />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 text-white shadow-lg shadow-primary/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 text-base font-semibold text-foreground">{c}</h3>
                <div className="relative mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Initiatives</span>
                    <span className="font-semibold text-foreground"><AnimatedCounter value={s.count} /></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Value generated</span>
                    <span className="font-semibold text-foreground">{fmtCurrency(s.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-semibold text-emerald-600">+{s.growth}%</span>
                  </div>
                </div>
                <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500"
                    style={{ width: `${Math.min(100, s.growth * 3)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}