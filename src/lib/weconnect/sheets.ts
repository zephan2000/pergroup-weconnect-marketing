/**
 * Google Sheets integration for logging WeConnect submissions.
 * Server-only — uses OAuth refresh-token flow.
 *
 * Why OAuth instead of service account:
 *   The owner's Google Workspace organization policy blocks service account access.
 *   OAuth refresh-token flow is the supported alternative for server-to-server
 *   access under workspace policies. Owner authorizes once via consent screen,
 *   we store the refresh token, and use it indefinitely to mint access tokens.
 *
 * Graceful degradation: if any OAuth env var is missing, logs a warning and
 * silently skips. The sheet write never fails the API response.
 *
 * Schema: see docs/improvements/infrastructure/sheets-schema.md and
 * scripts/setup-sheets.ts (header row authority).
 */

import { google } from 'googleapis'
import type { sheets_v4 } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// ── Shared OAuth2 client factory (used by sheets.ts and OAuth setup endpoints) ──

export function getOAuth2Client(redirectUri?: string): OAuth2Client | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return null
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

let _sheets: sheets_v4.Sheets | null = null
let _initFailed = false

function getSheetsClient(): sheets_v4.Sheets | null {
  if (_initFailed) return null
  if (_sheets) return _sheets

  const oauth2 = getOAuth2Client()
  if (!oauth2) {
    console.warn('[sheets] GOOGLE_OAUTH_CLIENT_ID/SECRET not set — submissions will not be logged to Sheets')
    _initFailed = true
    return null
  }

  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  if (!refreshToken) {
    console.warn('[sheets] GOOGLE_OAUTH_REFRESH_TOKEN not set — visit /api/admin/sheets-oauth/init to obtain one')
    _initFailed = true
    return null
  }

  oauth2.setCredentials({ refresh_token: refreshToken })

  _sheets = google.sheets({ version: 'v4', auth: oauth2 })
  return _sheets
}

export type FormType = 'contact' | 'requirement' | 'need' | 'offering'

export const TAB_NAMES: Record<FormType, string> = {
  contact: 'Contact',
  requirement: 'Requirement',
  need: 'Need',
  offering: 'Offering',
}

export type EmailStatus = 'sent' | 'failed' | 'partial'

export interface SubmissionLog {
  formType: FormType
  emailStatus: EmailStatus
  emailError?: string
  payload: Record<string, unknown>
  sourcePage?: string
}

/**
 * Append one row to the form-type-specific tab.
 * Never throws — logs errors to console. The email-then-sheet flow must not
 * fail the API response if Sheets write fails.
 */
export async function appendSubmission(log: SubmissionLog): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!spreadsheetId) {
    console.warn('[sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set — skipping append')
    return
  }

  const client = getSheetsClient()
  if (!client) return

  try {
    const tab = TAB_NAMES[log.formType]
    const row = buildRow(log)

    await client.spreadsheets.values.append({
      spreadsheetId,
      range: `${tab}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    })
  } catch (err) {
    console.error('[sheets] Append failed:', err)
    // Swallow — do not fail the API response
  }
}

function buildRow(log: SubmissionLog): unknown[] {
  // Column order MUST match scripts/setup-sheets.ts headers.
  const ts = new Date().toISOString()
  const p = log.payload as Record<string, unknown>
  const get = (k: string) => (p[k] !== undefined && p[k] !== null ? String(p[k]) : '')

  switch (log.formType) {
    case 'contact':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        get('spaceId'), get('spaceName'), get('inquiryType'),
        get('name'), get('title'), get('company'), get('email'), get('phone'),
        get('budget'), get('timeline'), get('message'),
      ]
    case 'requirement':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        get('subject'), get('type'), get('targetLocation'),
        get('description'), get('goalAlignment'),
        get('budget'), get('timeline'),
        get('contactName'), get('contactTitle'), get('companyName'),
        get('contactEmail'), get('contactPhone'),
      ]
    case 'need':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        get('category'), get('description'), get('urgency'),
        get('budget'), get('timeline'), get('goalAlignment'),
        get('contactName'), get('contactTitle'), get('companyName'),
        get('contactEmail'), get('contactPhone'),
      ]
    case 'offering':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        get('category'), get('capability'), get('idealClient'),
        get('availability'), get('trackRecord'),
        get('contactName'), get('contactTitle'), get('companyName'),
        get('contactEmail'), get('contactPhone'),
      ]
  }
}
