'use client'

/**
 * CursorEffect — custom amber dot cursor + trailing ring + fairy-dust canvas.
 *
 * Why z-index: 9000 on the canvas:
 *  Modal backdrop (z-2100), WeConnectOverlay (z-2000), and the LivePreview
 *  warning (z-1000) all paint above the marketing layer. We want the trail
 *  to appear over them too — anything lower would be covered. Cursor dot
 *  (z-9999) and ring (z-9998) still render above the canvas.
 *
 * Fairy dust: each spawn produces tiny soft-glow specks with a gentle
 * upward drift and randomised horizontal drift, so the overall cloud
 * floats up but no two particles trace the same path. Wide spawn radius
 * (16 px) breaks any "line behind the cursor" feeling.
 *
 * - Dot follows mouse instantly; ring trails with 12% easing per frame.
 * - Interactive elements (a, button) scale the cursor on hover via event delegation.
 * - Disabled on touch devices (no pointer).
 * - Sets body cursor:none while mounted; restores on unmount.
 */

import { useEffect, useRef } from 'react'

type Speck = {
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

// Fairy-dust tuning constants.
const SPAWN_INTERVAL_MS = 55
const SPAWN_RADIUS = 16
const MAX_SPECKS = 80
const BASE_DRIFT_Y = -0.18  // gentle upward float

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const ringPosRef = useRef({ x: -1000, y: -1000 })
  const specksRef = useRef<Speck[]>([])
  const lastSpawnRef = useRef(0)
  const rafRef = useRef<number>(0)

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
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      cursor!.style.left = e.clientX + 'px'
      cursor!.style.top = e.clientY + 'px'

      // Spawn fairy-dust specks at a measured rate while moving.
      const now = Date.now()
      if (now - lastSpawnRef.current > SPAWN_INTERVAL_MS) {
        lastSpawnRef.current = now
        specksRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * SPAWN_RADIUS * 2,
          y: e.clientY + (Math.random() - 0.5) * SPAWN_RADIUS * 2,
          r: Math.random() * 1.6 + 0.6,                 // 0.6 – 2.2
          color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
          alpha: Math.random() * 0.25 + 0.25,           // 0.25 – 0.50
          decay: Math.random() * 0.008 + 0.005,         // 0.005 – 0.013
          // Velocity: random horizontal, biased-upward vertical.
          vx: (Math.random() - 0.5) * 0.8,
          vy: BASE_DRIFT_Y + (Math.random() - 0.5) * 0.45,
        })
        if (specksRef.current.length > MAX_SPECKS) {
          specksRef.current.splice(0, specksRef.current.length - MAX_SPECKS)
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
      // Smooth ring follow.
      const rp = ringPosRef.current
      const m = mouseRef.current
      rp.x += (m.x - rp.x) * 0.12
      rp.y += (m.y - rp.y) * 0.12
      ring!.style.left = rp.x + 'px'
      ring!.style.top = rp.y + 'px'

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Draw & update fairy-dust specks (soft halo + inner dot).
      const specks = specksRef.current
      for (let i = specks.length - 1; i >= 0; i--) {
        const p = specks[i]
        p.alpha -= p.decay
        p.x += p.vx
        p.y += p.vy
        p.r *= 0.997

        if (p.alpha <= 0 || p.r < 0.2) {
          specks.splice(i, 1)
          continue
        }

        // Outer halo for a soft glow without expensive shadowBlur.
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.color}, ${p.alpha * 0.18})`
        ctx!.fill()

        // Inner speck.
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.color}, ${p.alpha})`
        ctx!.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
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
