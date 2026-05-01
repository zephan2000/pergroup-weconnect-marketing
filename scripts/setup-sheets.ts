/**
 * setup-sheets.ts — one-shot Google Sheets setup for WeConnect submissions.
 *
 * Creates 4 tabs (Contact, Requirement, Need, Offering) with header rows
 * in the configured spreadsheet. Idempotent — safe to re-run.
 *
 * Run: npm run sheets:setup
 *
 * Prerequisites:
 *   - GOOGLE_SHEETS_SPREADSHEET_ID set in .env.local
 *   - GOOGLE_SERVICE_ACCOUNT_KEY set in .env.local (raw JSON or base64)
 *   - Service account has Editor access to the spreadsheet
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { google } from 'googleapis'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// ── Schema definitions (must match src/lib/weconnect/sheets.ts) ──

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

// ── Setup ──

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!spreadsheetId) {
    console.error('✗ GOOGLE_SHEETS_SPREADSHEET_ID is not set in .env.local')
    process.exit(1)
  }

  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!rawKey) {
    console.error('✗ GOOGLE_SERVICE_ACCOUNT_KEY is not set in .env.local')
    process.exit(1)
  }

  // Accept raw JSON or base64
  let credentials
  try {
    const json = rawKey.trim().startsWith('{')
      ? rawKey
      : Buffer.from(rawKey, 'base64').toString('utf-8')
    credentials = JSON.parse(json)
  } catch (err) {
    console.error('✗ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', err)
    process.exit(1)
  }

  console.log(`\nUsing service account: ${credentials.client_email}`)
  console.log(`Spreadsheet ID: ${spreadsheetId}\n`)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  // Get current spreadsheet structure
  const meta = await sheets.spreadsheets.get({ spreadsheetId })
  const existingTabs = new Set(
    (meta.data.sheets ?? [])
      .map((s) => s.properties?.title)
      .filter((t): t is string => typeof t === 'string')
  )

  console.log(`Existing tabs: ${[...existingTabs].join(', ') || '(none)'}\n`)

  // ── Create missing tabs ──
  const tabsToCreate = (Object.keys(TABS) as TabName[]).filter((name) => !existingTabs.has(name))

  if (tabsToCreate.length > 0) {
    console.log(`Creating tabs: ${tabsToCreate.join(', ')}`)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: tabsToCreate.map((title) => ({
          addSheet: { properties: { title } },
        })),
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

function columnLetter(n: number): string {
  // 1 → A, 26 → Z, 27 → AA, etc.
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
