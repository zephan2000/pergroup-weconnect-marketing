'use client'

/**
 * ScrollReveal — client component that applies IntersectionObserver-based
 * reveal animations to any element with class="reveal".
 *
 * Elements start at opacity:0, translateY(36px) and transition to
 * opacity:1, translateY(0) when they enter the viewport.
 *
 * Stagger delays: add class "d1", "d2", or "d3" for 0.1s, 0.2s, 0.3s delay.
 *
 * Mount this once in the marketing layout — it observes the entire page.
 */

import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    if (!elements.length) return

    const observers: IntersectionObserver[] = []

    elements.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  return null
}
