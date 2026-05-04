# Phase 3 — Google Sheets Integration (OAuth)

**Status:** ✅ Code complete (2026-05-03) — pending owner Google Cloud setup + smoke test
**Estimated effort:** 3 hours (OAuth adds infra over service account)
**Files touched:** ~10 (sheets.ts, OAuth routes, 4 API routes, setup script, env, docs)

## Architecture decision: OAuth, not Service Account

**Why OAuth instead of Service Account:**
- The owner's Google Workspace organization policy blocks service account access to Drive/Sheets
- OAuth with a stored refresh token is the supported alternative for server-to-server access under workspace policies
- One-time human consent → long-lived refresh token → server can call API indefinitely

**What this looks like in practice:**
1. Owner does a **one-time** OAuth authorization in their browser (clicks consent on Google's page)
2. Our app captures the refresh token
3. Owner pastes refresh token into `.env.local`
4. Server uses the refresh token forever to mint short-lived access tokens

The user never sees this flow — only the owner during initial setup.

## Prerequisite: Google Cloud setup (human task)

1. Open https://console.cloud.google.com/
2. **Enable Google Sheets API:** APIs & Services → Library → "Google Sheets API" → Enable
3. **Create OAuth credentials:**
   - APIs & Services → Credentials → **+ CREATE CREDENTIALS → OAuth client ID**
   - If prompted to configure consent screen first:
     - User Type: **External** (or Internal if pergroup.sg is a Google Workspace)
     - App name: `PER GROUP WeConnect`
     - User support email: `pergroup.sg@gmail.com`
     - Developer contact: same
     - Scopes: `https://www.googleapis.com/auth/spreadsheets`
     - Test users: add the Google account that owns the target spreadsheet
     - Save
   - Back to OAuth client ID:
     - Application type: **Web application**
     - Name: `WeConnect Sheets Writer`
     - **Authorized redirect URIs:**
       - `http://localhost:3000/api/admin/sheets-oauth/callback`
       - `https://www.pergroup.sg/api/admin/sheets-oauth/callback`
     - Create
   - Copy the Client ID and Client Secret
4. **Create the spreadsheet:**
   - In Google Drive, create a new Google Sheets file titled `WeConnect Submissions`
   - Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/{ID}/edit`
   - The spreadsheet must be owned by (or shared editor with) the same Google account that completes the OAuth consent
5. **Set env vars in `.env.local`:**
   ```bash
   GOOGLE_OAUTH_CLIENT_ID=<from step 3>
   GOOGLE_OAUTH_CLIENT_SECRET=<from step 3>
   GOOGLE_OAUTH_REFRESH_TOKEN=    # leave blank — filled in step 6
   GOOGLE_SHEETS_SPREADSHEET_ID=<from step 4>
   ```
6. **Run the OAuth consent flow once:**
   - Start dev server: `npm run dev`
   - Visit `http://localhost:3000/api/admin/sheets-oauth/init` in your browser
   - Google asks you to sign in and grant Sheets access
   - After consent, you're redirected to `/api/admin/sheets-oauth/callback`
   - The page displays your **refresh token**
   - Copy it → paste into `.env.local` as `GOOGLE_OAUTH_REFRESH_TOKEN`
   - Restart dev server
7. **Initialize the spreadsheet tabs:**
   - Run `npm run sheets:setup`
   - Verifies OAuth, creates 4 tabs (Contact, Requirement, Need, Offering) with headers

## Schema

Unchanged — see [`infrastructure/sheets-schema.md`](./infrastructure/sheets-schema.md).

## Implementation

### New file: `src/lib/weconnect/sheets.ts`

Uses `google.auth.OAuth2` with stored refresh token. Same `appendSubmission()` interface as before. Graceful degradation: if any required env var is missing, logs a warning and silently skips.

### New files: OAuth flow endpoints

- `src/app/api/admin/sheets-oauth/init/route.ts` — generates Google consent URL with `access_type=offline` and `prompt=consent` (forces refresh token), redirects user
- `src/app/api/admin/sheets-oauth/callback/route.ts` — receives `code` query param, exchanges for tokens, displays refresh token in plain HTML for the owner to copy

**Security note:** these endpoints are public (no auth gate). The risk surface is low because:
- The OAuth flow only authorizes the user who clicks through (their own Google account)
- The refresh token displayed is for THAT user's account, not PER GROUP's
- Without the spreadsheet ID and the matching account, no data is accessed
- Production: consider adding an `OAUTH_SETUP_TOKEN` env var requirement to gate these routes (TEAM_REVIEW item)

### Modified: 4 API routes (`contact`, `requirement`, `need`, `offering`)

Each route, after the email send, calls `appendSubmission()` with `formType` and the body. If email fails, sheet still records with `email_status='failed'`.

### Modified: `scripts/setup-sheets.ts`

Replace service account auth with OAuth2 client using the same env vars as the runtime.

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] Step 1–5 of prerequisites complete
- [ ] Visit `/api/admin/sheets-oauth/init` → Google consent page loads
- [ ] Approve consent → callback page shows refresh token
- [ ] Refresh token pasted into `.env.local`, dev server restarted
- [ ] `npm run sheets:setup` succeeds — 4 tabs created with headers
- [ ] Submit a Post Requirement form via the UI → row appears in Requirement tab with `email_status=sent`
- [ ] Set `RESEND_API_KEY=invalid` temporarily, submit again → row appears with `email_status=failed` and error in `email_error` column
- [ ] Restore `RESEND_API_KEY`

