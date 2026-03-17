/**
 * Draft Mode API — enables Next.js draftMode so the page fetches
 * the latest draft (unpublished) content from Payload.
 *
 * Used by:
 *  - Payload Live Preview iframe URL (admin.livePreview.url routes here)
 *  - Payload "Preview" button (open-in-new-tab)
 *
 * Security: validates `secret` param against PAYLOAD_SECRET.
 */
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug') || '/'

  // Validate secret to prevent unauthorized draft access.
  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(slug)
}
