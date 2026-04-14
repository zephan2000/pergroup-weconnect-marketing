import { NextRequest, NextResponse } from 'next/server'
import { sendNeedEmail, type NeedPayload } from '@/lib/weconnect/email'

/**
 * POST /api/need
 *
 * Sends a new need submission email to PER GROUP.
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

  try {
    await sendNeedEmail({
      category: body.category,
      description: body.description,
      urgency: body.urgency,
      budget: body.budget ?? undefined,
      contactEmail: body.contactEmail,
      companyName: body.companyName ?? undefined,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Need email error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
