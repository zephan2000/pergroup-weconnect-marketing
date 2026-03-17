'use client'

/**
 * CursorEffect — custom amber dot cursor + trailing ring + canvas particle background.
 * Matches the cursor and canvas effects from /reference/pergroup-website.html.
 *
 * - Dot follows mouse instantly; ring trails with 12% easing per frame.
 * - Interactive elements (a, button) scale the cursor on hover via event delegation.
 * - Canvas draws a subtle grid, 90 floating particles, mouse proximity glow, and
 *   connection lines between nearby particles.
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
    // Skip on touch-only devices
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    if (!cursor || !ring || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set body cursor:none
    document.body.style.cursor = 'none'

    // --- Resize ---
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

    // --- Mouse tracking ---
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      cursor!.style.left = e.clientX + 'px'
      cursor!.style.top = e.clientY + 'px'
    }
    document.addEventListener('mousemove', onMouseMove)

    // --- Ring easing loop ---
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

    // --- Interactive element hover (event delegation) ---
    const INTERACTIVE = 'a, button, .svc, .stat-card, .h-item, .fi, .adv'
    function onMouseEnter(e: Event) {
      const el = e.target
      if (el instanceof Element && el.matches(INTERACTIVE)) {
        cursor!.style.width = '20px'
        cursor!.style.height = '20px'
        cursor!.style.opacity = '0.5'
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

    // --- Canvas draw loop ---
    function draw() {
      const { w, h } = sizeRef.current
      const m = mouseRef.current
      const particles = particlesRef.current

      ctx!.clearRect(0, 0, w, h)

      // Grid
      ctx!.strokeStyle = 'rgba(245,168,42,.022)'
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

      // Particles
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
            ? `rgba(245,168,42,${0.12 + inf * 0.35})`
            : `rgba(57,224,122,${0.06 + inf * 0.2})`
        if (inf > 0.1) {
          ctx!.shadowColor = 'rgba(245,168,42,.4)'
          ctx!.shadowBlur = 10
        }
        ctx!.fill()
        ctx!.shadowBlur = 0
      }

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(245,168,42,${0.05 * (1 - d / 90)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      canvasRafRef.current = requestAnimationFrame(draw)
    }
    canvasRafRef.current = requestAnimationFrame(draw)

    // --- Cleanup ---
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
      {/* Particle canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Cursor dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          background: 'var(--amber, #F5A82A)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'width .2s, height .2s',
          mixBlendMode: 'screen',
        }}
      />
      {/* Cursor ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: 36,
          height: 36,
          border: '1px solid rgba(245,168,42,.45)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0.7,
        }}
      />
    </>
  )
}
