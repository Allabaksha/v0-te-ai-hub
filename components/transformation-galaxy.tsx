"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { PROJECTS, fmtCurrency, fmtNumber, type Project } from "@/lib/data"
import { useApp } from "@/components/app-context"
import { ZoomIn, ZoomOut, Maximize2, Sparkles, Filter } from "lucide-react"

// ── Types ────────────────────────────────────────────────────────────────────
type Star = {
  p: Project
  x: number; y: number
  size: number
  bright: number
  twinkle: number
  phase: number
  color: string
  glowColor: string
  arm: number
  orbitR: number
  orbitSpeed: number
  pulseOffset: number
}

type DustParticle = {
  x: number; y: number; r: number; a: number; speed: number; color: string
}

// ── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { color: string; glow: string; label: string }> = {
  Live:           { color: "#10d97e", glow: "rgba(16,217,126,0.8)",  label: "Live" },
  "In Progress":  { color: "#FF7A1A", glow: "rgba(255,122,26,0.8)",  label: "In Progress" },
  "In Discovery": { color: "#38bdf8", glow: "rgba(56,189,248,0.8)",  label: "In Discovery" },
  Planned:        { color: "#a78bfa", glow: "rgba(167,139,250,0.8)", label: "Planned" },
}
const FALLBACK = { color: "#94a3b8", glow: "rgba(148,163,184,0.6)", label: "Unknown" }

function seeded(i: number, salt = 1) {
  const x = Math.sin(i * 53.7 + salt * 17.3 + 1.3) * 43758.5453
  return x - Math.floor(x)
}

