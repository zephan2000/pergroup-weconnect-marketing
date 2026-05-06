# Phase 5b — Move Everything to CMS

**Status:** ⏳ Planning complete (5b.1 done) — implementation 5b.2–5b.5 pending
**Estimated total effort:** 1.5 days, split across 4 incremental commits
**Owner:** Single decision-maker (admin populates ZH translations)

## Why this phase exists

Phase 5 (commit `1578f0c`) successfully shipped Payload localization with data preservation. But:
- ~80 UI strings still live in `src/lib/i18n/strings.ts` (dictionary)
- ~30 hardcoded array values in components (milestones, partner types, regions)
- Form labels/placeholders/options are hardcoded
- Several mixed-locale strings (`English · 中文`) still appear in EN mode

Owner decision: **everything that renders on the website should be editable in CMS**. No EN+CN side-by-side anywhere. Dictionary becomes a thin fallback only.

## Locked decisions (do not deviate without owner approval)

| | |
|---|---|
| EN+CN side-by-side display | **Banned everywhere.** Pure single-locale rendering. |
| Hero ZH layout | **Same 3-line visual pattern** (`headline / accent / faint`). Constrain Chinese phrasing to fit. |
| Form dropdown options | **Lite control** — admin edits LABELS only. Option `value` codes (`'office'`, `'lab'`) stay frozen because the API references them. Adding/removing options is deferred. |
| Footer `pillarLine` | **Keep as separate slot.** EN: `Tech Innovation · Business Empowerment · Human Care`. ZH: `科技创新 · 商业赋能 · 人文关怀`. |
| Hero headline ZH | **Translate** "Make Innovation Open to Anyone, Anywhere." to fit the 3-line layout. |
| Translation workflow | **SQL-driven.** Owner drafts/reviews translations in a single SQL file rather than clicking through 53+ admin pages. |
| Schema migration risk | **Additive only** in this phase (CREATE TABLE, ADD COLUMN, INSERT). No DROPs. Backup not strictly required but documented in cms-backup-runbook.md. |
| Single-locale field pattern | **`localized: true`** on the canonical field. New fields don't get `chinese*` companions. |
| Dictionary `src/lib/i18n/strings.ts` | **Becomes thin fallback** by end of phase. Most keys removed once components read from CMS. |
| Live preview | **Wire for all new globals** so admin can see edits side-by-side without leaving CMS. |

## Sub-phase breakdown

### Phase 5b.1 — Translation worksheet ✅ DONE

Output: [`zh-translation-worklist.md`](./zh-translation-worklist.md). Full inventory of every text rendered on the site, with source + EN value + ZH value (or MISSING) + target CMS field.

Key numbers:
- 53 existing CMS fields with EN populated, ZH empty
- ~12 mixed-locale strings to split
- ~80 dictionary strings to migrate to CMS
- 3 hardcoded arrays to migrate (milestones, partner types, regions)

### Phase 5b.2 — Schema migration (additive) ✅ DONE 2026-05-06

**Migration:** `src/migrations/20260506_010000_phase5b2_globals_arrays.ts`. Applied via `scripts/apply-migration.mjs` because the Payload CLI is currently broken on this dev box (Node v24 + tsx 4.21 ESM resolution). See cms-backup-runbook.md → "Known blocker" for details and workaround.

**Verified state on prod after migration:**
- 5 globals × 2 locales = 10 locale rows seeded ✓
- 4 milestones × 2 locales = 8 milestone-locale rows ✓
- 4 partner types × 2 locales = 8 partner-type-locale rows ✓
- 6 regions × 2 locales = 12 region-locale rows ✓
- ClientsBlock parent locales: 2 rows (en/zh, with networkSubtitle + regionsHeading) ✓
- Hero `scroll_hint_label`: en=SCROLL, zh=向下滚动 ✓
- Services `subtitle`: en="End-to-end global services", zh=全方位全球化服务 ✓ (zh row inserted via `scripts/patch-services-zh.mjs` since the previous Phase 5 migration only seeded EN for ServicesBlock parent locales)

**Goal (achieved):** all CMS fields exist + are pre-populated with current EN/ZH values. **Frontend code unchanged.** Site renders exactly as today.

**Schema additions:**

