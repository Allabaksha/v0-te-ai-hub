"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ── Data ────────────────────────────────────────────────────────────────────
const STAGES = ["Current State", "Automation", "AI Adoption", "Agentic AI", "Autonomous"]

const SERIES = [
  {
    key: "Manual Work",
    color: "#64748b",
    glowColor: "rgba(100,116,139,0.6)",
    data: [85, 60, 35, 12, 3],
  },
  {
    key: "Human Oversight",
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.6)",
    data: [10, 22, 30, 18, 5],
  },
  {
    key: "Automation",
    color: "#f97316",
    glowColor: "rgba(249,115,22,0.7)",
    data: [3, 12, 20, 28, 22],
  },
  {
    key: "Analytics",
    color: "#3b82f6",
    glowColor: "rgba(59,130,246,0.7)",
    data: [2, 6, 15, 30, 35],
  },
  {
    key: "Agentic AI",
    color: "#10b981",
    glowColor: "rgba(16,185,129,0.7)",
    data: [0, 0, 0, 12, 35],
  },
]

// Catmull-Rom spline helper
function catmullRomPoints(pts: [number, number][], tension = 0.5): [number, number][] {
  if (pts.length < 2) return pts
  const result: [number, number][] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    for (let t = 0; t <= 1; t += 0.02) {
      const t2 = t * t, t3 = t2 * t
      const x =
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
      const y =
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      result.push([x, y])
    }
  }
  result.push(pts[pts.length - 1])
  return result
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface TooltipData {
  x: number
  y: number
  stage: string
  values: { key: string; color: string; value: number }[]
}

