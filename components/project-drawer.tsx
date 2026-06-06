"use client"

import { useApp } from "@/components/app-context"
import { STATUS_META, PRIORITY_META, fmtCurrency, fmtNumber } from "@/lib/data"
import {
  X, User, MapPin, Layers, Flag, Calendar, DollarSign, Clock,
  CheckCircle2, Circle, GitBranch,
} from "lucide-react"
import { cn } from "@/lib/utils"

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
      <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  )
}

export function ProjectDrawer() {
  const { selectedProject: p, closeProject } = useApp()

  return (
    <>
      <div
        onClick={closeProject}
        className={cn(
          "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300",
          p ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-premium-lg transition-transform duration-300 ease-out sm:max-w-lg",
          p ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Project details"
      >
        {p && (
          <>
            <div className="relative overflow-hidden border-b border-border bg-sidebar px-6 py-6 text-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs text-white/80">{p.id}</span>
                    <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", STATUS_META[p.status].color)}>
                      {p.status}
                    </span>
                  </div>
                  <h2 className="mt-3 text-balance text-xl font-semibold leading-snug">{p.name}</h2>
                  <p className="mt-1 text-sm text-white/60">{p.category} · {p.region}</p>
                </div>
                <button
                  onClick={closeProject}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-5">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Progress</span>
                  <span className="font-semibold text-white">{p.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-2 gap-3">
                <Field icon={User} label="Owner" value={p.owner} />
                <Field icon={MapPin} label="Region" value={p.region} />
                <Field icon={Layers} label="Category" value={p.category} />
                <Field icon={Flag} label="Priority" value={
                  <span className={cn("inline-block rounded border px-1.5 text-xs", PRIORITY_META[p.priority])}>{p.priority}</span>
                } />
                <Field icon={Calendar} label="Start Date" value={p.startDate} />
                <Field icon={Calendar} label="End Date" value={p.endDate} />
                <Field icon={DollarSign} label="Annual Value" value={fmtCurrency(p.annualValue)} />
                <Field icon={Clock} label="Weekly Hours Saved" value={`${fmtNumber(p.weeklyHours)} hrs`} />
              </div>

              <div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">Description</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Milestones</h3>
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {p.milestones.map((m, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[26px] top-0.5 bg-background">
                        {m.done
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          : <Circle className="h-4 w-4 text-muted-foreground/40" />}
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-sm font-medium", m.done ? "text-foreground" : "text-muted-foreground")}>{m.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">{m.date}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <GitBranch className="h-4 w-4 text-primary" /> Dependencies
                </h3>
                {p.dependencies.length ? (
                  <div className="flex flex-wrap gap-2">
                    {p.dependencies.map((d) => (
                      <span key={d} className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-foreground">{d}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upstream dependencies.</p>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
