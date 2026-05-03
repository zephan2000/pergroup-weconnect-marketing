import { NextRequest, NextResponse } from 'next/server'
import { sendOfferingEmail, sendOfferingAck, detectLocale, type OfferingPayload } from '@/lib/weconnect/email'
import { appendSubmission, type EmailStatus } from '@/lib/weconnect/sheets'

/**
 * POST /api/offering
 *
 * Sends a supplier offering submission email to PER GROUP, then logs to Sheets.
 * Sheet write is best-effort — never fails the API response.
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

  const locale = detectLocale(
    request.headers.get('accept-language'),
    (body as { lang?: string }).lang,
  )

  const cleanPayload = {
    category: body.category,
    capability: body.capability,
    idealClient: body.idealClient ?? undefined,
    availability: body.availability,
    trackRecord: body.trackRecord ?? undefined,
    contactName: body.contactName ?? undefined,
    contactTitle: body.contactTitle ?? undefined,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone ?? undefined,
    companyName: body.companyName ?? undefined,
  }

  let emailStatus: EmailStatus = 'sent'
  let emailError: string | undefined

  try {
    await sendOfferingEmail(cleanPayload)
  } catch (err) {
    emailStatus = 'failed'
    emailError = err instanceof Error ? err.message : String(err)
    console.error('[api/offering] Internal email failed:', err)
  }

  if (emailStatus === 'sent') {
    try {
      await sendOfferingAck(cleanPayload, locale)
    } catch (err) {
      emailStatus = 'partial'
      emailError = `User ack failed: ${err instanceof Error ? err.message : String(err)}`
      console.error('[api/offering] User ack email failed:', err)
    }
  }

  await appendSubmission({
    formType: 'offering',
    emailStatus,
    emailError,
    payload: body as unknown as Record<string, unknown>,
    sourcePage: request.headers.get('referer') ?? undefined,
  })

  if (emailStatus === 'failed') {
    return NextResponse.json({ error: emailError }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