| New global | Purpose | Approx field count |
|---|---|---|
| `NavSettings` | Nav links + WeConnect CTA + a11y label | 7 |
| `FooterSettings` | Tagline, mission, copyright, eHarbor tags, pillar line | 8 |
| `WeConnectSettings` | Overlay tabs + screen text (Needs/Alerts/Profile/Settings) | 22 |
| `RequirementFormSettings` | Heading, description, all section titles, all labels, all placeholders, all dropdown option labels, button text, success/error messages, response SLA, required hint | 50+ |
| `ContactFormSettings` | SpaceDetailModal heading + success messages + space-detail row labels | 8 |

**Block field additions:**

| Block | Field | Type | Purpose |
|---|---|---|---|
| `AboutBlock` | `milestones[]` | array | Replaces hardcoded `milestones` array. Items: `year` (text, not localized), `title` (text, localized) |
| `ClientsBlock` | `partnerTypes[]` | array | Replaces hardcoded `partnerTypes` array. Items: `icon` (text), `title` (localized), `examples` (localized) |
| `ClientsBlock` | `regions[]` | array | Replaces hardcoded `regions` array. Items: `name` (localized), `count` (text, not localized) |
| `ClientsBlock` | `networkSubtitle` (localized) | text | Replaces hardcoded `遍布全球的合作伙伴网络` |
| `ClientsBlock` | `regionsHeading` (localized) | text | Replaces hardcoded `区域覆盖` |
| `ServicesBlock` | `subtitle` (localized) | text | Replaces hardcoded `全方位全球化服务` |
| `HeroBlock` | `scrollHintLabel` (localized) | text | Replaces hardcoded `SCROLL` (optional) |

**Pre-population strategy:**

The migration's UP function will:
1. CREATE all new tables and ADD all new columns (auto-generated by `payload migrate:create`)
2. INSERT pre-population data from current EN dictionary + ZH dictionary, AND hardcoded arrays:
   ```sql
   INSERT INTO cms.nav_settings_locales (_locale, link_philosophy, link_about, ...)
   VALUES ('en', 'Philosophy', 'About', ...);
   INSERT INTO cms.nav_settings_locales (_locale, link_philosophy, link_about, ...)
   VALUES ('zh', '理念', '关于我们', ...);
   ```
3. For arrays (milestones, partnerTypes, regions): INSERT each item then INSERT the localized text into the *_locales table

This means the moment the migration runs, admin can see all current strings in `/admin` — ready to edit with live preview.

**Validation gate (passed):**
- ✅ TypeScript clean
- ✅ `npm run build` succeeds
- ✅ Dry-run on prod (BEGIN/ROLLBACK) passed before real apply
- ✅ Migration recorded in `cms.payload_migrations` table

### Phase 5b.3 — Component refactor (4 sub-commits)

**Goal:** components consume CMS fields instead of dictionary/hardcoded. Dictionary keys removed as their consumers are refactored. Live preview becomes meaningful.

#### 5b.3a — Nav + Footer
Files: `src/components/Nav.tsx`, `src/components/Footer.tsx`

- Read from new `NavSettings` global
- Read from new `FooterSettings` global
- Remove `nav.*` and `footer.*` keys from `strings.ts`
- Remove EN+CN side-by-side rendering (e.g., `{eHarborTag} · <span>{eHarborTagCn}</span>`)

#### 5b.3b — WeConnect overlay screens
Files: `src/components/WeConnectOverlay.tsx`, `src/components/weconnect/{NeedsScreen,AlertsScreen,ProfileScreen}.tsx`

- Read from new `WeConnectSettings` global
- Remove `weconnect.*` keys from `strings.ts`
- Sample data (alerts, recent needs) — leave hardcoded since they're preview/mock content

#### 5b.3c — Marketing blocks
Files: `src/components/blocks/{HeroBlock,AboutBlock,ClientsBlock,ServicesBlock}.tsx`

- HeroBlock: read `subtitle` (localized) field, fall back to legacy `chineseSubtitle` if empty (transitional). Read `scrollHintLabel` from CMS.
- AboutBlock: read `milestones[]` from CMS instead of hardcoded array. Delete the hardcoded `milestones` const.
- ClientsBlock: read `partnerTypes[]` and `regions[]` from CMS. Delete hardcoded arrays. Read `networkSubtitle` and `regionsHeading` from CMS.
- ServicesBlock: read `subtitle` from CMS instead of hardcoded `全方位全球化服务`.
- Fix all rendering to be locale-aware (no chinese* fields shown alongside EN).

