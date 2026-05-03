# CMS i18n Migration Plan

## Strategy: Transitional, non-destructive

Rather than a one-shot schema rewrite that risks data loss or breaks the CMS for editors, we adopt a **transitional approach**:

1. **Now (Phase 5):** Mark base fields as `localized: true`. Keep legacy `chinese*` companion fields. Components use a fallback chain: localized field → legacy companion → English fallback.
2. **Later (deferred phase):** After admin team has populated `zh` locale values via the admin UI, run a data migration to backfill any remaining ZH values from companion fields. Then drop the companion fields.

Benefit: zero data loss, gradual editor onboarding, fully reversible if issues found.

## Field inventory

For each Payload block, here are the fields that get `localized: true` in Phase 5, and which legacy companion fields exist:

### HeroBlock (`src/payload/blocks/HeroBlock.ts`)

| Field | localized? | Legacy companion |
|---|---|---|
| `eyebrow` | ✅ added | (none — needs translation in ZH locale) |
| `headline` | ✅ added | (none) |
| `headlineAccent` | ✅ added | (none) |
| `headlineFaint` | ✅ added | (none) |
| `chineseSubtitle` | KEEP (legacy) | — |
| `subtitle` | ✅ NEW localized field | falls back to `chineseSubtitle` for ZH |
| `ctaButtons[].label` | ✅ added | (none) |
| `stats[].label` | ✅ added | `chineseLabel` |

### StatsBlock

| Field | localized? | Legacy companion |
|---|---|---|
| `stats[].number` | NO (digits, no translation) | — |
| `stats[].label` | ✅ added | `chineseLabel` |

### ValuesBlock

| Field | localized? | Legacy companion |
|---|---|---|
| `sectionLabel` | ✅ added | (mixed string was 'Our Philosophy · 我们的哲学' — split into EN/ZH locale values) |
| `headline` | ✅ added | `chineseHeadline` |
| `chineseHeadline` | KEEP (legacy) | — |
| `fourHarmoniesItems[].english` | ✅ added | `fourHarmoniesItems[].chinese` |
| `fourHarmoniesItems[].chinese` | KEEP (legacy) | — |
| `fiveUnitiesItems[].english` | ✅ added | `fiveUnitiesItems[].chinese` |
| `fiveUnitiesItems[].chinese` | KEEP (legacy) | — |
| `mottos[].english` | ✅ added | `mottos[].chinese` |
| `mottos[].chinese` | KEEP (legacy) | — |
| `mottos[].label` | ✅ added | (none — typically EN like "VALUES", "VISION") |

### AboutBlock

| Field | localized? | Legacy companion |
|---|---|---|
| `headline` | ✅ added | (none — needs ZH) |
| `headlineAccent` | ✅ added | (none) |
| `body` (rich text) | ✅ added | (none — needs ZH) |
| `advantages[].title` | ✅ added | (none) |
| `advantages[].description` | ✅ added | (none) |

### ServicesBlock

| Field | localized? | Legacy companion |
|---|---|---|
| `services[].title` | ✅ added | `chineseTitle` |
| `services[].chineseTitle` | KEEP (legacy) | — |
| `services[].description` | ✅ added | (none — needs ZH) |

### ClientsBlock

| Field | localized? | Note |
|---|---|---|
| `clients[].name` | NO | Brand names — never translated |

### PlatformTeaserBlock

| Field | localized? | Legacy companion |
|---|---|---|
| `headline` | ✅ added | (none) |
| `headlineAccent` | ✅ added | (none) |
| `body` (rich text) | ✅ added | (none) |
| `features[].title` | ✅ added | (none) |
| `features[].description` | ✅ added | (none) |

## Component fallback resolution

In each block component (`src/components/blocks/*.tsx`):

```tsx
'use client'
import { useLocale } from '@/lib/i18n/context'

export default function ExampleBlock({ headline, chineseHeadline /* legacy */ }) {
  const { locale } = useLocale()

  // Resolve display value with fallback chain:
  // 1. Use whatever Payload returned (already locale-aware on server query)
  // 2. If we're in ZH and the value is empty, fall back to the legacy companion field
  // 3. Else show what we have (Payload fallback: true already gives us EN if ZH missing)
  const display = (locale === 'zh' && !headline) ? chineseHeadline ?? '' : headline
}
```

## Future cleanup migration (deferred phase)

Once admin team has populated ZH for all base fields:

1. Write Payload migration in `src/payload/migrations/`:
   ```ts
   // For each page with empty headline.zh but populated chineseHeadline,
   // copy chineseHeadline value into headline.zh
   ```
2. Run migration via `npx payload migrate`
3. Remove fallback chain from components (just use Payload's value directly)
4. Remove `chinese*` field definitions from block schemas
5. Run another migration to drop the columns

This is **NOT in Phase 5** — it's a follow-up after the toggle is verified working in production.

## Validation post-migration

After Phase 5 ships:
- [ ] Admin UI shows locale switcher at top of page editor
- [ ] Switching to ZH in admin shows empty fields (no zh data yet) — admin can fill them
- [ ] Saving with ZH values populates the `zh` locale
- [ ] Site rendered with ZH cookie shows ZH values where filled, EN otherwise (Payload `fallback: true`)
- [ ] Existing pages still render correctly in EN (no regression)
- [ ] Companion `chinese*` fields still show in admin and continue to drive ZH where their localized counterpart is empty
