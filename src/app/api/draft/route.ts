/**
 * Draft Mode API — enables Next.js draftMode so the page fetches
 * the latest draft (unpublished) content from Payload.
 *
 * Used by:
 *  - Payload Live Preview iframe URL (admin.livePreview.url routes here)
 *  - Payload "Preview" button (open-in-new-tab)
 *
 * Security: accepts PAYLOAD_SECRET (for server-side callers like livePreview URL)
 * or checks for Payload JWT cookie (for client-side preview button — the cookie
 * is httpOnly and only set for authenticated admin users).
 */
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Path 1: server-side caller passes PAYLOAD_SECRET directly (livePreview iframe)
  const hasSecret = secret === process.env.PAYLOAD_SECRET

  // Path 2: client-side caller has a Payload JWT cookie (logged-in admin user)
  const hasPayloadCookie = request.cookies.has('payload-token')

  if (!hasSecret && !hasPayloadCookie) {
    return new Response('Unauthorized', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
