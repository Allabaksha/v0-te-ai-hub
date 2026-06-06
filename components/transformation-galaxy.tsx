"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PROJECTS, STATUS_META, fmtCurrency, fmtNumber, type Project } from "@/lib/data"
import { useApp } from "@/components/app-context"
import { ZoomIn, ZoomOut, Maximize, Sparkles } from "lucide-react"

type Star = {
  p: Project
  x: number
  y: number
  size: number
  bright: number
  twinkle: number
  color: string
}

const COLORS: Record<string, string> = {
  Live: "#10b981",
  "In Progress": "#FF7A1A",
  Discovery: "#3b82f6",
  Planned: "#94a3b8",
}

function seeded(i: number) {
  const x = Math.sin(i * 53.7 + 1.3) * 10000
  return x - Math.floor(x)
}

export function TransformationGalaxy() {
  const { openProject } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<Star[]>([])
  const cam = useRef({ x: 0, y: 0, zoom: 1 })
  const drag = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number; moved: boolean }>({
    active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false,
  })
  const [hover, setHover] = useState<{ p: Project; x: number; y: number } | null>(null)
  const sizeRef = useRef({ w: 0, h: 0 })

  // build stars once
  if (starsRef.current.length === 0) {
    const maxVal = Math.max(...PROJECTS.map((p) => p.annualValue))
    const maxHrs = Math.max(...PROJECTS.map((p) => p.weeklyHours))
    starsRef.current = PROJECTS.map((p, i) => {
      const arm = i % 4
      const angle = (i / PROJECTS.length) * Math.PI * 6 + arm * 1.6
      const radius = 60 + (i / PROJECTS.length) * 420 + seeded(i) * 60
      return {
        p,
        x: Math.cos(angle) * radius + (seeded(i + 1) - 0.5) * 40,
        y: Math.sin(angle) * radius * 0.7 + (seeded(i + 2) - 0.5) * 40,
        size: 3 + (p.annualValue / maxVal) * 14,
        bright: 0.4 + (p.weeklyHours / maxHrs) * 0.6,
        twinkle: seeded(i + 3) * Math.PI * 2,
        color: COLORS[p.status],
      }
    })
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const { w, h } = sizeRef.current
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#0b1020"
    ctx.fillRect(0, 0, w, h)

    // background micro stars
    for (let i = 0; i < 160; i++) {
      const sx = (seeded(i * 7) * w)
      const sy = (seeded(i * 13) * h)
      ctx.fillStyle = `rgba(255,255,255,${0.05 + seeded(i) * 0.2})`
      ctx.fillRect(sx, sy, 1, 1)
    }

    ctx.save()
    ctx.translate(w / 2 + cam.current.x, h / 2 + cam.current.y)
    ctx.scale(cam.current.zoom, cam.current.zoom)

    // galaxy core glow
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 220)
    core.addColorStop(0, "rgba(255,138,51,0.18)")
    core.addColorStop(1, "rgba(255,138,51,0)")
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(0, 0, 220, 0, Math.PI * 2)
    ctx.fill()

    const t = performance.now() / 1000
    for (const s of starsRef.current) {
      const tw = 0.7 + Math.sin(t * 2 + s.twinkle) * 0.3
      const alpha = s.bright * tw
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3.5)
      glow.addColorStop(0, hexA(s.color, alpha * 0.8))
      glow.addColorStop(1, hexA(s.color, 0))
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = hexA(s.color, Math.min(1, alpha + 0.3))
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`
      ctx.beginPath()
      ctx.arc(s.x - s.size * 0.25, s.y - s.size * 0.25, s.size * 0.4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext("2d")
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const raf = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [draw])

  const screenToWorld = (mx: number, my: number) => {
    const { w, h } = sizeRef.current
    return {
      x: (mx - w / 2 - cam.current.x) / cam.current.zoom,
      y: (my - h / 2 - cam.current.y) / cam.current.zoom,
    }
  }

  const hitTest = (mx: number, my: number) => {
    const wpt = screenToWorld(mx, my)
    let found: Star | null = null
    let best = Infinity
    for (const s of starsRef.current) {
      const d = Math.hypot(s.x - wpt.x, s.y - wpt.y)
      if (d < s.size + 6 && d < best) { best = d; found = s }
    }
    return found
  }

  const onMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    if (drag.current.active) {
      cam.current.x = drag.current.ox + (mx - drag.current.sx)
      cam.current.y = drag.current.oy + (my - drag.current.sy)
      if (Math.hypot(mx - drag.current.sx, my - drag.current.sy) > 4) drag.current.moved = true
      return
    }
    const hit = hitTest(mx, my)
    if (hit) setHover({ p: hit.p, x: mx, y: my })
    else setHover(null)
    canvasRef.current!.style.cursor = hit ? "pointer" : "grab"
  }

  const onDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    drag.current = {
      active: true, moved: false,
      sx: e.clientX - rect.left, sy: e.clientY - rect.top,
      ox: cam.current.x, oy: cam.current.y,
    }
  }
  const onUp = (e: React.MouseEvent) => {
    if (drag.current.active && !drag.current.moved) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top)
      if (hit) openProject(hit.p)
    }
    drag.current.active = false
  }
  const onWheel = (e: React.WheelEvent) => {
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    cam.current.zoom = Math.max(0.4, Math.min(4, cam.current.zoom * factor))
  }

  const zoomBtn = (dir: number) => {
    cam.current.zoom = Math.max(0.4, Math.min(4, cam.current.zoom * (dir > 0 ? 1.25 : 0.8)))
  }
  const reset = () => { cam.current = { x: 0, y: 0, zoom: 1 } }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Transformation Galaxy
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">44 initiatives mapped to the stars</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Star size reflects annual value, brightness reflects hours saved, color reflects status. Drag to pan, scroll to zoom, click a star to open the initiative.
          </p>
        </div>
      </div>

      <div ref={wrapRef} className="relative h-[600px] overflow-hidden rounded-3xl border border-border shadow-premium-lg">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          onMouseMove={onMove}
          onMouseDown={onDown}
          onMouseUp={onUp}
          onMouseLeave={() => { drag.current.active = false; setHover(null) }}
          onWheel={onWheel}
        />

        {/* controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          {[
            { icon: ZoomIn, fn: () => zoomBtn(1), label: "Zoom in" },
            { icon: ZoomOut, fn: () => zoomBtn(-1), label: "Zoom out" },
            { icon: Maximize, fn: reset, label: "Reset view" },
          ].map((b, i) => (
            <button key={i} onClick={b.fn} aria-label={b.label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20">
              <b.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 backdrop-blur">
          {Object.entries(COLORS).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} /> {k}
            </span>
          ))}
        </div>

        {/* tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-30 w-56 rounded-xl border border-white/10 bg-black/70 p-3 text-white shadow-premium-lg backdrop-blur"
            style={{ left: Math.min(hover.x + 14, sizeRef.current.w - 230), top: Math.min(hover.y + 14, sizeRef.current.h - 140) }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-white/50">{hover.p.id}</span>
              <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: COLORS[hover.p.status] }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[hover.p.status] }} />{hover.p.status}
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold">{hover.p.name}</div>
            <div className="mt-2 space-y-1 text-[11px] text-white/70">
              <div className="flex justify-between"><span>Annual value</span><span className="font-medium text-white">{fmtCurrency(hover.p.annualValue)}</span></div>
              <div className="flex justify-between"><span>Hours saved</span><span className="font-medium text-white">{fmtNumber(hover.p.weeklyHours)}/wk</span></div>
              <div className="flex justify-between"><span>Region</span><span className="font-medium text-white">{hover.p.region}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