export function InvestmentCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const progressRef = useRef(0)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [hoveredStage, setHoveredStage] = useState<number | null>(null)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const PAD = { top: 32, right: 48, bottom: 56, left: 52 }

  const draw = useCallback((progress: number, mouseX?: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const chartW = W - PAD.left - PAD.right
    const chartH = H - PAD.top - PAD.bottom

    ctx.clearRect(0, 0, W, H)

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, "#0f1117")
    bg.addColorStop(1, "#090b10")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (chartH / 4) * i
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(PAD.left + chartW, y)
      ctx.stroke()
    }

    // Stage vertical guides
    STAGES.forEach((_, si) => {
      const x = PAD.left + (chartW / (STAGES.length - 1)) * si
      ctx.strokeStyle = mouseX !== undefined && Math.abs(mouseX - x) < chartW / (STAGES.length - 1) / 2
        ? "rgba(255,255,255,0.12)"
        : "rgba(255,255,255,0.04)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.moveTo(x, PAD.top)
      ctx.lineTo(x, PAD.top + chartH)
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Y-axis labels
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.font = "11px system-ui"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const val = 100 - i * 25
      const y = PAD.top + (chartH / 4) * i
      ctx.fillText(`${val}`, PAD.left - 8, y + 4)
    }

    // X-axis labels
    ctx.textAlign = "center"
    STAGES.forEach((label, si) => {
      const x = PAD.left + (chartW / (STAGES.length - 1)) * si
      const isHovered = hoveredStage === si
      ctx.fillStyle = isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"
      ctx.font = isHovered ? "bold 11px system-ui" : "11px system-ui"
      ctx.fillText(label, x, PAD.top + chartH + 22)
    })

    // ── Draw series ──
    const visibleSeries = SERIES.filter((s) => !hidden.has(s.key))

    // First pass: filled areas (bottom to top for correct layering)
    ;[...visibleSeries].reverse().forEach((series) => {
      const pts: [number, number][] = series.data.map((v, i) => [
        PAD.left + (chartW / (STAGES.length - 1)) * i,
        PAD.top + chartH - (v / 100) * chartH,
      ])

      // Clip to progress
      const totalPts = catmullRomPoints(pts)
      const clipped = totalPts.slice(0, Math.floor(totalPts.length * progress))
      if (clipped.length < 2) return

      const lastX = clipped[clipped.length - 1][0]

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(clipped[0][0], PAD.top + chartH)
      clipped.forEach(([x, y]) => ctx.lineTo(x, y))
      ctx.lineTo(lastX, PAD.top + chartH)
      ctx.closePath()

      const grad = ctx.createLinearGradient(PAD.left, PAD.top, PAD.left, PAD.top + chartH)
      grad.addColorStop(0, series.color + "28")
      grad.addColorStop(1, series.color + "06")
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()
    })

    // Second pass: glowing lines on top
    visibleSeries.forEach((series) => {
      const pts: [number, number][] = series.data.map((v, i) => [
        PAD.left + (chartW / (STAGES.length - 1)) * i,
        PAD.top + chartH - (v / 100) * chartH,
      ])

      const totalPts = catmullRomPoints(pts)
      const clipped = totalPts.slice(0, Math.floor(totalPts.length * progress))
      if (clipped.length < 2) return

      // Outer glow
      ctx.save()
      ctx.shadowColor = series.glowColor
      ctx.shadowBlur = 12
      ctx.strokeStyle = series.color
      ctx.lineWidth = 2.5
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.beginPath()
      clipped.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.stroke()

      // Inner bright line
      ctx.shadowBlur = 4
      ctx.strokeStyle = series.color + "ee"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      clipped.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
      ctx.stroke()
      ctx.restore()

      // Draw dot at end of animated line
      if (progress < 1) {
        const [ex, ey] = clipped[clipped.length - 1]
        ctx.save()
        ctx.shadowColor = series.glowColor
        ctx.shadowBlur = 16
        ctx.fillStyle = series.color
        ctx.beginPath()
        ctx.arc(ex, ey, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })

    // ── Hover crosshair ──
    if (mouseX !== undefined && progress >= 1) {
      // Find nearest stage
      const nearestIdx = STAGES.reduce((best, _, si) => {
        const sx = PAD.left + (chartW / (STAGES.length - 1)) * si
        const bestSx = PAD.left + (chartW / (STAGES.length - 1)) * best
        return Math.abs(mouseX - sx) < Math.abs(mouseX - bestSx) ? si : best
      }, 0)
      const sx = PAD.left + (chartW / (STAGES.length - 1)) * nearestIdx

      // Vertical crosshair
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(sx, PAD.top)
      ctx.lineTo(sx, PAD.top + chartH)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // Dots on each series at that stage
      visibleSeries.forEach((series) => {
        const v = series.data[nearestIdx]
        const y = PAD.top + chartH - (v / 100) * chartH
        ctx.save()
        ctx.shadowColor = series.glowColor
        ctx.shadowBlur = 20
        ctx.fillStyle = "#0f1117"
        ctx.beginPath()
        ctx.arc(sx, y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = series.color
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(sx, y, 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      })
    }
  }, [hidden, hoveredStage])

  // Animation loop
  useEffect(() => {
    progressRef.current = 0
    const start = performance.now()
    const duration = 1800

    const loop = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      progressRef.current = easeInOutCubic(t)
      draw(progressRef.current)
      if (t < 1) animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ro = new ResizeObserver(() => {
      const { width } = container.getBoundingClientRect()
      canvas.width = width * window.devicePixelRatio
      canvas.height = 320 * window.devicePixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = "320px"
      const ctx = canvas.getContext("2d")
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio)
      draw(progressRef.current)
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [draw])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || progressRef.current < 1) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const W = rect.width
    const chartW = W - PAD.left - PAD.right

    const nearestIdx = STAGES.reduce((best, _, si) => {
      const sx = PAD.left + (chartW / (STAGES.length - 1)) * si
      const bestSx = PAD.left + (chartW / (STAGES.length - 1)) * best
      return Math.abs(mouseX - sx) < Math.abs(mouseX - bestSx) ? si : best
    }, 0)

    setHoveredStage(nearestIdx)
    draw(1, mouseX)

    const sx = PAD.left + (chartW / (STAGES.length - 1)) * nearestIdx
    setTooltip({
      x: sx,
      y: 0,
      stage: STAGES[nearestIdx],
      values: SERIES.filter((s) => !hidden.has(s.key)).map((s) => ({
        key: s.key,
        color: s.color,
        value: s.data[nearestIdx],
      })).sort((a, b) => b.value - a.value),
    })
  }, [draw, hidden])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
    setHoveredStage(null)
    draw(1)
  }, [draw])

  const toggleSeries = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Canvas wrapper */}
      <div ref={containerRef} className="relative w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair rounded-2xl"
          style={{ width: "100%", height: 320, display: "block" }}
        />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute top-4 z-10 min-w-[160px] rounded-2xl border border-white/10 bg-[#0f1117]/95 p-3 shadow-2xl backdrop-blur-sm"
            style={{
              left: tooltip.x > (canvasRef.current?.getBoundingClientRect().width ?? 0) / 2
                ? tooltip.x - 180
                : tooltip.x + 16,
            }}
          >
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {tooltip.stage}
            </div>
            <div className="space-y-1.5">
              {tooltip.values.map((v) => (
                <div key={v.key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                    {v.key}
                  </span>
                  <span className="text-xs font-bold text-white">{v.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend — interactive toggles */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SERIES.map((s) => (
          <button
            key={s.key}
            onClick={() => toggleSeries(s.key)}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200"
            style={{
              borderColor: hidden.has(s.key) ? "rgba(255,255,255,0.1)" : s.color + "50",
              backgroundColor: hidden.has(s.key) ? "transparent" : s.color + "12",
              color: hidden.has(s.key) ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full transition-opacity"
              style={{
                backgroundColor: s.color,
                opacity: hidden.has(s.key) ? 0.2 : 1,
                boxShadow: hidden.has(s.key) ? "none" : `0 0 6px ${s.color}`,
              }}
            />
            {s.key}
          </button>
        ))}
      </div>
    </div>
  )
}