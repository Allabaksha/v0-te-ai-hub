"use client"

import { useEffect, useRef, useState } from "react"

type Point = { lat: number; lng: number }

const DOTS: Point[] = (() => {
  const pts: Point[] = []
  for (let lat = -80; lat <= 80; lat += 12) {
    const circ = Math.cos((lat * Math.PI) / 180)
    const steps = Math.max(6, Math.round(28 * circ))
    for (let i = 0; i < steps; i++) {
      pts.push({ lat, lng: -180 + (360 / steps) * i })
    }
  }
  return pts
})()

const HUBS: { label: string; lat: number; lng: number }[] = [
  { label: "EMIA", lat: 48, lng: 12 },
  { label: "AMER", lat: 38, lng: -96 },
  { label: "GLOBAL", lat: 1, lng: 103 },
]

export function GlobeCanvas({ active }: { active: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const rot = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = 320
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)
    const cx = size / 2
    const cy = size / 2
    const R = size / 2 - 16
    let raf = 0

    const project = (lat: number, lng: number, rotation: number) => {
      const phi = (lat * Math.PI) / 180
      const theta = ((lng + rotation) * Math.PI) / 180
      const x = Math.cos(phi) * Math.sin(theta)
      const y = Math.sin(phi)
      const z = Math.cos(phi) * Math.cos(theta)
      return { x: cx + x * R, y: cy - y * R, z }
    }

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      // sphere
      const grd = ctx.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, R)
      grd.addColorStop(0, "rgba(255,255,255,1)")
      grd.addColorStop(1, "rgba(241,245,249,1)")
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(226,232,240,1)"
      ctx.lineWidth = 1
      ctx.stroke()

      for (const d of DOTS) {
        const p = project(d.lat, d.lng, rot.current)
        if (p.z < 0) continue
        const alpha = 0.25 + p.z * 0.4
        ctx.fillStyle = `rgba(148,163,184,${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const h of HUBS) {
        const p = project(h.lat, h.lng, rot.current)
        if (p.z < 0) continue
        const isActive = active === "GLOBAL" || active === h.label
        const r = isActive ? 6 : 4
        const color = isActive ? "255,122,26" : "148,163,184"
        const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4)
        g2.addColorStop(0, `rgba(${color},${0.5 * p.z})`)
        g2.addColorStop(1, `rgba(${color},0)`)
        ctx.fillStyle = g2
        ctx.beginPath()
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${color},${0.7 + p.z * 0.3})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      rot.current += 0.18
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [active])

  return <canvas ref={ref} className="h-[320px] w-[320px]" aria-label="Global coverage globe" />
}

export function GlobalCoverage({
  regions,
}: {
  regions: { label: string; count: number; value: string; impact: string }[]
}) {
  const [active, setActive] = useState("GLOBAL")
  return (
    <div className="grid items-center gap-6 lg:grid-cols-[320px_1fr]">
      <div className="mx-auto">
        <GlobeCanvas active={active} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {regions.map((r) => (
          <button
            key={r.label}
            onMouseEnter={() => setActive(r.label)}
            onFocus={() => setActive(r.label)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              active === r.label
                ? "border-primary/40 bg-accent shadow-premium"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-primary">{r.label}</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{r.count}</div>
            <div className="text-xs text-muted-foreground">initiatives</div>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Annual value</span><span className="font-semibold text-foreground">{r.value}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Impact</span><span className="font-medium text-foreground">{r.impact}</span></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
