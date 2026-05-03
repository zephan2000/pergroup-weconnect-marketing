# Phase 5 — EN/CN Site-Wide Toggle (combined: UI + CMS migration)

**Status:** ✅ Done (2026-05-04) — UI toggle live, CMS Payload localization configured. Some marketing blocks (ValuesBlock, AboutBlock, ServicesBlock, ClientsBlock, StatsBlock, PlatformTeaserBlock) still use English-only inline defaults; CMS-driven content respects locale via Payload native localization. See follow-up note below.
**Estimated effort:** 8–10 hours (largest phase, includes CMS schema migration)
**Files touched:** ~20

## Combined approach

Per owner decision (2026-05-03), Phase 5a (UI toggle) and 5b (CMS migration) execute together in one commit. Architecture is documented in [`infrastructure/i18n-architecture.md`](./infrastructure/i18n-architecture.md). Migration plan is documented in [`infrastructure/cms-i18n-migration.md`](./infrastructure/cms-i18n-migration.md).

## Goal

- Site-wide EN | 中文 toggle in nav
- Initial detection from `navigator.language`; persisted in cookie + localStorage
- Cookie enables server-side rendering in correct locale
- Payload v3 native localization (`localized: true`) for CMS content
- Code dictionary (`src/lib/i18n/strings.ts`) for UI labels
- Forms send `lang` field with submissions (consumed by Phase 4 ack emails)
- Decorative single Chinese characters (`心 家`, `易 医`, `和`, `爱`) stay regardless of locale

## Implementation steps

### Step 1 — Cookie-aware I18nProvider

`src/lib/i18n/context.tsx`:
- Read order on mount: cookie → localStorage → `navigator.language` → `'en'`
- `setLocale()` writes BOTH cookie (for SSR) AND localStorage (for client quick read)
- Cookie attributes: `path=/; max-age=31536000; SameSite=Lax`

### Step 2 — Payload localization config

`payload.config.ts`:
```ts
localization: {
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  fallback: true,
}
```

### Step 3 — Block schema updates

For each `src/payload/blocks/*.ts`, mark text fields `localized: true` per the inventory in `cms-i18n-migration.md`. Keep legacy `chinese*` fields as-is.

### Step 4 — Marketing layout: read locale from cookie

`src/app/(marketing)/layout.tsx`:
- Use `cookies()` from `next/headers` to read `pergroup-lang`
- Default to `'en'` if absent
- Set `<html lang>` to the resolved locale
- Pass locale into Payload `find/findGlobal` calls (via existing `fetchPayloadData()`)
- Wrap children in `<I18nProvider initialLocale={locale}>` so client provider doesn't flicker

### Step 5 — Mount provider, add LanguageToggle to Nav

Already plumbed in infrastructure. This step:
- Pass `initialLocale` from layout into `<I18nProvider>`
- Add `<LanguageToggle />` to Nav (desktop + mobile menu)

### Step 6 — Localize UI strings everywhere

For each component that has hardcoded EN+CN side-by-side:
- Replace inline `· 中文` patterns with locale-aware rendering using `useStrings()` for hardcoded labels
- Example: `'Our Network · 合作网络'` becomes `t.partners.sectionLabel` resolving to either `'Our Network'` or `'合作网络'`

Components to touch:
- `src/components/Nav.tsx`
- `src/components/Footer.tsx`
- `src/components/blocks/HeroBlock.tsx`
- `src/components/blocks/ValuesBlock.tsx`
- `src/components/blocks/AboutBlock.tsx`
- `src/components/blocks/ServicesBlock.tsx`
- `src/components/blocks/ClientsBlock.tsx`
- `src/components/blocks/StatsBlock.tsx`
- `src/components/blocks/PlatformTeaserBlock.tsx`
- `src/components/WeConnectOverlay.tsx`
- `src/components/weconnect/NeedsScreen.tsx`
- `src/components/weconnect/AlertsScreen.tsx`
- `src/components/weconnect/ProfileScreen.tsx`
- `src/components/weconnect/PostRequirementModal.tsx`
- `src/components/weconnect/SpaceDetailModal.tsx`
- `src/components/weconnect/FormField.tsx` (already accepts both labels — locale-aware render)

