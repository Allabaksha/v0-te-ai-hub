"use client"

import { Search, Bell, Presentation, Globe2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/app-context"

export function TopNav() {
  const { setPolarisOpen } = useApp()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <Globe2 className="h-4 w-4 text-primary" />
          Global Operations
          <span className="mx-1 h-3 w-px bg-border" />
          <span className="text-foreground">FY26 Portfolio</span>
        </div>

        <div className="relative ml-1 hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Enterprise Search — projects, owners, regions…"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          <Button
            onClick={() => setPolarisOpen(true)}
            className="hidden rounded-full bg-foreground px-4 text-background hover:bg-foreground/90 sm:inline-flex"
          >
            <Presentation className="mr-1.5 h-4 w-4" />
            Generate VP Deck
          </Button>

          <button className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 text-xs font-semibold text-white">
              ER
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-xs font-semibold text-foreground">Elena Rossi</span>
              <span className="block text-[10px] text-muted-foreground">VP, Transformation</span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>
        </div>
      </div>
    </header>
  )
}
