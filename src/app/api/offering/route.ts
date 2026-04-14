import { NextRequest, NextResponse } from 'next/server'
import { sendOfferingEmail, type OfferingPayload } from '@/lib/weconnect/email'

/**
 * POST /api/offering
 *
 * Sends a supplier offering submission email to PER GROUP.
 * Public endpoint — no auth required (v1 scope).
 */
export async function POST(request: NextRequest) {
  let body: OfferingPayload

  try {
    body = (await request.json()) as OfferingPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.category || typeof body.category !== 'string') {
    return NextResponse.json({ error: 'category is required' }, { status: 400 })
  }
  if (!body.capability || typeof body.capability !== 'string') {
    return NextResponse.json({ error: 'capability is required' }, { status: 400 })
  }
  if (!body.availability || typeof body.availability !== 'string') {
    return NextResponse.json({ error: 'availability is required' }, { status: 400 })
  }
  if (!body.contactEmail || typeof body.contactEmail !== 'string' || !body.contactEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid contactEmail is required' }, { status: 400 })
  }

  try {
    await sendOfferingEmail({
      category: body.category,
      capability: body.capability,
      idealClient: body.idealClient ?? undefined,
      availability: body.availability,
      trackRecord: body.trackRecord ?? undefined,
      contactEmail: body.contactEmail,
      companyName: body.companyName ?? undefined,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Offering email error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
