# Phase 5 — EN/CN Site-Wide Language Toggle

**Status:** ⏳ Pending
**Estimated effort:** 6–8 hours (largest phase)
**Files touched:** ~15

## Problem

Currently every bilingual element shows English AND Chinese simultaneously side-by-side. There is no way for a user to view the site in just one language. The user expects a **full EN vs full ZH website**.

## Goal

- Site-wide language state (EN | ZH)
- Initial detection: `navigator.language.startsWith('zh')` → `zh`, else `en`
- User-toggle UI in nav: `EN | 中文`. Active language highlighted in amber. Inside hamburger on mobile.
- Persist user choice in `localStorage['pergroup-lang']` — once set, detection is bypassed
- Every visible string switches based on locale:
  - **Code-defined UI strings** (nav, buttons, form labels) — from `src/lib/i18n/strings.ts` dictionary
  - **CMS content** — uses existing `chinese*` companion fields when in `zh`, English fields when in `en`. Where a Chinese pair is missing in CMS, see `infrastructure/cms-i18n-migration.md`.
  - **Decorative single Chinese characters** (e.g., `心 家 社 世`, `易 医 爱 艺 义`, the central `和` and `爱` glyphs) — these stay regardless of locale (calligraphic brand identity, not translatable text)

## Locked decisions

- Toggle UI: text `EN | 中文` with active in amber. Mobile: inside hamburger.
- Detection: `navigator.language` once on first visit; localStorage thereafter
- Decorative single CN chars: ALWAYS render
- Paragraph-level CN/EN: hide the opposite under each locale
- Strings dictionary: code (not CMS) for v1
- Forms: also localize labels (e.g., `Subject · 主题` → `Subject` or `主题`)

## Architecture

See [`infrastructure/i18n-architecture.md`](./infrastructure/i18n-architecture.md) for the design diagram.

The infrastructure is **already built** before this phase starts (during initial setup):
- `src/lib/i18n/context.tsx` — `<I18nProvider>` + `useLocale()` hook
- `src/lib/i18n/strings.ts` — UI string dictionary
- `src/components/LanguageToggle.tsx` — toggle component
- The provider is mounted but does not yet drive any rendering

This phase wires up every component to use it.

## Implementation

### Step 1 — Mount the provider

`src/app/(marketing)/layout.tsx`: wrap children in `<I18nProvider>` (already imported during infrastructure setup).

### Step 2 — Add toggle to Nav

`src/components/Nav.tsx`:
- Import `<LanguageToggle />`
- Place it in the desktop nav links section, before `WeConnect ✦`
- Place it inside the mobile hamburger menu (top item)

### Step 3 — Localize Nav itself

```tsx
const t = useStrings()  // returns the dictionary for current locale

const navLinks = [
  { label: t.nav.philosophy, href: '/#values' },
  { label: t.nav.about, href: '/#about' },
  { label: t.nav.services, href: '/#services' },
  { label: t.nav.partners, href: '/#clients' },
]
```

### Step 4 — Localize Footer

`src/components/Footer.tsx`:
- Replace hardcoded EN+CN side-by-side strings with `t.footer.*`
- Hide CN text (`让创新对任何人、任何地方开放`, `e创码头`) under EN, hide EN footer body under ZH

### Step 5 — Localize each marketing block

For each block in `src/components/blocks/`:

**Pattern A — Inline mixed strings (`'Our Network · 合作网络'`):**
Split into `{ en, zh }`:
```ts
const sectionLabel = locale === 'en' ? 'Our Network' : '合作网络'
```

**Pattern B — Side-by-side dual elements:**
Show only the locale-matching one:
```tsx
{locale === 'en' && <p>English subtitle</p>}
{locale === 'zh' && <p className="font-noto-sans-sc">中文副标题</p>}
```

