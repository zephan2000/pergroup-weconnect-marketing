'use client'

/**
 * CursorEffect — custom amber dot cursor + trailing ring + canvas particle background.
 * Adapted from /reference/pergroup-website.html and rebuilt for the warm light theme.
 *
 * Light-mode tweaks vs original:
 *  - No mix-blend-mode (was 'screen', invisible on warm white)
 *  - Solid amber dot with subtle dark border + soft shadow for contrast on cream
 *  - Ring opacity raised (0.7 → 0.85) and color slightly darker for visibility
 *  - Canvas particles use deep-orange instead of amber for higher contrast on light bg
 *  - Grid lines switched from amber to dark warm at lower opacity
 *
 * - Dot follows mouse instantly; ring trails with 12% easing per frame.
 * - Interactive elements (a, button) scale the cursor on hover via event delegation.
 * - Disabled on touch devices (no pointer).
 * - Sets body cursor:none while mounted; restores on unmount.
 */

import { useEffect, useRef, useCallback } from 'react'

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const ringPosRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)
  const canvasRafRef = useRef<number>(0)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number }[]>([])
  const sizeRef = useRef({ w: 0, h: 0 })

  const initParticles = useCallback(() => {
    const { w, h } = sizeRef.current
    const particles: typeof particlesRef.current = []
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.4,
      })
    }
    particlesRef.current = particles
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
    resize()
    initParticles()
    window.addEventListener('resize', () => {
      resize()
      initParticles()
    })

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      cursor!.style.left = e.clientX + 'px'
      cursor!.style.top = e.clientY + 'px'
    }
    document.addEventListener('mousemove', onMouseMove)

    function animateRing() {
      const rp = ringPosRef.current
      const m = mouseRef.current
      rp.x += (m.x - rp.x) * 0.12
      rp.y += (m.y - rp.y) * 0.12
      ring!.style.left = rp.x + 'px'
      ring!.style.top = rp.y + 'px'
      rafRef.current = requestAnimationFrame(animateRing)
    }
    rafRef.current = requestAnimationFrame(animateRing)

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

    // ── Canvas draw loop — light mode palette ──
    function draw() {
      const { w, h } = sizeRef.current
      const m = mouseRef.current
      const particles = particlesRef.current

      ctx!.clearRect(0, 0, w, h)

      // Dim warm grid (replaces amber-on-dark)
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

      // Particles — deep-orange base; amber glow near mouse
      for (const p of particles) {
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

      // Connection lines — deep-orange for visibility on cream
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `hsla(20, 75%, 48%, ${0.1 * (1 - d / 90)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      canvasRafRef.current = requestAnimationFrame(draw)
    }
    canvasRafRef.current = requestAnimationFrame(draw)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      cancelAnimationFrame(canvasRafRef.current)
    }
  }, [initParticles])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
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
