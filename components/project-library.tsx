"use client"

import { useMemo, useState } from "react"
import {
  PROJECTS, CATEGORIES, REGIONS, STATUSES, PRIORITIES,
} from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterKey = "category" | "region" | "status" | "priority"

function Select({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
      >
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export function ProjectLibrary() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    category: "", region: "", status: "", priority: "",
  })
  const [minHours, setMinHours] = useState(0)

  const set = (k: FilterKey, v: string) => setFilters((f) => ({ ...f, [k]: v }))
  const reset = () => { setFilters({ category: "", region: "", status: "", priority: "" }); setSearch(""); setMinHours(0) }

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

  const activeCount = Object.values(filters).filter(Boolean).length + (minHours > 0 ? 1 : 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Project Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {PROJECTS.length} initiatives across the FY26 transformation portfolio.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-premium">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
          {activeCount > 0 && (
            <button onClick={reset} className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              Clear {activeCount} <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-2">
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, ID or owner…"
                className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
          <Select label="Category" value={filters.category} options={CATEGORIES} onChange={(v) => set("category", v)} />
          <Select label="Region" value={filters.region} options={REGIONS} onChange={(v) => set("region", v)} />
          <Select label="Status" value={filters.status} options={STATUSES} onChange={(v) => set("status", v)} />
          <Select label="Priority" value={filters.priority} options={PRIORITIES} onChange={(v) => set("priority", v)} />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <label className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>Min Weekly Hours Saved</span>
            <span className="text-sm font-semibold text-primary">{minHours} hrs</span>
          </label>
          <input
            type="range" min={0} max={140} step={10} value={minHours}
            onChange={(e) => setMinHours(Number(e.target.value))}
            className="accent-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
          No initiatives match the current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
