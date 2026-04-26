import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, type ContactPayload } from '@/lib/weconnect/email'

/**
 * POST /api/contact
 *
 * Sends an introduction request email to PER GROUP.
 * Now includes optional title, phone, inquiry type, budget, timeline.
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

  try {
    await sendContactEmail({
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
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact email error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
