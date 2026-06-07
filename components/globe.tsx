"use client"

import { useEffect, useRef, useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type RegionCard = {
  label: string
  count: number
  value: string
  impact: string
  flag?: string
}

// ─── Region card config ───────────────────────────────────────────────────────

const REGION_CONFIG: Record<string, { gradient: string }> = {
  EMIA:   { gradient: "from-amber-50 to-orange-50" },
  AMER:   { gradient: "from-sky-50 to-blue-50" },
  GLOBAL: { gradient: "from-violet-50 to-purple-50" },
  APAC:   { gradient: "from-emerald-50 to-teal-50" },
}

// ─── Hub data ────────────────────────────────────────────────────────────────

const HUBS: { label: string; lat: number; lng: number }[] = [
  { label: "EMIA",   lat: 48,  lng: 12  },
  { label: "AMER",   lat: 38,  lng: -96 },
  { label: "GLOBAL", lat: 1,   lng: 103 },
  { label: "APAC",   lat: 35,  lng: 120 },
]

// ─── Dot grid for fallback ────────────────────────────────────────────────────

type GlobePt = { lat: number; lng: number }
const DOTS: GlobePt[] = (() => {
  const pts: GlobePt[] = []
  for (let lat = -80; lat <= 80; lat += 10) {
    const circ = Math.cos((lat * Math.PI) / 180)
    const steps = Math.max(6, Math.round(32 * circ))
    for (let i = 0; i < steps; i++) {
      pts.push({ lat, lng: -180 + (360 / steps) * i })
    }
  }
  return pts
})()

// ─── Earth Globe ─────────────────────────────────────────────────────────────

// Try multiple Earth image sources in order — first one that loads wins.
// All these CDNs send CORS: * headers so canvas can use them.
const EARTH_URLS = [
  "https://cdn.pixabay.com/photo/2011/12/13/14/28/earth-11008_1280.jpg",
  "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
]

export function EarthGlobe({ active }: { active: string }) {
  const ref        = useRef<HTMLCanvasElement>(null)
  const rot        = useRef(0)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const imgReady   = useRef(false)
  const urlIndex   = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr  = Math.min(window.devicePixelRatio || 1, 2)
    const SIZE = 300
    canvas.width  = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    const cx = SIZE / 2
    const cy = SIZE / 2
    const R  = SIZE / 2 - 4
    let raf  = 0

    // ── Load Earth texture with fallback chain ──
    function tryLoad(idx: number) {
      if (idx >= EARTH_URLS.length) return // all failed — use canvas fallback
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => { imgRef.current = img; imgReady.current = true }
      img.onerror = () => tryLoad(idx + 1)
      img.src = EARTH_URLS[idx]
    }
    tryLoad(0)

    // ── Projection ──
    function project(lat: number, lng: number, rotation: number) {
      const phi   = (lat * Math.PI) / 180
      const theta = ((lng + rotation) * Math.PI) / 180
      const x = Math.cos(phi) * Math.sin(theta)
      const y = Math.sin(phi)
      const z = Math.cos(phi) * Math.cos(theta)
      return { sx: cx + x * R, sy: cy - y * R, z }
    }

    // ── Draw image-mapped sphere using horizontal strip sampling ──
    function drawImageSphere() {
      const img = imgRef.current!
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // Draw sphere strip by strip (latitude bands)
      const BANDS = 120
      for (let band = 0; band < BANDS; band++) {
        const lat1 = 90 - (band / BANDS) * 180
        const lat2 = 90 - ((band + 1) / BANDS) * 180
        const phi1 = (lat1 * Math.PI) / 180
        const phi2 = (lat2 * Math.PI) / 180

        // screen Y positions of this band at lng=0 (center)
        const sy1 = cy - Math.sin(phi1) * R
        const sy2 = cy - Math.sin(phi2) * R

        // screen X half-width of this band (cos of average lat)
        const avgPhi = (phi1 + phi2) / 2
        const cosPhi = Math.cos(avgPhi)
        const halfW  = cosPhi * R

        if (halfW < 1) continue

        // source Y in texture
        const srcY1 = Math.floor((band / BANDS) * ih)
        const srcY2 = Math.floor(((band + 1) / BANDS) * ih)
        const srcH  = Math.max(1, srcY2 - srcY1)

        // rotation offset in pixels
        const rotFrac = ((rot.current % 360) + 360) % 360 / 360
        const rotPx   = rotFrac * iw

        // We draw two pieces: right half then left half (handles wrap-around)
        const destX = cx - halfW
        const destW = halfW * 2
        const destY = Math.min(sy1, sy2)
        const destH = Math.max(1, Math.abs(sy2 - sy1))

        // Source is the equirectangular row slid by rotation
        // Piece 1: from rotPx to end of image
        const src1X = rotPx
        const src1W = iw - rotPx
        const dest1W = (src1W / iw) * destW
        if (dest1W > 0) {
          ctx.drawImage(img, src1X, srcY1, src1W, srcH, destX, destY, dest1W, destH)
        }
        // Piece 2: from 0 to rotPx (wrap)
        if (rotPx > 0) {
          const dest2W = (rotPx / iw) * destW
          ctx.drawImage(img, 0, srcY1, rotPx, srcH, destX + dest1W, destY, dest2W, destH)
        }
      }
    }

    // ── Fallback: canvas-drawn ocean + dots ──
    function drawFallbackSphere() {
      const ocean = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.05, cx, cy, R)
      ocean.addColorStop(0,   "#4a9eca")
      ocean.addColorStop(0.5, "#1e6fa0")
      ocean.addColorStop(1,   "#061e38")
      ctx.fillStyle = ocean
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()

      for (const d of DOTS) {
        const p = project(d.lat, d.lng, rot.current)
        if (p.z < 0.1) continue
        ctx.fillStyle = `rgba(255,255,255,${0.05 + p.z * 0.08})`
        ctx.beginPath(); ctx.arc(p.sx, p.sy, 0.8, 0, Math.PI * 2); ctx.fill()
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Clip everything to circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.clip()

      if (imgReady.current) {
        drawImageSphere()
      } else {
        drawFallbackSphere()
      }

      // Dark terminator / night shadow on right side
      const shadow = ctx.createRadialGradient(cx + R * 0.55, cy, 0, cx, cy, R * 1.1)
      shadow.addColorStop(0,    "rgba(0,5,20,0.55)")
      shadow.addColorStop(0.35, "rgba(0,5,20,0.15)")
      shadow.addColorStop(0.55, "rgba(0,5,20,0)")
      ctx.fillStyle = shadow
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Specular highlight top-left
      const spec = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.1, cy - R * 0.1, R * 0.85)
      spec.addColorStop(0,    "rgba(255,255,255,0.32)")
      spec.addColorStop(0.18, "rgba(255,255,255,0.10)")
      spec.addColorStop(0.45, "rgba(255,255,255,0.02)")
      spec.addColorStop(1,    "rgba(0,0,0,0)")
      ctx.fillStyle = spec
      ctx.fillRect(0, 0, SIZE, SIZE)

      // Atmospheric limb glow
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.78, cx, cy, R)
      atmo.addColorStop(0, "rgba(80,160,255,0)")
      atmo.addColorStop(1, "rgba(80,160,255,0.28)")
      ctx.fillStyle = atmo
      ctx.fillRect(0, 0, SIZE, SIZE)

      ctx.restore()

      // ── Hub markers (drawn outside clip so glow bleeds) ──
      for (const h of HUBS) {
        const p = project(h.lat, h.lng, rot.current)
        if (p.z < 0) continue
        const isActive = active === "GLOBAL" || active === h.label
        const r   = isActive ? 7 : 4
        const rgb = isActive ? "255,122,26" : "200,220,255"

        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 5)
        glow.addColorStop(0, `rgba(${rgb},${0.6 * p.z})`)
        glow.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 5, 0, Math.PI * 2); ctx.fill()

        const core = ctx.createRadialGradient(p.sx - r * 0.3, p.sy - r * 0.3, 0, p.sx, p.sy, r)
        core.addColorStop(0, `rgba(255,255,255,${0.95 * p.z})`)
        core.addColorStop(0.5, `rgba(${rgb},${0.9 * p.z})`)
        core.addColorStop(1,   `rgba(${rgb},${0.6 * p.z})`)
        ctx.fillStyle = core
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2); ctx.fill()

        if (isActive) {
          ctx.strokeStyle = `rgba(${rgb},${0.55 * p.z})`
          ctx.lineWidth = 1.2
          ctx.beginPath(); ctx.arc(p.sx, p.sy, r + 5, 0, Math.PI * 2); ctx.stroke()
        }
      }

      rot.current += 0.10
      raf = requestAnimationFrame(drawFrame)
    }

    drawFrame()
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.16) 0%, rgba(30,111,160,0.10) 50%, transparent 72%)",
          transform: "scale(1.18)",
        }}
      />

      {/* Pulsing orbit ring */}
      <div
        className="absolute rounded-full pointer-events-none animate-pulse"
        style={{
          width: 316, height: 316,
          border: "1px solid rgba(255,122,26,0.18)",
          animationDuration: "3.5s",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={ref}
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          boxShadow: `
            0 0 0 1.5px rgba(255,122,26,0.22),
            0 0 0 3px rgba(255,255,255,0.6),
            0 0 60px rgba(30,111,160,0.28),
            0 28px 70px rgba(0,0,0,0.32),
            0 6px 18px rgba(0,0,0,0.18)
          `,
        }}
        aria-label="Rotating Earth globe"
      />

      {/* Drop shadow disc */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: -16,
          width: 170,
          height: 16,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.20) 0%, transparent 75%)",
          filter: "blur(7px)",
        }}
      />
    </div>
  )
}

