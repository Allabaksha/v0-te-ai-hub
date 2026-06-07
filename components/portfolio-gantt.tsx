"use client"

import { useMemo, useState, useRef, type ReactElement } from "react"
import { PROJECTS, CATEGORIES, STATUS_META, fmtCurrency, fmtNumber, type Project, type Category } from "@/lib/data"
import { useApp } from "@/components/app-context"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Diamond } from "lucide-react"

const START = new Date(2025, 0, 1)
const END = new Date(2029, 11, 31)
const TOTAL_MS = END.getTime() - START.getTime()

type View = "Weekly" | "Monthly" | "Quarterly" | "Yearly"
const VIEW_PX_PER_DAY: Record<View, number> = { Weekly: 7, Monthly: 2.4, Quarterly: 1.1, Yearly: 0.55 }

function buildColumns(view: View, pxPerDay: number) {
  const cols: { label: string; left: number; width: number; major?: boolean }[] = []
  const day = 86400000
  if (view === "Yearly" || view === "Quarterly") {
    for (let y = 2025; y <= 2029; y++) {
      for (let q = 0; q < (view === "Yearly" ? 1 : 4); q++) {
        const s = new Date(y, q * 3, 1)
        const e = new Date(y, q * 3 + (view === "Yearly" ? 12 : 3), 1)
        const left = ((s.getTime() - START.getTime()) / day) * pxPerDay
        const width = ((e.getTime() - s.getTime()) / day) * pxPerDay
        cols.push({ label: view === "Yearly" ? `${y}` : `Q${q + 1} ${y}`, left, width, major: q === 0 })
      }
    }
  } else {
    const stepMonths = 1
    for (let y = 2025; y <= 2029; y++) {
      for (let m = 0; m < 12; m += stepMonths) {
        const s = new Date(y, m, 1)
        const e = new Date(y, m + stepMonths, 1)
        const left = ((s.getTime() - START.getTime()) / day) * pxPerDay
        const width = ((e.getTime() - s.getTime()) / day) * pxPerDay
        const label = view === "Weekly"
          ? s.toLocaleDateString("en-US", { month: "short", year: m === 0 ? "2-digit" : undefined })
          : s.toLocaleDateString("en-US", { month: "short" })
        cols.push({ label: m === 0 ? `${label} '${String(y).slice(2)}` : label, left, width, major: m === 0 })
      }
    }
  }
  return cols
}

function pos(dateStr: string, pxPerDay: number) {
  const d = new Date(dateStr).getTime()
  const clamped = Math.max(START.getTime(), Math.min(END.getTime(), d))
  return ((clamped - START.getTime()) / 86400000) * pxPerDay
}

