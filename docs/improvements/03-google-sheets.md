# Phase 3 — Google Sheets Integration

**Status:** ⏳ Pending
**Estimated effort:** 2 hours (excluding human Google Cloud setup time)
**Files touched:** 6 (2 new + 4 modified) + 1 setup script (already in scripts/)

## Problem

API routes have `TODO: Append row to Google Sheets` comments but no implementation. The team has no automated record of submissions outside the email inbox.

## Goal

- One Google Sheets spreadsheet, **4 separate tabs** (Contact / Requirement / Need / Offering)
- Each form submission appends one row to its corresponding tab
- Append happens **after** email send. If email fails, the row is still written but `email_status='failed'` + error logged.
- Idempotent setup script (`npm run sheets:setup`) creates tabs + headers
- Service account auth — no OAuth flow

## Prerequisite: Google Cloud setup (human task)

The owner must complete these steps **before** this phase can be tested. Walk through them once:

1. **Create a Google Cloud project** at https://console.cloud.google.com/
2. **Enable the Google Sheets API:** APIs & Services → Library → search "Google Sheets API" → Enable
3. **Create a service account:**
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Name: `pergroup-sheets-writer`
   - Role: none required (we'll grant access via sheet sharing)
   - Click "Done"
4. **Download the JSON key:**
   - Click the new service account → Keys → Add Key → Create New Key → JSON
   - Save the downloaded file
5. **Create a Google Sheets spreadsheet** in Google Drive
   - Title: `WeConnect Submissions`
   - Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`
6. **Share the spreadsheet** with the service account email (found in the JSON file under `client_email`) — give it **Editor** access
7. **Add to `.env.local`:**
   ```bash
   GOOGLE_SHEETS_SPREADSHEET_ID=<the ID from step 5>
   GOOGLE_SERVICE_ACCOUNT_KEY=<entire JSON file contents on a single line, OR base64-encoded>
   ```
   Recommended: base64-encode it to avoid newline issues:
   ```bash
   base64 -i path/to/key.json | pbcopy
   ```
   Then paste the base64 string. Code will detect and decode if it starts with non-`{`.

## Schema

See [`infrastructure/sheets-schema.md`](./infrastructure/sheets-schema.md) for the exact column list per tab.

## Implementation

### New file: `src/lib/weconnect/sheets.ts`

```ts
/**
 * Google Sheets integration for logging WeConnect submissions.
 * Server-only — uses service account credentials.
 */

import { google } from 'googleapis'
import type { sheets_v4 } from 'googleapis'

let _sheets: sheets_v4.Sheets | null = null

function getSheetsClient(): sheets_v4.Sheets {
  if (_sheets) return _sheets

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set')

  // Accept raw JSON or base64-encoded JSON
  const json = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf-8')

  const credentials = JSON.parse(json)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  _sheets = google.sheets({ version: 'v4', auth })
  return _sheets
}

export type FormType = 'contact' | 'requirement' | 'need' | 'offering'

const TAB_NAMES: Record<FormType, string> = {
  contact: 'Contact',
  requirement: 'Requirement',
  need: 'Need',
  offering: 'Offering',
}

export interface SubmissionLog {
  formType: FormType
  emailStatus: 'sent' | 'failed' | 'partial'
  emailError?: string
  payload: Record<string, unknown>
  sourcePage?: string
}

/**
 * Appends one row to the form-type-specific tab.
 * Never throws — logs errors to console. Email-then-sheet flow must not fail
 * the API response if Sheets write fails.
 */
export async function appendSubmission(log: SubmissionLog): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  if (!spreadsheetId) {
    console.warn('[sheets] GOOGLE_SHEETS_SPREADSHEET_ID not set, skipping append')
    return
  }

  try {
    const sheets = getSheetsClient()
    const tab = TAB_NAMES[log.formType]
    const row = buildRow(log)

    await sheets.spreadsheets.values.append({
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
  // See infrastructure/sheets-schema.md for the column order.
  // Each form type has its own column ordering.
  const ts = new Date().toISOString()
  const p = log.payload

  switch (log.formType) {
    case 'contact':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        p.spaceId, p.spaceName, p.inquiryType ?? '',
        p.name, p.title ?? '', p.company, p.email, p.phone ?? '',
        p.budget ?? '', p.timeline ?? '', p.message ?? '',
      ]
    case 'requirement':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        p.subject ?? '', p.type, p.targetLocation,
        p.description, p.goalAlignment ?? '',
        p.budget ?? '', p.timeline ?? '',
        p.contactName, p.contactTitle ?? '', p.companyName, p.contactEmail, p.contactPhone ?? '',
      ]
    case 'need':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        p.category, p.description, p.urgency,
        p.budget ?? '', p.timeline ?? '', p.goalAlignment ?? '',
        p.contactName ?? '', p.contactTitle ?? '', p.companyName ?? '', p.contactEmail, p.contactPhone ?? '',
      ]
    case 'offering':
      return [
        ts, log.emailStatus, log.emailError ?? '', log.sourcePage ?? '',
        p.category, p.capability, p.idealClient ?? '', p.availability, p.trackRecord ?? '',
        p.contactName ?? '', p.contactTitle ?? '', p.companyName ?? '', p.contactEmail, p.contactPhone ?? '',
      ]
  }
}
```

### Modified: `src/app/api/contact/route.ts`, `requirement/route.ts`, `need/route.ts`, `offering/route.ts`

After the `await sendXxxEmail(...)` call, wrap with try/catch and call `appendSubmission`:

```ts
let emailStatus: 'sent' | 'failed' = 'sent'
let emailError: string | undefined

try {
  await sendContactEmail({ /* ... */ })
} catch (err) {
  emailStatus = 'failed'
  emailError = err instanceof Error ? err.message : String(err)
}

// Always log to sheets, regardless of email success
await appendSubmission({
  formType: 'contact',
  emailStatus,
  emailError,
  payload: body,
  sourcePage: request.headers.get('referer') ?? undefined,
})

if (emailStatus === 'failed') {
  return NextResponse.json({ error: emailError }, { status: 500 })
}

return NextResponse.json({ success: true })
```

### Setup script (already in `scripts/setup-sheets.ts`)

This is created during infrastructure setup. To run:
```bash
npm run sheets:setup
```

It:
1. Connects via service account
2. Reads existing tabs
3. Creates any missing tabs (Contact, Requirement, Need, Offering)
4. Writes header row to each tab if it's empty
5. Idempotent — safe to re-run

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] Run `npm run sheets:setup` — succeeds, creates 4 tabs with headers
- [ ] Open the Google Sheet — verify all 4 tabs exist with headers
- [ ] Submit a test PostRequirement form via the UI
- [ ] Check the Requirement tab — new row appears with correct data
- [ ] Check that timestamp is in ISO format
- [ ] Check that `email_status` column reads "sent"
- [ ] (Optional, harder) Stub `sendRequirementEmail` to throw, submit again — row should appear with `email_status='failed'`

## Risks & rollback

- **Risk:** Service account JSON exposed accidentally → rotate the key in Google Cloud Console
- **Risk:** Sheets API quota — free tier is 60 read/100 write per minute per user. Far above our submission volume.
- **Risk:** `googleapis` is a heavy dependency (~5MB). Acceptable for server-side only — we never bundle it for the client.
- **Rollback:** Comment out the `appendSubmission` calls in API routes; sheets continues to work but no new rows.

## Done when

- [ ] All 4 tabs exist in the spreadsheet with correct headers
- [ ] One test submission per form type appears in the correct tab
- [ ] Validation harness green
- [ ] CHANGELOG entries for sheets.ts, 4 API routes, package.json, .env.local.example, SECURITY.md
- [ ] This file's Status flipped to ✅ Done
- [ ] README status table updated
- [ ] Committed and pushed
