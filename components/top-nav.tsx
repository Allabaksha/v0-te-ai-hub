"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  Bell,
  Presentation,
  ChevronDown,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/components/app-context"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/strategic", label: "Strategic View" },
  { href: "/gantt", label: "Portfolio Gantt" },
  { href: "/galaxy", label: "Transformation Galaxy" },
]

export function TopNav() {
  const pathname = usePathname()
  const { setPolarisOpen } = useApp()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Activity className="h-7 w-7 text-white" />
          </div>

          <div>
            <div className="text-xl font-bold text-foreground">
              TE AI Hub
            </div>
            <div className="text-sm text-muted-foreground">
              Transformation OS
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base font-semibold transition ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden xl:block relative w-[420px]">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects, owners, regions..."
            className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 text-base outline-none transition focus:border-primary"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>

          <Button
            onClick={() => setPolarisOpen(true)}
            className="h-12 rounded-full px-6 text-base font-semibold"
          >
            <Presentation className="mr-2 h-5 w-5" />
            Generate VP Deck
          </Button>

          <button className="flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              ER
            </span>

            <span className="hidden md:block text-left">
              <span className="block text-sm font-bold text-foreground">
                Elena Rossi
              </span>
              <span className="block text-xs text-muted-foreground">
                VP, Transformation
              </span>
            </span>

            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}