For CMS-driven block components, apply the fallback resolution pattern from `cms-i18n-migration.md`:
```tsx
const display = (locale === 'zh' && !headline) ? chineseHeadline ?? '' : headline
```

### Step 7 — Forms send `lang`

`PostRequirementModal.tsx` and `SpaceDetailModal.tsx`: add `lang: locale` to the request body sent to `/api/requirement` and `/api/contact`. Phase 4 ack emails already consume this.

### Step 8 — Update strings dictionary

Expand `src/lib/i18n/strings.ts` to cover every UI label that's currently hardcoded. Translation accuracy review is a TEAM_REVIEW item — AI-generated translations get a comment marker for low-confidence entries.

## Risks & mitigations

- **Risk:** Payload localization config triggers schema migration. Postgres + Payload v3 should handle it transparently (existing rows go into `en` locale automatically).
  - **Mitigation:** Test in dev first. Back up the Supabase `cms` schema before deploying to production.
- **Risk:** Cookie not present on first server render → defaults to EN, then client may flip to ZH causing FOUC.
  - **Mitigation:** Acceptable v1. Documented in TEAM_REVIEW. Future fix: middleware that sets cookie based on `Accept-Language` header before any render.
- **Risk:** Translation accuracy.
  - **Mitigation:** TEAM_REVIEW entry. AI-generated translations marked with comments (e.g., `// AI-translated, low confidence`).
- **Risk:** Existing Pages rows have data — will localization break them?
  - **Mitigation:** Payload handles this — existing data is treated as `en` locale data. ZH locale starts empty and falls back to EN via `fallback: true`. Companion `chinese*` fields continue to work.

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] First visit (clear cookie + localStorage, browser lang=en) → EN renders, toggle shows `**EN** | 中文`
- [ ] First visit with browser lang=zh-CN → ZH renders where translations exist
- [ ] Click `中文` on EN → all UI labels switch to Chinese instantly
- [ ] Refresh → language preference persists (cookie)
- [ ] Open admin (`/admin`) → page editor shows locale switcher; can edit ZH version of each localized field
- [ ] Add ZH headline in admin, save and publish → reload site in ZH mode → see new ZH headline
- [ ] Open WeConnect overlay → tabs, screens, forms all in selected locale
- [ ] Submit form in ZH mode → request body includes `"lang":"zh"` → ack email arrives in Chinese
- [ ] Mobile hamburger menu has the toggle at the top
- [ ] Decorative chars `心 家 社 世`, `易 医 爱 艺 义`, `和`, `爱` unchanged in both locales

## Follow-up scope (not in this commit)

Six marketing block components still hold English-only inline default strings
(used when CMS data is empty). Once CMS admin populates Chinese values for
these blocks via the Payload locale switcher, the localized values render
automatically. Until then, they show English in both locales.

Components needing follow-up i18n on inline defaults:
- `src/components/blocks/ValuesBlock.tsx` (sectionLabel default)
- `src/components/blocks/AboutBlock.tsx` (hardcoded milestones array)
- `src/components/blocks/ServicesBlock.tsx` (sectionLabel default)
- `src/components/blocks/ClientsBlock.tsx` (partnerTypes + regions hardcoded arrays)
- `src/components/blocks/StatsBlock.tsx` (no inline defaults — handled via Payload)
- `src/components/blocks/PlatformTeaserBlock.tsx` (sectionLabel default + body fallback)

These are cosmetic — the toggle works site-wide; only fallback defaults are
English-only. To finish: pattern-match what was done in HeroBlock.tsx:
mark as `'use client'`, import `useLocale`/`useStrings`, replace string defaults
with locale-aware values.

## Done when

- [ ] Validation harness green
- [ ] Manual checklist passes
- [ ] No remaining inline `'X · Y'` mixed strings in components (replaced by `useStrings()` or split across locales)
- [ ] All 7 marketing block schemas have `localized: true` on relevant fields
- [ ] `payload.config.ts` has localization config
- [ ] CHANGELOG entries for each modified file
- [ ] `TEAM_REVIEW.md` updated with translation review request and FOUC follow-up
- [ ] `cms-i18n-migration.md` deferred-cleanup section reflects what's now possible
- [ ] This file's Status flipped to ✅ Done
- [ ] README.md status table updated
- [ ] Committed and pushed
