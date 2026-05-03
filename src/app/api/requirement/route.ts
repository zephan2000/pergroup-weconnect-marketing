import { NextRequest, NextResponse } from 'next/server'
import { sendRequirementEmail, sendRequirementAck, detectLocale, type RequirementPayload } from '@/lib/weconnect/email'
import { appendSubmission, type EmailStatus } from '@/lib/weconnect/sheets'

/**
 * POST /api/requirement
 *
 * Sends a new requirement submission email to PER GROUP, then logs to Google Sheets.
 * Sheet write is best-effort — never fails the API response.
 * Structured with 4 sections: basic info, requirement, commercial, contact.
 * Public endpoint — no auth required (v1 scope).
 */
export async function POST(request: NextRequest) {
  let body: RequirementPayload

  try {
    body = (await request.json()) as RequirementPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Basic information
  if (!body.type || typeof body.type !== 'string') {
    return NextResponse.json({ error: 'type is required' }, { status: 400 })
  }
  // Requirement confirmation
  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }
  if (!body.targetLocation || typeof body.targetLocation !== 'string') {
    return NextResponse.json({ error: 'targetLocation is required' }, { status: 400 })
  }
  // Contact card
  if (!body.contactName || typeof body.contactName !== 'string') {
    return NextResponse.json({ error: 'contactName is required' }, { status: 400 })
  }
  if (!body.companyName || typeof body.companyName !== 'string') {
    return NextResponse.json({ error: 'companyName is required' }, { status: 400 })
  }
  if (!body.contactEmail || typeof body.contactEmail !== 'string' || !body.contactEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid contactEmail is required' }, { status: 400 })
  }

  const locale = detectLocale(
    request.headers.get('accept-language'),
    (body as { lang?: string }).lang,
  )

  const cleanPayload = {
    subject: body.subject ?? undefined,
    type: body.type,
    description: body.description,
    goalAlignment: body.goalAlignment ?? undefined,
    targetLocation: body.targetLocation,
    budget: body.budget ?? undefined,
    timeline: body.timeline ?? undefined,
    contactName: body.contactName,
    contactTitle: body.contactTitle ?? undefined,
    companyName: body.companyName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone ?? undefined,
  }

  let emailStatus: EmailStatus = 'sent'
  let emailError: string | undefined

  try {
    await sendRequirementEmail(cleanPayload)
  } catch (err) {
    emailStatus = 'failed'
    emailError = err instanceof Error ? err.message : String(err)
    console.error('[api/requirement] Internal email failed:', err)
  }

  if (emailStatus === 'sent') {
    try {
      await sendRequirementAck(cleanPayload, locale)
    } catch (err) {
      emailStatus = 'partial'
      emailError = `User ack failed: ${err instanceof Error ? err.message : String(err)}`
      console.error('[api/requirement] User ack email failed:', err)
    }
  }

  await appendSubmission({
    formType: 'requirement',
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
