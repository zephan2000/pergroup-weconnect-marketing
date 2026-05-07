'use client'

/**
 * CursorEffect — custom amber dot cursor + trailing ring + canvas
 * with both an ambient particle network AND sunburst bubble trails.
 * Tuned for the warm light theme.
 *
 * Why z-index: 1 on the canvas (not 0):
 *  Section backgrounds (Hero/PlatformTeaser) use `position: relative` + `bg-bg`, which
 *  paints them at the same stacking layer as a z-index:0 canvas. Because they appear
 *  later in tree order than CursorEffect, they would obscure the particles. Using a
 *  positive z-index promotes the canvas to the positive-z-index layer; inner content
 *  (z-10) and Nav (z-500) still paint above it, so it never blocks UI.
 *
 * - Dot follows mouse instantly; ring trails with 12% easing per frame.
 * - Ambient grid + interactive web of dots that brighten near the cursor.
 * - Sunburst bubbles spawn on mouse move and fade — actual cursor trail.
 * - Interactive elements (a, button) scale the cursor on hover via event delegation.
 * - Disabled on touch devices (no pointer).
 * - Sets body cursor:none while mounted; restores on unmount.
 */

import { useEffect, useRef, useCallback } from 'react'

type NetParticle = { x: number; y: number; vx: number; vy: number; r: number }
type Bubble = {
  x: number
  y: number
  r: number
  color: string
  alpha: number
  decay: number
  vx: number
  vy: number
}

// Brand sunburst palette tuned for warm-white background.
const BRAND_COLORS = [
  '245, 168, 42',  // amber
  '204, 102, 41',  // orange
  '194, 65, 55',   // red
  '255, 195, 80',  // light amber
  '230, 130, 50',  // mid orange
]

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const ringPosRef = useRef({ x: -1000, y: -1000 })
  const netRef = useRef<NetParticle[]>([])
  const bubblesRef = useRef<Bubble[]>([])
  const lastSpawnRef = useRef(0)
  const rafRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  const initNet = useCallback(() => {
    const { w, h } = sizeRef.current
    const particles: NetParticle[] = []
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      })
    }
    netRef.current = particles
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    if (!cursor || !ring || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    document.body.style.cursor = 'none'

    function resize() {
      sizeRef.current.w = canvas!.width = window.innerWidth
      sizeRef.current.h = canvas!.height = window.innerHeight
    }
    function onResize() {
      resize()
      initNet()
    }
    resize()
    initNet()
    window.addEventListener('resize', onResize)

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      cursor!.style.left = e.clientX + 'px'
      cursor!.style.top = e.clientY + 'px'

      // Spawn sunburst bubbles at intervals while moving.
      const now = Date.now()
      if (now - lastSpawnRef.current > 30) {
        lastSpawnRef.current = now
        const count = Math.random() > 0.7 ? 2 : 1
        for (let i = 0; i < count; i++) {
          bubblesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            r: Math.random() * 4 + 2,
            color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
            alpha: Math.random() * 0.35 + 0.55,
            decay: Math.random() * 0.01 + 0.006,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
          })
        }
      }
    }
    document.addEventListener('mousemove', onMouseMove)

    const INTERACTIVE = 'a, button, input, select, textarea, [role="button"]'
    function onMouseEnter(e: Event) {
      const el = e.target
      if (el instanceof Element && el.matches(INTERACTIVE)) {
        cursor!.style.width = '20px'
        cursor!.style.height = '20px'
        cursor!.style.opacity = '0.55'
      }
    }
    function onMouseLeave(e: Event) {
      const el = e.target
      if (el instanceof Element && el.matches(INTERACTIVE)) {
        cursor!.style.width = '8px'
        cursor!.style.height = '8px'
        cursor!.style.opacity = '1'
      }
    }
    document.addEventListener('mouseenter', onMouseEnter, true)
    document.addEventListener('mouseleave', onMouseLeave, true)

    function animate() {
      const { w, h } = sizeRef.current
      const m = mouseRef.current

      // Smooth ring follow.
      const rp = ringPosRef.current
      rp.x += (m.x - rp.x) * 0.12
      rp.y += (m.y - rp.y) * 0.12
      ring!.style.left = rp.x + 'px'
      ring!.style.top = rp.y + 'px'

      ctx!.clearRect(0, 0, w, h)

      // Ambient warm grid.
      ctx!.strokeStyle = 'hsla(20, 10%, 10%, 0.025)'
      ctx!.lineWidth = 1
      const gs = 72
      for (let x = 0; x <= w; x += gs) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, h)
        ctx!.stroke()
      }
      for (let y = 0; y <= h; y += gs) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(w, y)
        ctx!.stroke()
      }

      // Ambient particle network — brightens near cursor.
      const net = netRef.current
      for (const p of net) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const dx = p.x - m.x
        const dy = p.y - m.y
        const d = Math.sqrt(dx * dx + dy * dy)
        const inf = Math.max(0, 1 - d / 180)

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r + inf * 3, 0, Math.PI * 2)
        ctx!.fillStyle =
          inf > 0.2
            ? `hsla(36, 90%, 47%, ${0.18 + inf * 0.4})`
            : `hsla(20, 75%, 48%, ${0.08 + inf * 0.18})`
        if (inf > 0.1) {
          ctx!.shadowColor = 'hsla(36, 90%, 47%, 0.35)'
          ctx!.shadowBlur = 8
        }
        ctx!.fill()
        ctx!.shadowBlur = 0
      }

      // Connection lines between near neighbours.
      for (let i = 0; i < net.length; i++) {
        for (let j = i + 1; j < net.length; j++) {
          const dx = net[i].x - net[j].x
          const dy = net[i].y - net[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx!.beginPath()
            ctx!.moveTo(net[i].x, net[i].y)
            ctx!.lineTo(net[j].x, net[j].y)
            ctx!.strokeStyle = `hsla(20, 75%, 48%, ${0.1 * (1 - d / 90)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      // Sunburst bubble trail — spawned on mouse move, fades over time.
      const bubbles = bubblesRef.current
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const p = bubbles[i]
        p.alpha -= p.decay
        p.x += p.vx
        p.y += p.vy
        p.r *= 0.998

        if (p.alpha <= 0) {
          bubbles.splice(i, 1)
          continue
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.color}, ${p.alpha})`
        ctx!.fill()
      }
      if (bubbles.length > 120) {
        bubbles.splice(0, bubbles.length - 120)
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [initNet])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          background: 'hsl(36, 90%, 47%)',
          border: '1px solid hsla(20, 10%, 10%, 0.18)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width .2s, height .2s, opacity .2s',
          boxShadow: '0 1px 4px hsla(20, 10%, 10%, 0.2)',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 36,
          height: 36,
          border: '1px solid hsla(36, 90%, 40%, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0.85,
        }}
      />
    </>
  )
}
