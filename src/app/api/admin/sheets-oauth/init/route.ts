import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2Client } from '@/lib/weconnect/sheets'

/**
 * GET /api/admin/sheets-oauth/init
 *
 * Step 1 of the one-time OAuth setup. Redirects the owner to Google's consent
 * screen. After consent, Google redirects back to /api/admin/sheets-oauth/callback
 * with an authorization code, which is exchanged for a refresh token.
 *
 * Required env: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET.
 *
 * Security: this is a public endpoint. A stranger hitting it can only authorize
 * THEIR OWN Google account — they cannot access PER GROUP's data. See
 * TEAM_REVIEW.md for production hardening (OAUTH_SETUP_TOKEN gate).
 */
export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const redirectUri = `${origin}/api/admin/sheets-oauth/callback`

  const oauth2 = getOAuth2Client(redirectUri)
  if (!oauth2) {
    return NextResponse.json(
      {
        error: 'OAuth not configured',
        message: 'Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.local',
      },
      { status: 500 },
    )
  }

  const url = oauth2.generateAuthUrl({
    access_type: 'offline',     // request refresh token
    prompt: 'consent',          // force refresh token even if previously granted
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return NextResponse.redirect(url)
}
