"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderKanban,
  Compass,
  GanttChartSquare,
  Sparkles,
  Activity,
  ShieldCheck,
} from "lucide-react"
import { PORTFOLIO } from "@/lib/data"

const NAV = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/projects", label: "Project Library", icon: FolderKanban },
  { href: "/strategic", label: "Strategic View", icon: Compass },
  { href: "/gantt", label: "Portfolio Gantt", icon: GanttChartSquare },
  { href: "/galaxy", label: "Transformation Galaxy", icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Activity className="h-6 w-6 text-primary-foreground" strokeWidth={2.4} />
          <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
        </div>
        <div className="leading-tight">
          <div className="text-base font-semibold tracking-tight text-white">TE AI Hub</div>
          <div className="text-xs font-medium text-sidebar-foreground/60">Transformation OS</div>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-4">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/40">
          Portfolio
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-white shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <Icon className={cn("h-[18px] w-[18px] transition-colors", active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="m-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Portfolio Health
          </span>
          <span className="text-sm font-semibold text-white">{PORTFOLIO.health}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sidebar-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            style={{ width: `${PORTFOLIO.health}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-sidebar-foreground/50">
          <span>FY26 Portfolio</span>
          <span className="text-emerald-400">+{PORTFOLIO.growth}% growth</span>
        </div>
      </div>
    </aside>
  )
}
