import { NextRequest, NextResponse } from 'next/server'
import { sendNeedEmail, sendNeedAck, detectLocale, type NeedPayload } from '@/lib/weconnect/email'
import { appendSubmission, type EmailStatus } from '@/lib/weconnect/sheets'

/**
 * POST /api/need
 *
 * Sends a new need submission email to PER GROUP, then logs to Google Sheets.
 * Sheet write is best-effort — never fails the API response.
 * Public endpoint — no auth required (v1 scope).
 */
export async function POST(request: NextRequest) {
  let body: NeedPayload

  try {
    body = (await request.json()) as NeedPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.category || typeof body.category !== 'string') {
    return NextResponse.json({ error: 'category is required' }, { status: 400 })
  }
  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }
  if (!body.urgency || typeof body.urgency !== 'string') {
    return NextResponse.json({ error: 'urgency is required' }, { status: 400 })
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
    description: body.description,
    urgency: body.urgency,
    budget: body.budget ?? undefined,
    timeline: body.timeline ?? undefined,
    goalAlignment: body.goalAlignment ?? undefined,
    contactName: body.contactName ?? undefined,
    contactTitle: body.contactTitle ?? undefined,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone ?? undefined,
    companyName: body.companyName ?? undefined,
  }

  let emailStatus: EmailStatus = 'sent'
  let emailError: string | undefined

  try {
    await sendNeedEmail(cleanPayload)
  } catch (err) {
    emailStatus = 'failed'
    emailError = err instanceof Error ? err.message : String(err)
    console.error('[api/need] Internal email failed:', err)
  }

  if (emailStatus === 'sent') {
    try {
      await sendNeedAck(cleanPayload, locale)
    } catch (err) {
      emailStatus = 'partial'
      emailError = `User ack failed: ${err instanceof Error ? err.message : String(err)}`
      console.error('[api/need] User ack email failed:', err)
    }
  }

  await appendSubmission({
    formType: 'need',
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