// ─── Region Card ─────────────────────────────────────────────────────────────

function RegionCard({
  region,
  active,
  onHover,
}: {
  region: RegionCard
  active: boolean
  onHover: (label: string) => void
}) {
  const config = REGION_CONFIG[region.label] ?? REGION_CONFIG.GLOBAL

  return (
    <button
      onMouseEnter={() => onHover(region.label)}
      onFocus={() => onHover(region.label)}
      className={`
        group relative w-full overflow-hidden rounded-3xl border p-6 text-left
        transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl
        ${active
          ? `border-orange-300 bg-gradient-to-br ${config.gradient} shadow-lg`
          : "border-slate-200/80 bg-white shadow-sm hover:border-slate-300"
        }
      `}
      style={{
        boxShadow: active
          ? "0 8px 32px rgba(255,122,26,0.14), 0 2px 8px rgba(0,0,0,0.06)"
          : undefined,
      }}
    >
      {/* Active left bar */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-3xl transition-all duration-300 bg-gradient-to-b from-orange-400 to-orange-600 ${active ? "opacity-100" : "opacity-0"}`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${active ? "text-orange-500" : "text-slate-400 group-hover:text-orange-400"}`}>
          {region.label}
        </span>
        {active && <span className="h-2 w-2 rounded-full bg-orange-500 shadow-sm shadow-orange-300 animate-pulse" />}
      </div>

      {/* Count */}
      <div className="mt-4">
        <span className={`text-5xl font-black leading-none tracking-tight ${active ? "text-slate-900" : "text-slate-800"}`} style={{ fontVariantNumeric: "tabular-nums" }}>
          {region.count}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Initiatives</p>

      {/* Divider */}
      <div className={`my-4 h-px ${active ? "bg-orange-200/60" : "bg-slate-100"}`} />

      {/* Stats */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Annual Value</span>
          <span className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-700"}`}>{region.value}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Impact</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600 group-hover:bg-orange-50 group-hover:text-orange-600"}`}>
            {region.impact}
          </span>
        </div>
      </div>

      {active && (
        <div className="pointer-events-none absolute right-4 top-4 opacity-[0.07] text-[64px] leading-none select-none">◎</div>
      )}
    </button>
  )
}

// ─── GlobalCoverage ───────────────────────────────────────────────────────────

export function GlobalCoverage({ regions }: { regions: RegionCard[] }) {
  const [active, setActive] = useState("GLOBAL")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Global Footprint</span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[360px_1fr]">
        <div className="flex justify-center">
          <EarthGlobe active={active} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {regions.map((r) => (
            <RegionCard key={r.label} region={r} active={active === r.label} onHover={setActive} />
          ))}
        </div>
      </div>
    </div>
  )
}
