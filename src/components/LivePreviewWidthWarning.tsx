'use client'

/**
 * Banner shown only inside the Payload Live Preview iframe when the preview
 * viewport is narrower than Tailwind's `md` breakpoint (768px). Below that
 * width the desktop nav collapses to a hamburger, which makes it look like
 * the navbar has disappeared — this prompts editors to switch the breakpoint
 * selector to Desktop or open the preview in a new tab.
 *
 * Gated on `isDraft` so it never renders on the public site.
 */
import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const MD_BREAKPOINT = 768

export default function LivePreviewWidthWarning({ isDraft }: { isDraft: boolean }) {
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    if (!isDraft) return
    const mql = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`)
    const update = () => setNarrow(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [isDraft])

  if (!isDraft || !narrow) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[1000] bg-amber text-pg-text px-3 py-2 text-xs font-sora border-b border-amber/60 shadow-md"
    >
      <div className="max-w-[1400px] mx-auto flex items-start gap-2">
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>Desktop navigation is hidden at this preview width.</strong>{' '}
          Switch the breakpoint selector above to <strong>Desktop</strong>, or open the
          preview in a new tab to see the full navbar.
        </span>
      </div>
    </div>
  )
}
