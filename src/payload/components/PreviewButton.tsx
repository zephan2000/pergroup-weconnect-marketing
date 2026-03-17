'use client'

/**
 * Custom PreviewButton — replaces Payload's default eye-only icon with a
 * labeled "Preview" button so editors know it opens a draft preview.
 * Registered via admin.components.edit.PreviewButton on the Pages collection.
 *
 * No secret needed in the URL — the /api/draft route validates the
 * Payload session cookie for client-side callers.
 */

import { useFormFields } from '@payloadcms/ui'

export default function PreviewButton() {
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const pagePath = slug && slug !== 'home' ? `/${slug}` : '/'
  const previewURL = `${origin}/api/draft?slug=${pagePath}`

  return (
    <a
      href={previewURL}
      target="_blank"
      rel="noopener noreferrer"
      title="Open a preview of your draft in the browser"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--theme-elevation-800, #ccc)',
        border: '1px solid var(--theme-elevation-150, rgba(255,255,255,0.1))',
        borderRadius: 4,
        textDecoration: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: 'none',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      Open Preview
    </a>
  )
}