**Pattern C — CMS bilingual fields (`chineseLabel`, `chineseTitle`):**
```tsx
const display = locale === 'zh' ? (item.chineseTitle ?? item.title) : item.title
```
(Falls back to English if the Chinese field isn't filled in CMS.)

**Pattern D — Decorative single Chinese characters (`心`, `易`, `和`, `爱`):**
NO change — keep rendering regardless of locale.

Files to update:
- `src/components/blocks/HeroBlock.tsx`
- `src/components/blocks/ValuesBlock.tsx`
- `src/components/blocks/AboutBlock.tsx`
- `src/components/blocks/ServicesBlock.tsx`
- `src/components/blocks/ClientsBlock.tsx`
- `src/components/blocks/StatsBlock.tsx`
- `src/components/blocks/PlatformTeaserBlock.tsx`

### Step 6 — Localize WeConnect overlay

- `src/components/WeConnectOverlay.tsx` — tab labels, topbar text
- `src/components/weconnect/NeedsScreen.tsx`
- `src/components/weconnect/AlertsScreen.tsx`
- `src/components/weconnect/ProfileScreen.tsx`

### Step 7 — Localize forms

- `src/components/weconnect/PostRequirementModal.tsx`
- `src/components/weconnect/SpaceDetailModal.tsx`
- The `<FormField>` component already accepts both `label` and `labelZh` — render based on locale.
- Section headers (Basic Information / Requirement Details / etc.) use dictionary keys.
- Placeholder text — same.
- Submit button text — same.

### Step 8 — Send `lang` with form submissions

When forms POST to `/api/contact`, `/api/requirement`, etc., include the current locale in the body:
```ts
body: JSON.stringify({
  // ...existing fields,
  lang: locale,
})
```

This is what Phase 4's user acknowledgement consumes (overrides `Accept-Language` header detection).

### Step 9 — CMS migration check

See [`infrastructure/cms-i18n-migration.md`](./infrastructure/cms-i18n-migration.md).

Some CMS fields don't yet have a Chinese pair (e.g., AboutBlock's `body` rich text, advantage `description`, services `description`). These render as English in both modes until the CMS admin adds Chinese versions. Document this clearly in the CMS migration file and call it out in TEAM_REVIEW.

## Validation

### Harness
```bash
bash scripts/validate.sh
```

### Manual checklist
- [ ] First visit (clear localStorage) with browser language `en-US` → site loads in English. Toggle shows `**EN** | 中文` (EN active)
- [ ] First visit with browser language `zh-CN` → site loads in Chinese. Toggle shows `EN | **中文**`
- [ ] Click `中文` on EN site → all paragraph text + nav + buttons switch to Chinese instantly. Decorative CN chars (`心 家 社 世`, `和`, `爱`) unchanged.
- [ ] Refresh page → language preference persists
- [ ] Open in incognito → fresh detection runs again
- [ ] Open WeConnect overlay → topbar, sidebar, screens all in selected locale
- [ ] Open Post a Need form → labels, placeholders, button all in selected locale
- [ ] Submit form in Chinese mode → check Network tab — request body includes `"lang":"zh"`
- [ ] (Phase 4 dependency) Acknowledgement email arrives in Chinese
- [ ] Mobile: hamburger menu has the toggle at top
- [ ] No layout shift / FOUC when toggling
- [ ] No CN-only Chinese characters appear in EN mode (except decorative brand calligraphy)

## Risks & rollback

- **Risk:** Hydration mismatch — server renders EN by default, client may flip to ZH if localStorage says so. Mitigation: render with locale unset on server, apply locale on first client effect. Brief flash possible — acceptable v1.
  - Better: read locale from cookie (set by middleware after first detection). Document as a follow-up in TEAM_REVIEW.
- **Risk:** Some CMS fields have no Chinese pair → ZH mode shows English fallback. Document in CMS migration plan; not a bug.
- **Risk:** Translation accuracy — proposed Chinese strings should be reviewed by a native speaker. Add to TEAM_REVIEW.
- **Rollback:** Revert per-component changes incrementally. The provider/hook/dictionary infrastructure is non-breaking — leaving them in place doesn't affect the site.

## Done when

- [ ] Validation harness green
- [ ] Manual checklist all pass
- [ ] No remaining instances of `'X · Y'` mixed-string patterns in marketing components
- [ ] All forms send `lang` field with submissions
- [ ] CHANGELOG entries (will be many)
- [ ] CMS migration plan documented in `infrastructure/cms-i18n-migration.md`
- [ ] TEAM_REVIEW updated with: translation review request, hydration follow-up, CMS Chinese-fields-needed list
- [ ] This file's Status flipped to ✅ Done
- [ ] README status table updated
- [ ] Committed and pushed
