'use client'

/**
 * RefreshRouteOnSave — triggers router.refresh() when a Payload document is
 * saved or autosaved while in Live Preview mode. This re-fetches server
 * component data so the preview iframe reflects the latest content.
 */

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export function RefreshRouteOnSave() {
  const router = useRouter()
  // In dev: localhost:3000. In production: https://www.pergroup.sg
  const serverURL =
    process.env.NEXT_PUBLIC_PAYLOAD_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')

  if (!serverURL) return null

  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverURL}
    />
  )
}
