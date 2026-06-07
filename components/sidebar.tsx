"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity } from "lucide-react"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/strategic", label: "Strategic View" },
  { href: "/gantt", label: "Portfolio Gantt" },
  { href: "/galaxy", label: "Transformation Galaxy" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-orange-500" />
          <span className="font-semibold">TE AI Hub</span>
        </div>

        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "font-medium text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="rounded-full bg-orange-500 px-4 py-2 text-sm text-white">
          Generate VP Deck
        </button>
      </div>
    </header>
  )
}