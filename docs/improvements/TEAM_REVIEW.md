# TEAM_REVIEW — Open Items Needing Human Decision

These are items that surfaced during planning but require human input before launch. They do NOT block implementation — implementation proceeds with sensible defaults documented in each phase. These should be reviewed and confirmed before the work goes to production.

Format per item: **Topic** → status → context → decision needed.

---

## Acknowledgement email language strategy

**Status:** Open — review before public launch
**Context:** Phase 4 sends the user a confirmation email. Language is detected server-side from the `Accept-Language` HTTP header (or, after Phase 5 ships, overridden by the explicit `lang` field from the toggle).
**Decision needed:**
- Is server-side `Accept-Language` reliable enough for a Chinese audience, or should we always include both languages stacked in every ack email until Phase 5 toggle data is more reliable?
- Should ack emails include a "view in English / 查看中文版" link at the top regardless of locale?

---

## Acknowledgement email wording

**Status:** Open — content needs marketing/legal sign-off
**Context:** Current draft is functional ("Thank you, we received your inquiry, response within 1 business day, here's what you submitted, contact info"). No legal disclaimer, no marketing voice.
**Decision needed:**
- Final wording for both EN and ZH variants
- Should it include a privacy notice ("Your information will be used solely to respond to this inquiry")?
- Tone: formal corporate vs. warm relationship-first?

---

## BCC PER GROUP on user acknowledgement

**Status:** Open
**Context:** Currently the user ack goes only to the user. The internal email is a separate send.
**Decision needed:** Should PER GROUP be BCC'd on the user ack, so the team has a copy of exactly what the user saw? Pro: full audit trail. Con: doubles the inbox volume.

---

## Chinese translation accuracy review

**Status:** Required before launch
**Context:** Phase 5 i18n introduces ~50–100 Chinese strings in the code dictionary plus ack email templates. Initial translations are AI-generated.
**Decision needed:** A native Mandarin speaker (ideally Chinese-business familiar) should review:
- `src/lib/i18n/strings.ts`
- All `*Ack` email templates in `src/lib/weconnect/email.ts`
- All form labels and placeholder text
- All section headers ("Basic Information · 基本信息" etc.)

---

## CMS Chinese fields gap

**Status:** Required before launch in Chinese mode
**Context:** Some Payload CMS blocks have an English field with no Chinese pair (e.g., AboutBlock `body` rich text, advantage `description`, services `description`). Under ZH locale these will render the English fallback.
**Decision needed:** Either
- (a) Add `body_zh`, `description_zh` etc. fields to the Payload block schemas + populate them, OR
- (b) Accept English fallback for v1 and prioritize translating them post-launch
**Plan:** [`infrastructure/cms-i18n-migration.md`](./infrastructure/cms-i18n-migration.md) lists every gap.

---

## Hydration / FOUC for language toggle

**Status:** Acceptable v1, follow-up needed
**Context:** Phase 5 toggle reads localStorage on first client effect, which can cause a brief flash from default (EN) to user's preference (ZH). The cleanest fix is a Next.js middleware that sets a cookie, allowing server-side rendering in the correct locale.
**Decision needed:** Before public launch, decide whether the FOUC is acceptable or whether to invest in middleware-based locale routing.

---

## Resend domain verification

**Status:** Required before Phase 4 ships
**Context:** Phase 4 sends from `noreply@pergroup.sg`. This requires the domain verified in Resend with proper DKIM, SPF, DMARC.
**Decision needed:** Owner action — log into Resend dashboard, verify the domain, set DNS records.
**Validation:** Ack email passes spam test (delivers to inbox, not spam folder).

---

## Sheets retention / privacy

**Status:** Open — review before public launch
**Context:** Phase 3 logs every form submission to Google Sheets, including personal info (name, email, phone, company).
**Decision needed:**
- How long should rows be retained?
- Who in PER GROUP has access to the spreadsheet?
- Should a privacy notice be added to the form ("Submitting this form shares your data with PER GROUP. We retain it for X period.")?
- GDPR / PDPA implications for Singapore/EU/China users?

---

## Plan corrections needed

(Empty — agents add entries here when implementation reveals plan errors.)

---

## How to use this file

When implementing a phase, if you encounter something the plan didn't anticipate, add an entry under "Plan corrections needed" rather than guessing. After resolution, move it under a regular section above and mark resolved.