#### 5b.3d — Forms (PostRequirementModal + SpaceDetailModal)
Files: `src/components/weconnect/PostRequirementModal.tsx`, `src/components/weconnect/SpaceDetailModal.tsx`, `src/components/weconnect/FormField.tsx`

- Read all section headers, labels, placeholders, button text, success/error messages from `RequirementFormSettings` and `ContactFormSettings`
- Read dropdown OPTION LABELS from CMS arrays (option `value`s stay frozen in code)
- Remove `forms.*` keys from `strings.ts`
- `FormField` component: render single locale label, NOT `{label} · {labelZh}`

### Phase 5b.4 — ZH translation fill (SQL-driven)

**Workflow:**

1. I draft a single SQL file: `scripts/zh-translations-fill.sql`
2. Each statement is annotated with a comment showing the EN source + AI-suggested ZH translation:
   ```sql
   -- Hero headline (3-line block, line 1 of 3)
   -- EN: "Make Innovation"
   -- ZH (suggested): "让创新"
   INSERT INTO cms.pages_blocks_hero_locales (_locale, _parent_id, headline, headline_accent, headline_faint)
   VALUES ('zh', '69b92ce6fe25505f1d64e646', '让创新', '对每一个人开放，', '任何地方。')
   ON CONFLICT (_locale, _parent_id) DO UPDATE
     SET headline = EXCLUDED.headline,
         headline_accent = EXCLUDED.headline_accent,
         headline_faint = EXCLUDED.headline_faint;
   ```
3. Owner reads the file, edits any phrases that need rewording
4. I run the corrected SQL against production via Supabase SQL editor or psql
5. Owner spot-checks live site at `pergroup.sg` in ZH mode
6. Targeted SQL patches for any further refinements

**Benefits over admin-clicking:**
- 53+ field reviews in one document instead of 53 admin pages
- Reusable artifact for future translators
- Idempotent (`ON CONFLICT DO UPDATE`) — safe to re-run

### Phase 5b.5 — Drop legacy `chinese*` companion fields

**Run only after Phase 5b.4 is verified stable for 48 hours.**

Companion fields (`chineseSubtitle`, `chineseLabel`, `chineseTitle`, `chineseHeadline`, the decorative `chinese` on Values items stays) are no longer needed once `localized: true` versions are populated.

Migration:
```sql
ALTER TABLE cms.pages_blocks_hero DROP COLUMN IF EXISTS chinese_subtitle;
ALTER TABLE cms.pages_blocks_hero_stats DROP COLUMN IF EXISTS chinese_label;
ALTER TABLE cms.pages_blocks_stats_stats DROP COLUMN IF EXISTS chinese_label;
ALTER TABLE cms.pages_blocks_values DROP COLUMN IF EXISTS chinese_headline;
ALTER TABLE cms.pages_blocks_services_services DROP COLUMN IF EXISTS chinese_title;
-- + same on _pages_v_* version tables
```

Plus update Payload block schemas to remove the legacy field definitions.

## How to use this document

**For agents resuming any sub-phase:**
1. Read this entire document first
2. Check the [README.md status table](./README.md) for which sub-phase is next
3. Read `zh-translation-worklist.md` for the source-of-truth field inventory
4. Follow the relevant sub-phase section above
5. After completing, update CHANGELOG.md + flip the sub-phase status here

**Before any sub-phase ships:**
- Run `bash scripts/validate.sh` (TypeScript + lint + build all green)
- Update CHANGELOG.md
- Commit with descriptive message + Co-Authored-By tag

## Open items / risks

- **Translation accuracy:** AI-drafted Chinese needs native speaker review (TEAM_REVIEW item — already flagged)
- **Hero 3-line constraint in ZH:** if a Chinese phrase doesn't fit the 3-line visual pattern, the design may need to adapt. Defer to live preview check during 5b.4.
- **Dropdown options frozen:** if owner ever needs to add a 7th inquiry type, that requires a code+migration change (not CMS-only). Documented; deferred.

## Validation harness

Same as other phases:
```bash
bash scripts/validate.sh
```
Each sub-phase ends with a green run before commit.
