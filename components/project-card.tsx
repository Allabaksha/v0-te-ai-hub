"use client"

import type { Project } from "@/lib/data"
import { STATUS_META, fmtCurrency, fmtNumber } from "@/lib/data"
import { useApp } from "@/components/app-context"
import { cn } from "@/lib/utils"
import { MapPin, User, Clock } from "lucide-react"

export function ProjectCard({ project: p }: { project: Project }) {
  const { openProject } = useApp()
  const meta = STATUS_META[p.status]

  return (
    <button
      onClick={() => openProject(p)}
      className="group flex w-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-premium transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-premium-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-mono text-[11px] text-muted-foreground">{p.id}</span>
          <h3 className="mt-0.5 truncate text-base font-semibold text-foreground group-hover:text-primary">{p.name}</h3>
        </div>
        <span className={cn("flex flex-none items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", meta.color)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
          {p.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {p.owner}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.region}</span>
      </div>

      <div className="mt-3 inline-flex w-fit rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
        {p.category}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <div className="text-base font-semibold text-foreground">{fmtCurrency(p.annualValue)}</div>
          <div className="text-[11px] text-muted-foreground">Annual value</div>
        </div>
        <div>
          <div className="inline-flex items-center gap-1 text-base font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />{fmtNumber(p.weeklyHours)}
          </div>
          <div className="text-[11px] text-muted-foreground">Weekly hrs saved</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{p.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: meta.bar }} />
        </div>
      </div>
    </button>
  )
}
