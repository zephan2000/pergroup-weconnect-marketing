import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2Client } from '@/lib/weconnect/sheets'

/**
 * GET /api/admin/sheets-oauth/callback
 *
 * Step 2 of the one-time OAuth setup. Exchanges the authorization code for
 * tokens (access + refresh), then displays the refresh token so the owner can
 * copy it into .env.local as GOOGLE_OAUTH_REFRESH_TOKEN.
 *
 * The page intentionally renders the refresh token in plain HTML — this is a
 * one-time setup flow, not a routine endpoint. After the token is captured,
 * this route should be considered "done" until/unless the token is revoked.
 *
 * Security: see init/route.ts. Same risk model.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    return htmlResponse(`
      <h1 style="color:#b00">OAuth error</h1>
      <pre>${escapeHtml(error)}</pre>
      <p>Try again at <a href="/api/admin/sheets-oauth/init">/api/admin/sheets-oauth/init</a></p>
    `, 400)
  }

  if (!code) {
    return htmlResponse(`
      <h1 style="color:#b00">Missing authorization code</h1>
      <p>Visit <a href="/api/admin/sheets-oauth/init">/api/admin/sheets-oauth/init</a> to start the OAuth flow.</p>
    `, 400)
  }

  const redirectUri = `${url.origin}/api/admin/sheets-oauth/callback`
  const oauth2 = getOAuth2Client(redirectUri)
  if (!oauth2) {
    return htmlResponse(`
      <h1 style="color:#b00">OAuth not configured</h1>
      <p>Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.local first.</p>
    `, 500)
  }

  try {
    const { tokens } = await oauth2.getToken(code)
    const refreshToken = tokens.refresh_token

    if (!refreshToken) {
      return htmlResponse(`
        <h1 style="color:#b00">No refresh token returned</h1>
        <p>Google did not return a refresh token. This usually means the user
        previously granted consent and Google didn't issue a new one. Try
        revoking access at <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>
        and then re-running the consent flow.</p>
      `, 500)
    }

    return htmlResponse(`
      <h1 style="color:hsl(36, 90%, 35%)">✓ OAuth Setup Complete</h1>

      <h2>Refresh token (copy this)</h2>
      <pre style="background:#fff7e6;padding:16px;border:1px solid #f5a623;border-radius:8px;font-family:ui-monospace,monospace;white-space:pre-wrap;word-break:break-all;font-size:13px;">${escapeHtml(refreshToken)}</pre>

      <h2>Next steps</h2>
      <ol style="line-height:1.7">
        <li>Open <code>.env.local</code></li>
        <li>Add or update: <code>GOOGLE_OAUTH_REFRESH_TOKEN=&lt;paste above&gt;</code></li>
        <li>Restart the dev server (Ctrl+C then <code>npm run dev</code>)</li>
        <li>Run <code>npm run sheets:setup</code> to create the tabs</li>
      </ol>

      <div style="margin-top:24px;padding:14px 16px;background:#fff8e6;border-left:3px solid #c17f1a;border-radius:6px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1a1714;">⚠ Token refresh reminder</p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#5c534a;">
          This refresh token <strong>may expire after ~7 days</strong> while the OAuth app is
          in <em>Testing</em> mode (Google's policy for unverified apps). If Sheets writes
          start failing silently in production, just visit
          <code>/api/admin/sheets-oauth/init</code> again to mint a fresh token, paste into
          <code>.env.local</code> (or Vercel env vars), and redeploy. Takes ~30 seconds.
        </p>
        <p style="margin:8px 0 0;font-size:12px;line-height:1.6;color:#5c534a;">
          To eliminate this entirely, publish the OAuth app for verification (4–6 weeks).
          Not recommended unless you outgrow single-owner usage. See
          <code>docs/improvements/03-google-sheets.md</code>.
        </p>
      </div>

      <p style="margin-top:24px;color:#888;font-size:12px;">
        This refresh token grants access to the granted Google account's Sheets data.
        Treat it like a password. Do not commit it.
      </p>
    `, 200)
  } catch (err) {
    return htmlResponse(`
      <h1 style="color:#b00">Token exchange failed</h1>
      <pre>${escapeHtml(err instanceof Error ? err.message : String(err))}</pre>
    `, 500)
  }
}

function htmlResponse(body: string, status: number): NextResponse {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sheets OAuth Setup</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #1a1714; line-height: 1.5; }
    h1 { font-size: 24px; }
    h2 { font-size: 16px; margin-top: 24px; }
    code { background: #f5f0e8; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  </style>
</head>
<body>${body}</body>
</html>`
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
