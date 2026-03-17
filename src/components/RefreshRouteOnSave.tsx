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
  const serverURL = process.env.NEXT_PUBLIC_PAYLOAD_URL

  // Only render when serverURL is configured and page is inside an iframe
  // (i.e. Payload admin live preview). Avoids postMessage errors on normal loads.
  if (!serverURL || typeof window === 'undefined' || window === window.parent) return null

  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverURL}
    />
  )
}
