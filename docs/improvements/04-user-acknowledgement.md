# Phase 4 — User Acknowledgement Email

**Status:** ⏳ Pending
**Estimated effort:** 1.5 hours
**Files touched:** 5 (1 new + 4 modified)

## Problem

When a user submits a form, only PER GROUP gets an email. The user receives no confirmation that their request was received — no auto-reply, no acknowledgement.

## Goal

After every form submission, send a thank-you email **back to the user** at the email address they provided. The email should:
- Confirm receipt
- Echo back what they submitted (so they have a record)
- State expected response time ("within 1 business day")
- Provide PER GROUP contact info as a fallback
- Be in the user's detected language (server-side `Accept-Language` header, overridden by `lang` field if present in form payload)

## Locked decisions

- **From address:** `noreply@pergroup.sg` (verified domain — must be configured in Resend dashboard)
- **Language detection:** server reads `Accept-Language` header on the request. If form payload contains `lang: 'en' | 'zh'`, that wins (this happens once Phase 5 is complete).
- **Content:** Thank-you message + echo of submitted details. **TEAM_REVIEW pending** — see `TEAM_REVIEW.md`.

## Prerequisite: Resend domain configuration

In Resend dashboard:
1. Add domain `pergroup.sg` (if not already)
2. Verify DNS records (SPF, DKIM, DMARC)
3. Confirm `noreply@pergroup.sg` can be used as a From address

Set in `.env.local`:
```bash
RESEND_FROM_EMAIL_INTERNAL=WeConnect <weconnect@pergroup.sg>
RESEND_FROM_EMAIL_USER=PER GROUP <noreply@pergroup.sg>
```

## Implementation

### Modified: `src/lib/weconnect/email.ts`

**Add language detection helper:**
```ts
type Locale = 'en' | 'zh'

export function detectLocale(acceptLanguage: string | null, override?: string): Locale {
  if (override === 'zh' || override === 'en') return override
  if (acceptLanguage?.toLowerCase().startsWith('zh')) return 'zh'
  return 'en'
}
```

**Replace `FROM_EMAIL` with two constants:**
```ts
const FROM_EMAIL_INTERNAL = process.env.RESEND_FROM_EMAIL_INTERNAL
  ?? 'WeConnect <onboarding@resend.dev>'
const FROM_EMAIL_USER = process.env.RESEND_FROM_EMAIL_USER
  ?? 'PER GROUP <onboarding@resend.dev>'
```

Update the existing `sendContactEmail`, `sendRequirementEmail`, `sendNeedEmail`, `sendOfferingEmail` to use `FROM_EMAIL_INTERNAL`.

**Add four new functions:**
```ts
export async function sendContactAck(data: ContactPayload, locale: Locale): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL_USER,
    to: data.email,
    subject: locale === 'zh'
      ? `[PER GROUP] 已收到您的咨询：${data.spaceName}`
      : `[PER GROUP] We received your inquiry — ${data.spaceName}`,
    html: buildContactAckHtml(data, locale),
  })
}

export async function sendRequirementAck(data: RequirementPayload, locale: Locale): Promise<void> {
  // similar
}

export async function sendNeedAck(data: NeedPayload, locale: Locale): Promise<void> {
  // similar
}

export async function sendOfferingAck(data: OfferingPayload, locale: Locale): Promise<void> {
  // similar
}
```

**Add HTML template builders** for each ack email. Pattern:
- Warm light styling (matches the new aesthetic)
- Header: "Thank you, {Name}" / "感谢您，{姓名}"
- Body 1: "We've received your {type} inquiry and will respond within 1 business day." / "我们已收到您的咨询，将在1个工作日内回复您。"
- "Your submission" section: echoes back all fields user filled in
- Footer: PER GROUP contact info + "If this was sent in error, please reply to this email."

Use a single shared `buildAckHtml(locale, title, intro, fields, footer)` helper to avoid repetition.

### Modified: 4 API routes

After the existing email send, fire the ack:

```ts
const locale = detectLocale(
  request.headers.get('accept-language'),
  body.lang,  // Phase 5 will start sending this; until then it's undefined
)

try {
  await sendContactAck({ /* same body */ }, locale)
} catch (err) {
  console.error('[api/contact] User ack email failed:', err)
  // Do not fail the response — the main email already succeeded
}
```

Important: ack failures must not fail the user's request. Log only.

If Phase 3 (Sheets) is complete, the sheet `email_status` column should reflect both emails:
- `'sent'` if both internal and ack succeeded
- `'partial'` if internal succeeded but ack failed
- `'failed'` if internal failed (ack is skipped in this case)

Update `appendSubmission` calls to pass the new status accordingly.

### Modified: `.env.local.example`

Document `RESEND_FROM_EMAIL_INTERNAL` and `RESEND_FROM_EMAIL_USER`.

### Modified: `SECURITY.md`

Append:
```
[YYYY-MM-DD] INFO [src/lib/weconnect/email.ts] — Added user-facing acknowledgement emails
  sent from noreply@pergroup.sg. Requires Resend domain verification for pergroup.sg.
  No PII added to logs (only error messages on failure). Acknowledgement language
  determined server-side from Accept-Language header.
```

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] Submit a test PostRequirement form with a real email you control
- [ ] PER GROUP receives the internal email at `pergroup.sg@gmail.com`
- [ ] User (you) receives an acknowledgement at the submitted email
- [ ] Ack subject is `[PER GROUP] We received your inquiry...`
- [ ] Ack echoes back the submitted fields correctly
- [ ] Ack arrives within ~5 seconds of submission
- [ ] Submit again with `Accept-Language: zh-CN` (DevTools → Settings → Languages → 中文 first) — ack should arrive in Chinese
- [ ] Repeat for SpaceDetail contact form
- [ ] Force ack to fail (temporarily change to invalid email server-side) — internal email still succeeds, sheet logs `email_status='partial'`
- [ ] Check spam folder — ack should NOT land in spam (DKIM/SPF properly configured)

## Risks & rollback

- **Risk:** Resend domain not verified — ack send fails silently. Mitigation: validation step #4 above; phase doc says verify Resend setup first.
- **Risk:** User typoes their email → ack bounces. Acceptable. The internal email still succeeds.
- **Risk:** Acknowledgement marked as spam. Mitigation: DMARC + DKIM + SPF must be set up in Resend.
- **Rollback:** Comment out the `await sendXxxAck(...)` calls. Internal email continues to work.

## Open items needing TEAM_REVIEW

- Exact wording of the thank-you message in EN and ZH (legal/marketing review needed)
- Whether to include a one-click "Reply in your case" link or just the email's reply-to header
- Whether to BCC PER GROUP on the user ack (so the team has a record of what users see)

## Done when

- [ ] Validation harness green
- [ ] Manual checklist all pass (including spam folder check)
- [ ] CHANGELOG entries
- [ ] SECURITY.md entry added
- [ ] This file's Status flipped to ✅ Done
- [ ] README status table updated
- [ ] Committed and pushed
