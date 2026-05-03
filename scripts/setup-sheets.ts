/**
 * setup-sheets.ts — one-shot Google Sheets setup for WeConnect submissions.
 *
 * Creates 4 tabs (Contact, Requirement, Need, Offering) with header rows
 * in the configured spreadsheet. Idempotent — safe to re-run.
 *
 * Run: npm run sheets:setup
 *
 * Prerequisites (see docs/improvements/03-google-sheets.md):
 *   1. GOOGLE_OAUTH_CLIENT_ID + GOOGLE_OAUTH_CLIENT_SECRET set in .env.local
 *   2. Visit /api/admin/sheets-oauth/init to obtain refresh token
 *   3. GOOGLE_OAUTH_REFRESH_TOKEN set in .env.local
 *   4. GOOGLE_SHEETS_SPREADSHEET_ID set in .env.local
 *   5. The Google account that completed OAuth owns/has Editor on the spreadsheet
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { google } from 'googleapis'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// ── Schema definitions (must match src/lib/weconnect/sheets.ts buildRow order) ──

const COMMON_HEADERS = ['timestamp', 'email_status', 'email_error', 'source_page']

const TABS = {
  Contact: [
    ...COMMON_HEADERS,
    'space_id',
    'space_name',
    'inquiry_type',
    'name',
    'title',
    'company',
    'email',
    'phone',
    'budget',
    'timeline',
    'message',
  ],
  Requirement: [
    ...COMMON_HEADERS,
    'subject',
    'type',
    'target_location',
    'description',
    'goal_alignment',
    'budget',
    'timeline',
    'contact_name',
    'contact_title',
    'company_name',
    'contact_email',
    'contact_phone',
  ],
  Need: [
    ...COMMON_HEADERS,
    'category',
    'description',
    'urgency',
    'budget',
    'timeline',
    'goal_alignment',
    'contact_name',
    'contact_title',
    'company_name',
    'contact_email',
    'contact_phone',
  ],
  Offering: [
    ...COMMON_HEADERS,
    'category',
    'capability',
    'ideal_client',
    'availability',
    'track_record',
    'contact_name',
    'contact_title',
    'company_name',
    'contact_email',
    'contact_phone',
  ],
} as const

type TabName = keyof typeof TABS

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!spreadsheetId) die('GOOGLE_SHEETS_SPREADSHEET_ID is not set in .env.local')

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  if (!clientId) die('GOOGLE_OAUTH_CLIENT_ID is not set in .env.local')
  if (!clientSecret) die('GOOGLE_OAUTH_CLIENT_SECRET is not set in .env.local')
  if (!refreshToken) {
    die(
      'GOOGLE_OAUTH_REFRESH_TOKEN is not set in .env.local\n' +
      '  Visit http://localhost:3000/api/admin/sheets-oauth/init in your browser to obtain one.\n' +
      '  (Run `npm run dev` in another terminal first.)',
    )
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
  oauth2.setCredentials({ refresh_token: refreshToken })

  console.log(`\nSpreadsheet ID: ${spreadsheetId}`)
  console.log(`OAuth client ID: ${clientId}\n`)

  const sheets = google.sheets({ version: 'v4', auth: oauth2 })

  // Verify access & get current structure
  let meta
  try {
    meta = await sheets.spreadsheets.get({ spreadsheetId })
  } catch (err) {
    console.error('\n✗ Failed to read spreadsheet. Check that:')
    console.error('  • The spreadsheet ID is correct')
    console.error('  • The OAuth-granted Google account has access to the spreadsheet')
    console.error('  • The refresh token is still valid (re-run OAuth flow if revoked)')
    console.error('\nError:', err instanceof Error ? err.message : err)
    process.exit(1)
  }

  const existingTabs = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => typeof t === 'string'),
  )

  console.log(`Existing tabs: ${[...existingTabs].join(', ') || '(none)'}\n`)

  // ── Create missing tabs ──
  const tabsToCreate = (Object.keys(TABS) as TabName[]).filter((name) => !existingTabs.has(name))

  if (tabsToCreate.length > 0) {
    console.log(`Creating tabs: ${tabsToCreate.join(', ')}`)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: tabsToCreate.map((title) => ({ addSheet: { properties: { title } } })),
      },
    })
    console.log('  ✓ Tabs created\n')
  } else {
    console.log('All tabs already exist — skipping creation\n')
  }

  // ── Write headers (only if row 1 is empty) ──
  for (const tabName of Object.keys(TABS) as TabName[]) {
    const headers = TABS[tabName]
    const range = `${tabName}!A1:${columnLetter(headers.length)}1`

    const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range })
    const row1 = existing.data.values?.[0] ?? []

    if (row1.length > 0 && row1.some((c) => c && String(c).trim() !== '')) {
      console.log(`▸ ${tabName}: header row already populated — skipping`)
      continue
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [headers as unknown as string[]] },
    })
    console.log(`▸ ${tabName}: wrote ${headers.length} header columns`)
  }

  console.log('\n✓ Setup complete')
}

function die(msg: string): never {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

function columnLetter(n: number): string {
  let s = ''
  while (n > 0) {
    const rem = (n - 1) % 26
    s = String.fromCharCode(65 + rem) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

main().catch((err) => {
  console.error('\n✗ Setup failed:', err)
  process.exit(1)
})