function easeOutExpo(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

// ── Build stars ──────────────────────────────────────────────────────────────
function buildStars(): Star[] {
  const maxVal = Math.max(...PROJECTS.map((p) => p.annualValue), 1)
  const maxHrs = Math.max(...PROJECTS.map((p) => p.weeklyHours), 1)
  return PROJECTS.map((p, i) => {
    const arm = i % 4
    const armAngle = (arm / 4) * Math.PI * 2
    const t = i / PROJECTS.length
    const angle = armAngle + t * Math.PI * 4.5 + seeded(i, 2) * 0.6
    const radius = 80 + t * 380 + seeded(i, 3) * 50
    const style = STATUS_STYLE[p.status] ?? FALLBACK
    return {
      p,
      x: Math.cos(angle) * radius + (seeded(i, 4) - 0.5) * 30,
      y: Math.sin(angle) * radius * 0.58 + (seeded(i, 5) - 0.5) * 30,
      size: 4 + (p.annualValue / maxVal) * 13,
      bright: 0.5 + (p.weeklyHours / maxHrs) * 0.5,
      twinkle: seeded(i, 6) * Math.PI * 2,
      phase: seeded(i, 7) * Math.PI * 2,
      color: style.color,
      glowColor: style.glow,
      arm,
      orbitR: 0,
      orbitSpeed: 0.0002 + seeded(i, 8) * 0.0003,
      pulseOffset: seeded(i, 9) * Math.PI * 2,
    }
  })
}

// ── Build dust particles ─────────────────────────────────────────────────────
function buildDust(count = 300): DustParticle[] {
  const palette = ["rgba(255,122,26,", "rgba(56,189,248,", "rgba(167,139,250,", "rgba(16,217,126,"]
  return Array.from({ length: count }, (_, i) => {
    const angle = seeded(i, 11) * Math.PI * 2
    const r = 20 + seeded(i, 12) * 480
    const col = palette[i % palette.length]
    return {
      x: Math.cos(angle) * r * (0.8 + seeded(i, 13) * 0.4),
      y: Math.sin(angle) * r * 0.55 * (0.8 + seeded(i, 14) * 0.4),
      r: 0.5 + seeded(i, 15) * 2,
      a: 0.04 + seeded(i, 16) * 0.12,
      speed: (seeded(i, 17) - 0.5) * 0.002,
      color: col + (0.04 + seeded(i, 18) * 0.1) + ")",
    }
  })
}

export function TransformationGalaxy() {
  const { openProject } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<Star[]>(buildStars())
  const dustRef = useRef<DustParticle[]>(buildDust())
  const cam = useRef({ x: 0, y: 0, zoom: 1 })
  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false })
  const introRef = useRef(0) // 0→1
  const introStartRef = useRef<number | null>(null)
  const rafRef = useRef(0)
  const sizeRef = useRef({ w: 800, h: 600 })
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const [hover, setHover] = useState<{ p: Project; sx: number; sy: number } | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("All")
  const [showConstellations, setShowConstellations] = useState(true)

  // ── Draw ────────────────────────────────────────────────────────────────────
  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Intro animation
    if (introStartRef.current === null) introStartRef.current = now
    const introDt = Math.min((now - introStartRef.current) / 2200, 1)
    introRef.current = easeOutExpo(introDt)
    const intro = introRef.current

    const { w, h } = sizeRef.current
    ctx.clearRect(0, 0, w, h)

    // ── Deep space background ──
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.8)
    bgGrad.addColorStop(0, "#0d1528")
    bgGrad.addColorStop(0.5, "#080e1c")
    bgGrad.addColorStop(1, "#04080f")
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // ── Micro star field (parallax layer) ──
    const t = now / 1000
    for (let i = 0; i < 220; i++) {
      const sx = seeded(i, 21) * w
      const sy = seeded(i, 22) * h
      const alpha = (0.1 + seeded(i, 23) * 0.4) * intro
      const flicker = 0.7 + Math.sin(t * (0.5 + seeded(i, 24)) + seeded(i, 25) * 10) * 0.3
      ctx.fillStyle = `rgba(255,255,255,${alpha * flicker})`
      const sz = seeded(i, 26) > 0.97 ? 1.5 : 0.8
      ctx.fillRect(sx, sy, sz, sz)
    }

    ctx.save()
    ctx.translate(w / 2 + cam.current.x, h / 2 + cam.current.y)
    ctx.scale(cam.current.zoom * intro, cam.current.zoom * intro * 0.85)

    // ── Nebula clouds ──
    const nebulaData = [
      { x: 40, y: -20, r: 260, c1: "rgba(255,100,30,0.07)", c2: "rgba(255,100,30,0)" },
      { x: -80, y: 60, r: 200, c1: "rgba(56,189,248,0.06)", c2: "rgba(56,189,248,0)" },
      { x: 120, y: 40, r: 180, c1: "rgba(167,139,250,0.05)", c2: "rgba(167,139,250,0)" },
      { x: -30, y: -80, r: 150, c1: "rgba(16,217,126,0.05)", c2: "rgba(16,217,126,0)" },
    ]
    nebulaData.forEach(({ x, y, r, c1, c2 }) => {
      const ng = ctx.createRadialGradient(x, y, 0, x, y, r)
      ng.addColorStop(0, c1)
      ng.addColorStop(1, c2)
      ctx.fillStyle = ng
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    })

    // ── Galaxy core ──
    const coreG = ctx.createRadialGradient(0, 0, 0, 0, 0, 130)
    coreG.addColorStop(0, `rgba(255,200,100,${0.25 * intro})`)
    coreG.addColorStop(0.3, `rgba(255,140,50,${0.12 * intro})`)
    coreG.addColorStop(1, "rgba(255,100,30,0)")
    ctx.fillStyle = coreG
    ctx.beginPath()
    ctx.arc(0, 0, 130, 0, Math.PI * 2)
    ctx.fill()

    // Core bright center
    const centerG = ctx.createRadialGradient(0, 0, 0, 0, 0, 18)
    centerG.addColorStop(0, `rgba(255,240,180,${0.9 * intro})`)
    centerG.addColorStop(0.5, `rgba(255,160,60,${0.4 * intro})`)
    centerG.addColorStop(1, "rgba(255,100,30,0)")
    ctx.fillStyle = centerG
    ctx.beginPath()
    ctx.arc(0, 0, 18, 0, Math.PI * 2)
    ctx.fill()

    // ── Spiral arm dust ──
    const filterActive = activeFilter !== "All"
    dustRef.current.forEach((d) => {
      ctx.fillStyle = d.color
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r * intro, 0, Math.PI * 2)
      ctx.fill()
    })

    // ── Constellation lines (same category) ──
    if (showConstellations) {
      const stars = starsRef.current
      const visible = filterActive
        ? stars.filter((s) => s.p.status === activeFilter)
        : stars

      // Group by category and draw lines
      const byCategory: Record<string, Star[]> = {}
      visible.forEach((s) => {
        if (!byCategory[s.p.category]) byCategory[s.p.category] = []
        byCategory[s.p.category].push(s)
      })

      const catColors: Record<string, string> = {
        AI: "rgba(56,189,248,",
        Automation: "rgba(255,122,26,",
        Analytics: "rgba(167,139,250,",
        "Digital Transformation": "rgba(16,217,126,",
      }

      Object.entries(byCategory).forEach(([cat, catStars]) => {
        if (catStars.length < 2) return
        const col = catColors[cat] ?? "rgba(255,255,255,"
        // Sort by angle to get nice constellation shapes
        const sorted = [...catStars].sort((a, b) =>
          Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x)
        )
        ctx.save()
        ctx.strokeStyle = col + `${0.18 * intro})`
        ctx.lineWidth = 0.8
        ctx.setLineDash([3, 8])
        ctx.shadowColor = col + "0.4)"
        ctx.shadowBlur = 3
        ctx.beginPath()
        sorted.forEach((s, i) => {
          const next = sorted[(i + 1) % sorted.length]
          // Only connect if reasonably close
          if (Math.hypot(s.x - next.x, s.y - next.y) < 200) {
            ctx.moveTo(s.x, s.y)
            ctx.lineTo(next.x, next.y)
          }
        })
        ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      })
    }

    // ── Stars (project nodes) ──
    const stars = starsRef.current
    stars.forEach((s, idx) => {
      const isFiltered = filterActive && s.p.status !== activeFilter
      if (isFiltered) {
        // Draw dimmed ghost
        ctx.save()
        ctx.globalAlpha = 0.12 * intro
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        return
      }

      const tw = 0.75 + Math.sin(t * 1.8 + s.twinkle) * 0.25
      const pulse = 1 + Math.sin(t * 2.5 + s.pulseOffset) * 0.08
      const alpha = s.bright * tw * intro

      // Outer nebula halo
      const haloR = s.size * 5 * pulse
      const haloG = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR)
      haloG.addColorStop(0, s.glowColor.replace("0.8)", `${alpha * 0.35})`))
      haloG.addColorStop(0.5, s.glowColor.replace("0.8)", `${alpha * 0.1})`))
      haloG.addColorStop(1, s.glowColor.replace("0.8)", "0)"))
      ctx.fillStyle = haloG
      ctx.beginPath()
      ctx.arc(s.x, s.y, haloR, 0, Math.PI * 2)
      ctx.fill()

      // Mid glow ring
      const midG = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.2)
      midG.addColorStop(0, s.glowColor.replace("0.8)", `${alpha * 0.7})`))
      midG.addColorStop(1, s.glowColor.replace("0.8)", "0)"))
      ctx.fillStyle = midG
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // Star body
      ctx.save()
      ctx.shadowColor = s.glowColor
      ctx.shadowBlur = 16
      ctx.fillStyle = s.color
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Bright specular highlight
      ctx.shadowBlur = 0
      const specG = ctx.createRadialGradient(
        s.x - s.size * 0.3, s.y - s.size * 0.3, 0,
        s.x, s.y, s.size * pulse,
      )
      specG.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`)
      specG.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.2})`)
      specG.addColorStop(1, "rgba(255,255,255,0)")
      ctx.fillStyle = specG
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * pulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 4-point star spike (for large/bright stars)
      if (s.size > 9 && alpha > 0.5) {
        const spikeLen = s.size * 3.5
        ctx.save()
        ctx.strokeStyle = s.glowColor.replace("0.8)", `${alpha * 0.5})`)
        ctx.lineWidth = 1
        ctx.shadowColor = s.color
        ctx.shadowBlur = 8
        for (let spike = 0; spike < 4; spike++) {
          const ang = (spike / 4) * Math.PI * 2 + t * 0.15
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(
            s.x + Math.cos(ang) * spikeLen,
            s.y + Math.sin(ang) * spikeLen * 0.55,
          )
          ctx.stroke()
        }
        ctx.restore()
      }
    })

    // ── Hover highlight ring ──
    if (hover && mouseRef.current) {
      const hs = stars.find((s) => s.p.id === hover.p.id)
      if (hs) {
        const ringPulse = 1 + Math.sin(t * 4) * 0.15
        ctx.save()
        ctx.strokeStyle = hs.color
        ctx.lineWidth = 1.5
        ctx.shadowColor = hs.glowColor
        ctx.shadowBlur = 20
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(hs.x, hs.y, hs.size * 2.5 * ringPulse, 0, Math.PI * 2)
        ctx.stroke()
        // Outer ring
        ctx.lineWidth = 0.5
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.arc(hs.x, hs.y, hs.size * 4 * ringPulse, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
    }

    ctx.restore()
    rafRef.current = requestAnimationFrame(draw)
  }, [hover, activeFilter, showConstellations])

  // ── Setup canvas + RAF ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect()
      sizeRef.current = { w: width, h: height }
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const ctx = canvas.getContext("2d")
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [draw])

  // ── Hit test ────────────────────────────────────────────────────────────────
  const screenToWorld = (mx: number, my: number) => {
    const { w, h } = sizeRef.current
    return {
      wx: (mx - w / 2 - cam.current.x) / (cam.current.zoom),
      wy: (my - h / 2 - cam.current.y) / (cam.current.zoom),
    }
  }

  const hitTest = (mx: number, my: number) => {
    const { wx, wy } = screenToWorld(mx, my)
    let best: Star | null = null
    let bestD = Infinity
    for (const s of starsRef.current) {
      const d = Math.hypot(s.x - wx, s.y - wy / 0.85)
      if (d < s.size + 10 && d < bestD) { bestD = d; best = s }
    }
    return best
  }

  // ── Mouse handlers ──────────────────────────────────────────────────────────
  const onMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    mouseRef.current = { x: mx, y: my }

    if (drag.current.active) {
      cam.current.x = drag.current.ox + (mx - drag.current.sx)
      cam.current.y = drag.current.oy + (my - drag.current.sy)
      if (Math.hypot(mx - drag.current.sx, my - drag.current.sy) > 4) drag.current.moved = true
      return
    }

    const hit = hitTest(mx, my)
    if (hit) {
      setHover({ p: hit.p, sx: mx, sy: my })
      canvasRef.current!.style.cursor = "pointer"
    } else {
      setHover(null)
      canvasRef.current!.style.cursor = "grab"
    }
  }, [])

  const onDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    drag.current = {
      active: true, moved: false,
      sx: e.clientX - rect.left, sy: e.clientY - rect.top,
      ox: cam.current.x, oy: cam.current.y,
    }
    canvasRef.current!.style.cursor = "grabbing"
  }, [])

  const onUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drag.current.moved) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const hit = hitTest(e.clientX - rect.left, e.clientY - rect.top)
      if (hit) openProject(hit.p)
    }
    drag.current.active = false
    canvasRef.current!.style.cursor = "grab"
  }, [openProject])

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.91
    cam.current.zoom = Math.max(0.35, Math.min(5, cam.current.zoom * factor))
  }, [])

  const zoomBtn = (dir: number) => {
    cam.current.zoom = Math.max(0.35, Math.min(5, cam.current.zoom * (dir > 0 ? 1.3 : 0.77)))
  }
  const reset = () => {
    cam.current = { x: 0, y: 0, zoom: 1 }
    introStartRef.current = null
  }

  const statuses = ["All", ...Object.keys(STATUS_STYLE)]
  const counts = Object.fromEntries(
    Object.keys(STATUS_STYLE).map((s) => [s, PROJECTS.filter((p) => p.status === s).length])
  )

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Transformation Galaxy
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            {PROJECTS.length} initiatives mapped to the stars
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Star size = annual value · Brightness = hours saved · Color = status.
            Drag to pan · Scroll to zoom · Click a star to open the initiative.
          </p>
        </div>

        {/* Constellation toggle */}
        <button
          onClick={() => setShowConstellations((v) => !v)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
            showConstellations
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
            <circle cx="2" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
            <circle cx="14" cy="8" r="1.5" fill="currentColor"/>
            <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
            <line x1="2" y1="8" x2="8" y2="3" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2"/>
            <line x1="8" y1="3" x2="14" y2="8" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2"/>
            <line x1="14" y1="8" x2="8" y2="13" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2"/>
          </svg>
          Constellations
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const style = STATUS_STYLE[s]
          const active = activeFilter === s
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className="relative flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                borderColor: active && style ? style.color + "60" : undefined,
                backgroundColor: active && style ? style.color + "15" : undefined,
                color: active && style ? style.color : undefined,
              }}
            >
              {style && (
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: style.color,
                    boxShadow: active ? `0 0 8px ${style.color}` : "none",
                  }}
                />
              )}
              {s}
              {s !== "All" && (
                <span className="ml-0.5 opacity-60">{counts[s] ?? 0}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        className="relative flex-1 overflow-hidden rounded-3xl border border-white/8 shadow-2xl"
        style={{ minHeight: 520, background: "#04080f" }}
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          onMouseMove={onMove}
          onMouseDown={onDown}
          onMouseUp={onUp}
          onMouseLeave={() => { drag.current.active = false; setHover(null); mouseRef.current = null }}
          onWheel={onWheel}
        />

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-1.5">
          {[
            { label: "+", fn: () => zoomBtn(1), title: "Zoom in" },
            { label: "−", fn: () => zoomBtn(-1), title: "Zoom out" },
          ].map((b) => (
            <button
              key={b.label}
              onClick={b.fn}
              title={b.title}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white/70 backdrop-blur transition hover:bg-white/15 hover:text-white"
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={reset}
            title="Reset view"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 rounded-2xl border border-white/8 bg-black/50 px-4 py-2.5 backdrop-blur">
          {Object.entries(STATUS_STYLE).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] font-medium text-white/70">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: v.color, boxShadow: `0 0 5px ${v.color}` }}
              />
              {v.label}
            </span>
          ))}
          <span className="ml-1 border-l border-white/10 pl-3 text-[11px] text-white/30">
            Size = Value · Brightness = Hours saved
          </span>
        </div>

        {/* Hover tooltip */}
        {hover && (() => {
          const style = STATUS_STYLE[hover.p.status] ?? FALLBACK
          const flipX = hover.sx > sizeRef.current.w * 0.6
          const flipY = hover.sy > sizeRef.current.h * 0.6
          return (
            <div
              className="pointer-events-none absolute z-40 w-64 rounded-2xl border border-white/10 bg-[#080e1c]/90 p-4 shadow-2xl backdrop-blur-md"
              style={{
                left: flipX ? hover.sx - 274 : hover.sx + 18,
                top: flipY ? hover.sy - 180 : hover.sy + 18,
                borderColor: style.color + "30",
              }}
            >
              {/* Status + ID row */}
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ borderColor: style.color + "40", color: style.color, backgroundColor: style.color + "12" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }} />
                  {hover.p.status}
                </span>
                <span className="font-mono text-[10px] text-white/30">{hover.p.id}</span>
              </div>

              {/* Name */}
              <div className="text-sm font-bold leading-snug text-white">{hover.p.name}</div>
              <div className="mt-0.5 text-[11px] text-white/40">{hover.p.category} · {hover.p.region}</div>

              {/* Divider */}
              <div className="my-3 h-px" style={{ background: `linear-gradient(to right, ${style.color}30, transparent)` }} />

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Annual Value", value: fmtCurrency(hover.p.annualValue) },
                  { label: "Hours / Week", value: `${fmtNumber(hover.p.weeklyHours)} h` },
                  { label: "Owner", value: hover.p.owner },
                  { label: "Priority", value: hover.p.priority },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-white/30">{label}</div>
                    <div className="mt-0.5 text-xs font-semibold text-white/90">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[10px] text-white/30">Click to open initiative →</div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}