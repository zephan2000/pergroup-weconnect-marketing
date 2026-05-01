# Scripts

Utility scripts for the PER GROUP × WeConnect codebase.

## `validate.sh`

Run the full validation harness — TypeScript + ESLint + Next.js build.

```bash
bash scripts/validate.sh
```

Use this at the end of every phase in `docs/improvements/` before committing. Exit code is non-zero if any step fails.

## `setup-sheets.ts`

One-shot Google Sheets setup. Creates the 4 tabs (Contact, Requirement, Need, Offering) with header rows in the configured spreadsheet.

```bash
npm run sheets:setup
```

**Prerequisites:**
- `GOOGLE_SHEETS_SPREADSHEET_ID` set in `.env.local`
- `GOOGLE_SERVICE_ACCOUNT_KEY` set in `.env.local` (raw JSON or base64-encoded)
- The service account email has Editor access to the spreadsheet

The script is idempotent: re-running it will not duplicate tabs or destroy data. It only creates missing tabs and writes header rows where row 1 is empty.

## `seed.ts`

(Existing) Seeds Payload CMS with default content. Run via `npm run seed`.
