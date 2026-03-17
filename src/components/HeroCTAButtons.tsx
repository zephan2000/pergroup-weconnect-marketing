'use client'

/**
 * HeroCTAButtons — client component for the CTA button row in HeroBlock.
 * Buttons that link to /platform/* open the WeConnect overlay.
 * Other buttons render as plain anchor tags.
 */

import { useWeConnect } from '@/lib/weconnect/context'

type HeroButton = {
  label: string
  href: string
  variant: 'fill' | 'ghost' | 'weconnect'
}

const FILL_STYLE: React.CSSProperties = {
  background: 'var(--amber)',
  color: 'var(--bg)',
  padding: '14px 28px',
  fontSize: 12,
  letterSpacing: 2,
  textDecoration: 'none',
  fontWeight: 800,
  textTransform: 'uppercase',
  display: 'inline-block',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const GHOST_STYLE: React.CSSProperties = {
  border: '1px solid var(--line)',
  color: 'var(--muted)',
  padding: '14px 28px',
  fontSize: 12,
  letterSpacing: 2,
  textDecoration: 'none',
  fontWeight: 600,
  textTransform: 'uppercase',
  display: 'inline-block',
  background: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

export default function HeroCTAButtons({ buttons }: { buttons: HeroButton[] }) {
  const { open } = useWeConnect()

  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {buttons.map((btn) => {
        const isPlatformLink = btn.href.startsWith('/platform') || btn.variant === 'weconnect'
        const style = btn.variant === 'fill' ? FILL_STYLE : GHOST_STYLE

        if (isPlatformLink) {
          return (
            <button key={btn.label} onClick={() => open('spaces')} style={style}>
              {btn.label}
            </button>
          )
        }

        return (
          <a key={btn.label} href={btn.href} style={style}>
            {btn.label}
          </a>
        )
      })}
    </div>
  )
}
