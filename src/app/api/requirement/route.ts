import { NextRequest, NextResponse } from 'next/server'
import { sendRequirementEmail, type RequirementPayload } from '@/lib/weconnect/email'

/**
 * POST /api/requirement
 *
 * Sends a new requirement submission email to PER GROUP when a user
 * posts what they are looking for on WeConnect.
 *
 * Public endpoint — no auth required (v1 scope).
 */
export async function POST(request: NextRequest) {
  let body: RequirementPayload

  try {
    body = (await request.json()) as RequirementPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate required fields
  if (!body.type || typeof body.type !== 'string') {
    return NextResponse.json({ error: 'type is required' }, { status: 400 })
  }
  if (!body.companyName || typeof body.companyName !== 'string') {
    return NextResponse.json({ error: 'companyName is required' }, { status: 400 })
  }
  if (!body.targetLocation || typeof body.targetLocation !== 'string') {
    return NextResponse.json({ error: 'targetLocation is required' }, { status: 400 })
  }
  if (!body.description || typeof body.description !== 'string') {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }
  if (!body.contactEmail || typeof body.contactEmail !== 'string' || !body.contactEmail.includes('@')) {
    return NextResponse.json({ error: 'A valid contactEmail is required' }, { status: 400 })
  }

  try {
    await sendRequirementEmail({
      type: body.type,
      companyName: body.companyName,
      targetLocation: body.targetLocation,
      budget: body.budget ?? undefined,
      description: body.description,
      contactEmail: body.contactEmail,
    })

    // TODO: Append row to Google Sheets (requirement submissions)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Requirement email error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
