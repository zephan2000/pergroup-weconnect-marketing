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
| 5 | EN/CN site-wide toggle (initial) | [`05-i18n-toggle.md`](./05-i18n-toggle.md) | ✅ Done (commit `1578f0c`) | 25 |
| 5b | Move everything to CMS — phased rollout | [`05b-cms-everything.md`](./05b-cms-everything.md) | ⏳ 5b.3 done, 5b.4 next | ~25 |

### Phase 5b sub-phase status

| Sub-phase | Description | Status |
|---|---|---|
| 5b.1 | Translation worksheet — full inventory | ✅ Done — see [`zh-translation-worklist.md`](./zh-translation-worklist.md) |
| 5b.2 | Schema migration (additive) — add 5 new globals + 3 array fields, pre-populate | ✅ Done 2026-05-06 (migration `20260506_010000_phase5b2_globals_arrays.ts`) |
| 5b.3a | Component refactor — Nav + Footer | ✅ Done 2026-05-06 |
| 5b.3b | Component refactor — WeConnect overlay | ✅ Done 2026-05-07 |
| 5b.3c | Component refactor — marketing blocks | ✅ Done 2026-05-07 |
| 5b.3d | Component refactor — forms | ✅ Done 2026-05-07 |
| 5b.4 | ZH translation fill (SQL-driven) | ⏳ Next |
| 5b.5 | Drop legacy `chinese*` companion fields | ⏳ Pending (after 48h stable) |

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
| EN+CN side-by-side display | **Banned** as of 2026-05-05 (Phase 5b). Pure single-locale rendering. Old `English · 中文` mixed strings get split during 5b.4. |
| i18n string source (final state) | **All rendered text lives in CMS.** Dictionary (`src/lib/i18n/strings.ts`) becomes a thin fallback by end of Phase 5b.3. |
| Form dropdown options | Lite CMS control: admin edits LABELS, option `value` codes stay frozen in code (API references them). Adding/removing options deferred. |
| Footer brand pillar (`pillarLine`) | Separate slot from `mission`. EN: `Tech Innovation · Business Empowerment · Human Care`. ZH: `科技创新 · 商业赋能 · 人文关怀`. |
| Hero ZH headline layout | Same 3-line visual pattern as EN (`headline / accent / faint`). Constrain Chinese phrasing to fit. |
| Translation workflow | SQL-driven (Phase 5b.4). Single annotated SQL file lists every translation for owner review. Avoids 53+ admin clicks. |
| Sheets structure | One spreadsheet, **4 separate tabs** — Contact, Requirement, Need, Offering. Each tab has form-specific columns. |
| Sheets auth | **OAuth refresh-token flow** (not service account — Google Workspace org policy blocks SAs). One-time consent at `/api/admin/sheets-oauth/init`. |
| Sheets setup | One-shot script `npm run sheets:setup`. Idempotent. Creates tabs + headers. |
| From email (PER GROUP) | `weconnect@pergroup.sg` (verified domain) |
| From email (user ack) | `noreply@pergroup.sg` |
| Validation harness | TypeScript + ESLint + Next.js build. One-command via `bash scripts/validate.sh`. |

## Open items requiring human review

See [`TEAM_REVIEW.md`](./TEAM_REVIEW.md). These don't block implementation but should be discussed before launch.

## Operational runbooks

These are reference docs you read **before** doing risky operations, not phase plans:

- [`infrastructure/cms-backup-runbook.md`](./infrastructure/cms-backup-runbook.md) — **read this before any Payload migration on production.** Backup procedure, verification, restore commands, cleanup cadence.

## Folder map

```
docs/improvements/
├── README.md                       ← you are here
├── 00-conventions.md               ← agent rules (read first)
├── 01-cursor-redesign.md
├── 02-field-validation-ux.md
├── 03-google-sheets.md
├── 04-user-acknowledgement.md
├── 05-i18n-toggle.md               ← Phase 5 (initial localization, done)
├── 05b-cms-everything.md           ← Phase 5b (move all rendered text to CMS, in progress)
├── zh-translation-worklist.md      ← full inventory of every text on the site
├── TEAM_REVIEW.md                  ← open questions
└── infrastructure/
    ├── cms-backup-runbook.md       ← backup/restore SOP for any CMS migration
    ├── i18n-architecture.md        ← how toggle + dictionary + CMS interact
    ├── cms-i18n-migration.md       ← (legacy field migration plan)
    └── sheets-schema.md            ← exact column definitions per tab
```
