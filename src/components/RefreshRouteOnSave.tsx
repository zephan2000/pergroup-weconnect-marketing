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
  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_PAYLOAD_URL || ''}
    />
  )
}
