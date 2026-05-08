'use client'

/**
 * Persistent top banner shown on the full marketing site when draft mode is
 * enabled — i.e. the editor's browser carries the `__prerender_bypass` cookie
 * set by /api/draft.
 *
 * Intentionally hidden inside the Payload Live Preview iframe (where draft
 * mode is the entire point of the view) to avoid clutter. Detection runs on
 * mount via `window.self !== window.top`, so SSR renders the banner and the
 * client removes it after hydration if framed. The brief flash inside the
 * iframe is fine — editors already know what they're looking at.
 *
 * The "Exit" link hits /api/exit-draft, which clears the draft cookies and
 * redirects to / so the editor can see the published view in the same tab.
 */
import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

export default function DraftModeBanner({ isDraft }: { isDraft: boolean }) {
  const [framed, setFramed] = useState(false)

  useEffect(() => {
    if (!isDraft) return
    try {
      setFramed(window.self !== window.top)
    } catch {
      // Cross-origin frame access throws — treat as framed and hide.
      setFramed(true)
    }
  }, [isDraft])

  if (!isDraft || framed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[1000] bg-amber text-pg-text px-4 py-2 text-xs md:text-sm font-sora border-b border-amber/60 shadow-md"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <Eye size={16} className="flex-shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong>Draft mode</strong> — you&rsquo;re viewing unpublished changes. Visitors still see the published site.
          </span>
        </div>
        {/* Plain anchor on purpose — /api/exit-draft is an API route that
            disables draftMode and redirects, so we want a full server round-trip
            to apply the cookie change, not Next's client-side navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/exit-draft"
          className="flex-shrink-0 underline font-semibold whitespace-nowrap hover:opacity-80"
        >
          Exit draft
        </a>
      </div>
    </div>
  )
}
