import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, sendContactAck, detectLocale, type ContactPayload } from '@/lib/weconnect/email'
import { appendSubmission, type EmailStatus } from '@/lib/weconnect/sheets'

/**
 * POST /api/contact
 *
 * Sends an introduction request email to PER GROUP, then logs to Google Sheets.
 * Sheet write is best-effort — never fails the API response.
 * Public endpoint — no auth required (v1 scope).
 */
export async function POST(request: NextRequest) {
  let body: ContactPayload

  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.spaceId || typeof body.spaceId !== 'string') {
    return NextResponse.json({ error: 'spaceId is required' }, { status: 400 })
  }
  if (!body.spaceName || typeof body.spaceName !== 'string') {
    return NextResponse.json({ error: 'spaceName is required' }, { status: 400 })
  }
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (!body.company || typeof body.company !== 'string') {
    return NextResponse.json({ error: 'company is required' }, { status: 400 })
  }
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const locale = detectLocale(
    request.headers.get('accept-language'),
    (body as { lang?: string }).lang,
  )

  const cleanPayload = {
    spaceId: body.spaceId,
    spaceName: body.spaceName,
    name: body.name,
    title: body.title ?? undefined,
    company: body.company,
    email: body.email,
    phone: body.phone ?? undefined,
    inquiryType: body.inquiryType ?? undefined,
    message: body.message ?? undefined,
    budget: body.budget ?? undefined,
    timeline: body.timeline ?? undefined,
  }

  let emailStatus: EmailStatus = 'sent'
  let emailError: string | undefined

  try {
    await sendContactEmail(cleanPayload)
  } catch (err) {
    emailStatus = 'failed'
    emailError = err instanceof Error ? err.message : String(err)
    console.error('[api/contact] Internal email failed:', err)
  }

  // User acknowledgement — best-effort. If internal email failed, skip ack.
  if (emailStatus === 'sent') {
    try {
      await sendContactAck(cleanPayload, locale)
    } catch (err) {
      emailStatus = 'partial'
      emailError = `User ack failed: ${err instanceof Error ? err.message : String(err)}`
      console.error('[api/contact] User ack email failed:', err)
    }
  }

  // Always log to sheets, regardless of email success
  await appendSubmission({
    formType: 'contact',
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
