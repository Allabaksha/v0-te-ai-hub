"use client"

import { useEffect, useRef } from "react"

type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number }

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes: Node[] = []
    let raf = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.floor((width * height) / 16000)
      nodes = Array.from({ length: Math.max(24, Math.min(70, count)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.5 + Math.random() * 2.5,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.pulse += 0.02

        const dxm = n.x - mouse.current.x
        const dym = n.y - mouse.current.y
        const dm = Math.hypot(dxm, dym)
        if (dm < 120) {
          n.x += (dxm / dm) * 0.6
          n.y += (dym / dm) * 0.6
        }
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.35
            ctx.strokeStyle = `rgba(255, 122, 26, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const glow = 0.5 + Math.sin(n.pulse) * 0.4
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6)
        grd.addColorStop(0, `rgba(255, 138, 51, ${0.5 * glow})`)
        grd.addColorStop(1, "rgba(255, 122, 26, 0)")
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(255, 122, 26, ${0.7 + glow * 0.3})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => (mouse.current = { x: -9999, y: -9999 })

    resize()
    draw()
    window.addEventListener("resize", resize)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}
