"use client"
 
import { useMemo, useState } from "react"
import {
  PROJECTS, CATEGORIES, REGIONS, STATUSES, PRIORITIES,
} from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { Search, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
 
type FilterKey = "category" | "region" | "status" | "priority"
 
// Dot colors per category — adjust to match your brand tokens
const CATEGORY_COLORS: Record<string, string> = {
  AI: "bg-blue-500",
  Automation: "bg-orange-500",
  Analytics: "bg-violet-500",
  "Digital Transformation": "bg-emerald-500",
}
 
// Dot colors per status
const STATUS_COLORS: Record<string, string> = {
  Live: "bg-emerald-500",
  "In Progress": "bg-amber-400",
  "In Discovery": "bg-blue-500",
  Planned: "bg-slate-400",
}
 
export function ProjectLibrary() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    category: "", region: "", status: "", priority: "",
  })
  const [minHours, setMinHours] = useState(0)
 
  const set = (k: FilterKey, v: string) =>
    setFilters((f) => ({ ...f, [k]: v === f[k] ? "" : v }))
 
  const reset = () => {
    setFilters({ category: "", region: "", status: "", priority: "" })
    setSearch("")
    setMinHours(0)
  }
 
  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (search && !`${p.name} ${p.id} ${p.owner}`.toLowerCase().includes(search.toLowerCase())) return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.region && p.region !== filters.region) return false
      if (filters.status && p.status !== filters.status) return false
      if (filters.priority && p.priority !== filters.priority) return false
      if (p.weeklyHours < minHours) return false
      return true
    })
  }, [search, filters, minHours])
 
  // Pre-compute counts for sidebar badges
  const categoryCounts = useMemo(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c, PROJECTS.filter((p) => p.category === c).length])),
    []
  )
  const regionCounts = useMemo(() =>
    Object.fromEntries(REGIONS.map((r) => [r, PROJECTS.filter((p) => p.region === r).length])),
    []
  )
  const statusCounts = useMemo(() =>
    Object.fromEntries(STATUSES.map((s) => [s, PROJECTS.filter((p) => p.status === s).length])),
    []
  )
  const priorityCounts = useMemo(() =>
    Object.fromEntries(PRIORITIES.map((pr) => [pr, PROJECTS.filter((p) => p.priority === pr).length])),
    []
  )
 
  const activeCount =
    Object.values(filters).filter(Boolean).length + (minHours > 0 ? 1 : 0)
 
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Portfolio</p>
          <h1 className="text-3xl font-bold text-foreground">Project Library</h1>
          <p className="mt-1 text-muted-foreground">
            Browse every initiative in motion across the enterprise.
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">{filtered.length}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Showing of {PROJECTS.length}
          </div>
        </div>
      </div>
 
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
 
        {/* ── LEFT FILTER SIDEBAR ── */}
        <div className="sticky top-24 h-fit rounded-2xl border border-border bg-card p-5 shadow-sm space-y-6">
 
          {/* Header */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Filters</span>
          </div>
 
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search initiatives, PMs, teams…"
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
            />
          </div>
 
          {/* Category */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Category
            </p>
            <div className="space-y-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => set("category", c)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition",
                    filters.category === c
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", CATEGORY_COLORS[c] ?? "bg-slate-400")} />
                    {c}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {categoryCounts[c] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
 
          {/* Weekly Hours Saved */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Weekly Hours Saved
            </p>
            <input
              type="range"
              min={0}
              max={140}
              step={10}
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>0H</span>
              <span className="font-semibold text-foreground">{minHours > 0 ? `≥ ${minHours}H` : "Range"}</span>
              <span>900H</span>
            </div>
          </div>
 
          {/* Region — pill buttons */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Region
            </p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => set("region", r)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    filters.region === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-accent"
                  )}
                >
                  {r}
                  <span className="ml-1 text-muted-foreground">{regionCounts[r] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
 
          {/* Status — dot + count rows */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Status
            </p>
            <div className="space-y-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition",
                    filters.status === s
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", STATUS_COLORS[s] ?? "bg-slate-400")} />
                    {s}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {statusCounts[s] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
 
          {/* Priority — checkbox-style rows */}
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Priority
            </p>
            <div className="space-y-1.5">
              {PRIORITIES.map((pr) => (
                <button
                  key={pr}
                  onClick={() => set("priority", pr)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition",
                    filters.priority === pr
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-accent"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {/* Checkbox visual */}
                    <span className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border text-[10px] font-bold transition",
                      filters.priority === pr
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background"
                    )}>
                      {filters.priority === pr && "✓"}
                    </span>
                    {pr}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {priorityCounts[pr] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
 
          {/* Clear filters */}
          {activeCount > 0 && (
            <button
              onClick={reset}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Clear Filters ({activeCount})
            </button>
          )}
        </div>
 
        {/* ── RIGHT CONTENT GRID ── */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
              No initiatives match the current filters.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
 
      </div>
    </div>
  )
}