export function PortfolioGantt() {
  const { openProject } = useApp()
  const [view, setView] = useState<View>("Quarterly")
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORIES.map((c) => [c, true])),
  )
  const [hover, setHover] = useState<{ p: Project; x: number; y: number } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const pxPerDay = VIEW_PX_PER_DAY[view]
  const totalWidth = (TOTAL_MS / 86400000) * pxPerDay
  const columns = useMemo(() => buildColumns(view, pxPerDay), [view, pxPerDay])

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      cat,
      projects: PROJECTS.filter((p) => p.category === cat),
    }))
  }, [])

  const todayLeft = pos(new Date().toISOString(), pxPerDay)
  const ROW = 52 // slightly taller rows to breathe with bigger fonts

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {(["Weekly", "Monthly", "Quarterly", "Yearly"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg px-4 py-2 text-base font-semibold transition",
                view === v ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
        {Object.entries(STATUS_META).map(([k, m]) => (
          <span key={k} className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: m.bar }} />
            <span className="font-medium">{m.label}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <Diamond className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="font-medium">Milestone</span>
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
        <div className="flex">
          {/* Fixed task list */}
          <div className="w-[300px] flex-none border-r border-border">
            {/* Header */}
            <div className="flex h-[60px] items-center border-b border-border bg-secondary/60 px-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Task / Initiative
            </div>

            {grouped.map(({ cat, projects }) => (
              <div key={cat}>
                {/* Category row */}
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [cat]: !e[cat] }))}
                  className="flex h-[52px] w-full items-center gap-2 border-b border-border bg-secondary/30 px-3 text-left text-base font-bold text-foreground hover:bg-secondary/60"
                >
                  {expanded[cat]
                    ? <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  <span className="truncate">{cat}</span>
                  <span className="ml-auto rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {projects.length}
                  </span>
                </button>

                {expanded[cat] && projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openProject(p)}
                    className="flex h-[52px] w-full items-center gap-2.5 border-b border-border px-3 pl-10 text-left hover:bg-accent"
                  >
                    <span className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: STATUS_META[p.status].bar }} />
                    <span className="truncate text-sm font-medium text-foreground">{p.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Scrollable timeline */}
          <div ref={scrollRef} className="relative flex-1 overflow-x-auto">
            <div style={{ width: totalWidth, minWidth: "100%" }} className="relative">

              {/* Header */}
              <div className="relative flex h-[60px] border-b border-border bg-secondary/60">
                {columns.map((c, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute top-0 flex h-full items-center justify-center border-r text-xs font-semibold text-muted-foreground",
                      c.major ? "border-border" : "border-border/50",
                    )}
                    style={{ left: c.left, width: c.width }}
                  >
                    {c.width > 32 && <span className="truncate px-1">{c.label}</span>}
                  </div>
                ))}
              </div>

              {/* Grid + bars */}
              <div className="relative">
                {/* vertical gridlines */}
                {columns.map((c, i) => (
                  <div
                    key={i}
                    className={cn("absolute top-0 bottom-0 border-r", c.major ? "border-border" : "border-border/40")}
                    style={{ left: c.left, height: "100%" }}
                  />
                ))}

                {/* today line */}
                <div className="absolute top-0 bottom-0 z-10 w-px bg-primary" style={{ left: todayLeft }}>
                  <span className="absolute -top-0 left-1 rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                    Today
                  </span>
                </div>

                {grouped.map(({ cat, projects }) => {
                  const rows: ReactElement[] = []

                  // parent summary bar
                  const starts = projects.map((p) => pos(p.startDate, pxPerDay))
                  const ends = projects.map((p) => pos(p.endDate, pxPerDay))
                  const pLeft = Math.min(...starts)
                  const pRight = Math.max(...ends)

                  rows.push(
                    <div key={`${cat}-parent`} className="relative border-b border-border" style={{ height: ROW }}>
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded-md bg-foreground/80"
                        style={{ left: pLeft, width: Math.max(8, pRight - pLeft), height: 12 }}
                      >
                        <span className="absolute -left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground/80" />
                        <span className="absolute -right-0 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground/80" />
                      </div>
                    </div>,
                  )

                  if (expanded[cat]) {
                    projects.forEach((p) => {
                      const left = pos(p.startDate, pxPerDay)
                      const width = Math.max(10, pos(p.endDate, pxPerDay) - left)
                      const meta = STATUS_META[p.status]
                      const mileLeft = pos(p.milestones[2]?.date ?? p.endDate, pxPerDay)

                      rows.push(
                        <div key={p.id} className="relative border-b border-border" style={{ height: ROW }}>
                          {/* bar */}
                          <div
                            onClick={() => openProject(p)}
                            onMouseEnter={(e) => {
                              const rect = (scrollRef.current as HTMLDivElement).getBoundingClientRect()
                              setHover({ p, x: e.clientX - rect.left, y: e.clientY - rect.top })
                            }}
                            onMouseMove={(e) => {
                              const rect = (scrollRef.current as HTMLDivElement).getBoundingClientRect()
                              setHover({ p, x: e.clientX - rect.left, y: e.clientY - rect.top })
                            }}
                            onMouseLeave={() => setHover(null)}
                            className="group absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-md shadow-sm transition hover:brightness-95"
                            style={{ left, width, height: 26, backgroundColor: `${meta.bar}33`, border: `1.5px solid ${meta.bar}` }}
                          >
                            <div className="h-full rounded-md" style={{ width: `${p.progress}%`, backgroundColor: meta.bar }} />
                            {width > 60 && (
                              <span className="absolute inset-0 flex items-center truncate px-2 text-xs font-bold text-foreground/80">
                                {p.progress}%
                              </span>
                            )}
                          </div>

                          {/* milestone diamond */}
                          <span
                            className="absolute top-1/2 z-[5] -translate-y-1/2 -translate-x-1/2"
                            style={{ left: mileLeft }}
                          >
                            <Diamond className="h-3.5 w-3.5 fill-primary text-primary" />
                          </span>
                        </div>,
                      )
                    })
                  }

                  return <div key={cat}>{rows}</div>
                })}
              </div>
            </div>

            {/* Tooltip */}
            {hover && (
              <div
                className="pointer-events-none absolute z-30 w-68 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-premium-lg"
                style={{
                  left: Math.min(hover.x + 12, (scrollRef.current?.clientWidth ?? 600) - 280),
                  top: hover.y + 12,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{hover.p.id}</span>
                  <span className={cn("rounded border px-1.5 py-0.5 text-xs font-semibold", STATUS_META[hover.p.status].color)}>
                    {hover.p.status}
                  </span>
                </div>
                <div className="mt-1.5 text-base font-bold">{hover.p.name}</div>
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="text-right font-semibold">{hover.p.owner}</span>
                  <span className="text-muted-foreground">Region</span>
                  <span className="text-right font-semibold">{hover.p.region}</span>
                  <span className="text-muted-foreground">Start</span>
                  <span className="text-right font-semibold">{hover.p.startDate}</span>
                  <span className="text-muted-foreground">End</span>
                  <span className="text-right font-semibold">{hover.p.endDate}</span>
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-right font-semibold">{hover.p.progress}%</span>
                  <span className="text-muted-foreground">Hours saved</span>
                  <span className="text-right font-semibold">{fmtNumber(hover.p.weeklyHours)}/wk</span>
                  <span className="text-muted-foreground">Annual value</span>
                  <span className="text-right font-semibold">{fmtCurrency(hover.p.annualValue)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}