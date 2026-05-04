# Improvements Plan — PER GROUP × WeConnect

This folder contains the **persistent, agent-friendly implementation plan** for five improvements to the WeConnect platform. Each phase is self-contained: an agent can pick up any single phase file and execute it without needing the rest of the conversation context.

## How to use this folder

**For agents resuming work:**
1. Read [`00-conventions.md`](./00-conventions.md) first — shared rules for validation, commits, env vars, security log
2. Check the **Status** column below to find the next pending phase
3. Open that phase's `.md` file and follow it top-to-bottom
4. After completing, mark the phase as ✅ in this README and append a CHANGELOG.md entry

**Sequencing rule:** Phases must be executed in order. Each phase ends with a green validation harness run + commit. Do not start a phase until the previous one is committed.

## Status

| # | Phase | File | Status | Estimated files touched |
|---|---|---|---|---|
| 1 | Cursor redesign for light mode | [`01-cursor-redesign.md`](./01-cursor-redesign.md) | ✅ Done | 1 |
| 2 | Form field validation UX | [`02-field-validation-ux.md`](./02-field-validation-ux.md) | ✅ Done | 3 |
| 3 | Google Sheets integration | [`03-google-sheets.md`](./03-google-sheets.md) | ✅ Code done (awaits owner OAuth setup) | 9 |
| 4 | User acknowledgement email | [`04-user-acknowledgement.md`](./04-user-acknowledgement.md) | ✅ Done (awaits Resend domain verify) | 5 |
| 5 | EN/CN site-wide toggle | [`05-i18n-toggle.md`](./05-i18n-toggle.md) | ⏳ Pending | ~15 |

## Locked design decisions

These were settled with the project owner before this plan was written. **Do not deviate without explicit confirmation.**

| Decision | Choice |
|---|---|
| Acknowledgement email language | Server-side: read `Accept-Language` header. Override if `lang` is in form payload. |
| Acknowledgement email content | Echo back submitted details + thank-you. (Team review pending — see `TEAM_REVIEW.md`) |
| EN/CN toggle scope | Entire site (marketing + WeConnect overlay) |
| Toggle UI | `EN | 中文` text in nav, active language highlighted in amber. Inside hamburger on mobile. |
| Language detection | First visit: `navigator.language` starts with `zh` → `zh`; else `en`. Persist in `localStorage['pergroup-lang']`. |
| Decorative Chinese characters | Single brand calligraphy chars (e.g. `心 家 社 世`, `易 医 爱 艺 义`) **stay regardless of locale** — they are iconic, not translatable text. Paragraph-level CN/EN hides under the opposite locale. |
| i18n string source | Code dictionary (`src/lib/i18n/strings.ts`) for UI labels. CMS Payload fields for content (already has `chinese*` companion fields). |
| Sheets structure | One spreadsheet, **4 separate tabs** — Contact, Requirement, Need, Offering. Each tab has form-specific columns. |
| Sheets auth | **OAuth refresh-token flow** (not service account — Google Workspace org policy blocks SAs). One-time consent at `/api/admin/sheets-oauth/init`. |
| Sheets setup | One-shot script `npm run sheets:setup`. Idempotent. Creates tabs + headers. |
| From email (PER GROUP) | `weconnect@pergroup.sg` (verified domain) |
| From email (user ack) | `noreply@pergroup.sg` |
| Validation harness | TypeScript + ESLint + Next.js build. One-command via `bash scripts/validate.sh`. |

## Open items requiring human review

See [`TEAM_REVIEW.md`](./TEAM_REVIEW.md). These don't block implementation but should be discussed before launch.

## Folder map

```
docs/improvements/
├── README.md                       ← you are here
├── 00-conventions.md               ← agent rules (read first)
├── 01-cursor-redesign.md
├── 02-field-validation-ux.md
├── 03-google-sheets.md
├── 04-user-acknowledgement.md
├── 05-i18n-toggle.md
├── TEAM_REVIEW.md                  ← open questions
└── infrastructure/
    ├── i18n-architecture.md        ← how toggle + dictionary + CMS interact
    ├── cms-i18n-migration.md       ← which CMS fields need a Chinese pair added
    └── sheets-schema.md            ← exact column definitions per tab
```