## Operational note: refresh token expiry (Testing-mode apps)

**Important for whoever maintains this app long-term.**

Because the OAuth app stays in "Testing" mode (we deliberately did NOT publish it for verification), Google's policy says the refresh token **may expire after ~7 days**.

In practice this is rarely enforced for single-user first-party apps, and a token captured today often lasts months. But it CAN expire without warning, in which case:

- `appendSubmission()` calls start failing silently (logged to console, no user impact)
- The most recent rows in the Sheet will have `email_status='partial'` if you wired the catch correctly, or simply stop appearing
- The PER GROUP email pipeline keeps working — only the Sheet logging stops

**How to refresh the token (3 minutes, no code change):**

1. (Local dev) Run `npm run dev`
2. Visit `http://localhost:3000/api/admin/sheets-oauth/init`
3. Sign in with the same Google account that owns the spreadsheet (`pergroup.sg@gmail.com`)
4. Click through the "unverified app" warning (Advanced → Continue)
5. Copy the new refresh token shown on the callback page
6. Update `GOOGLE_OAUTH_REFRESH_TOKEN`:
   - Local: paste into `.env.local`, restart `npm run dev`
   - Production: paste into Vercel → Project Settings → Environment Variables, then redeploy

**Permanent fix (not recommended unless needed):**

Publish the OAuth app and complete Google's app verification process. This removes the "unverified app" warning AND extends refresh token life to indefinite. Cost: 4–6 weeks of review, security assessment paperwork, and ongoing compliance. Only worth doing if you ever expose this OAuth flow to non-owners. Otherwise, the 30-second refresh-token regeneration is much cheaper.

**Detection signal — watch for these in production logs:**
- `[sheets] Append failed: invalid_grant` — refresh token revoked or expired, regenerate
- `[sheets] Append failed: invalid_client` — client ID/secret env mismatch
- No log entries but no rows appearing — env vars cleared (check Vercel)

This reminder is also surfaced on the OAuth callback page itself when a token is captured, so the next person to run the flow sees it inline.

## Risks & rollback

- **Risk:** Refresh token is sensitive (full Sheets API access for the granted account). Treat like a secret.
- **Risk:** OAuth consent screen "unverified app" warning — acceptable for v1 since the only user is the owner. To remove the warning, app verification by Google is needed (~weeks).
- **Risk:** Refresh token revoked if user revokes access in Google Account settings — rare; just re-run the OAuth flow.
- **Risk:** Refresh token may expire ~7 days when OAuth app is in Testing mode. See "Operational note" above.
- **Risk:** Without `GOOGLE_OAUTH_REFRESH_TOKEN` set, `appendSubmission()` logs a warning and skips. Submissions still email PER GROUP — no data lost from email pipeline.
- **Rollback:** Comment out `appendSubmission` calls in API routes; sheet writes stop, emails continue.

## Done when

- [ ] OAuth credentials created in Google Cloud
- [ ] Refresh token captured and stored in `.env.local`
- [ ] `npm run sheets:setup` creates 4 tabs successfully
- [ ] Test submission of each form type appears in the correct tab
- [ ] Validation harness green
- [ ] CHANGELOG entries
- [ ] SECURITY.md entry for new env vars and OAuth endpoints
- [ ] This file's Status flipped to ✅ Done
- [ ] README.md status table updated
- [ ] Committed and pushed
