/**
 * Draft Mode API — enables Next.js draftMode so the page fetches
 * the latest draft (unpublished) content from Payload.
 *
 * Used by:
 *  - Payload Live Preview iframe URL (admin.livePreview.url routes here)
 *  - Payload "Preview" button (open-in-new-tab)
 *
 * Security: accepts PAYLOAD_SECRET (for server-side callers like livePreview URL)
 * or validates the Payload session cookie (for client-side preview button).
 */
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Path 1: server-side caller passes PAYLOAD_SECRET directly (livePreview iframe)
  if (secret === process.env.PAYLOAD_SECRET) {
    const draft = await draftMode()
    draft.enable()
    redirect(slug)
  }

  // Path 2: client-side caller (preview button) — validate via Payload session cookie
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
