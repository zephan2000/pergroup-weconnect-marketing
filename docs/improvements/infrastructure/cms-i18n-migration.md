# CMS i18n Migration

Inventory of every Payload CMS field used in the marketing site, and which currently lack a Chinese companion field needed for full ZH-mode rendering.

## Already bilingual (no migration needed)

These blocks already have separate English and Chinese fields. The toggle simply picks the right one:

| Block | English field | Chinese field |
|---|---|---|
| HeroBlock | `eyebrow`, `headline`, `headlineAccent`, `headlineFaint` | `chineseSubtitle` |
| StatsBlock (each stat) | `label` | `chineseLabel` |
| ValuesBlock | `headline`, item `english` | `chineseHeadline`, item `chinese` |
| ServicesBlock (each service) | `title` | `chineseTitle` |
| PlatformTeaserBlock | `headline`, `headlineAccent` | (none — see below) |

## Gap list — Chinese fields needed

These English-only fields render as English even in ZH mode (via fallback). To achieve full Chinese site, the Payload schema should add a Chinese companion field:

### HeroBlock
- `eyebrow` ← needs `eyebrowChinese`? Or include in `chineseSubtitle`?
  - Recommendation: extend `chineseSubtitle` to cover both; or add `chineseEyebrow`
- `headline`, `headlineAccent`, `headlineFaint` — currently the Chinese is on a single `chineseSubtitle` line. Acceptable for v1 (the headline is typographically prominent in EN; a brief Chinese subtitle suffices in EN-mode).
  - Under ZH-mode: hide the EN headline lines and show only the Chinese? Or render `chineseSubtitle` AS the headline?
  - **TEAM_REVIEW item:** how should the hero behave under ZH locale?

### AboutBlock
- `body` (rich text) — English only
- Each `advantage`'s `title` and `description` — English only
- `globeStat.label` — English only

**Migration:** add `body_zh`, `advantage.title_zh`, `advantage.description_zh`, `globeStat.label_zh` to `src/payload/blocks/AboutBlock.ts`.

### ServicesBlock
- Each service's `description` — English only

**Migration:** add `description_zh` to service items.

### PlatformTeaserBlock
- `body` (rich text) — English only
- Each feature's `title` and `description` — English only

**Migration:** add `body_zh`, `feature.title_zh`, `feature.description_zh`.

### Hardcoded in components (not CMS) — handled by code dictionary

These don't need CMS changes — they'll move to `src/lib/i18n/strings.ts` instead:

- AboutBlock `milestones[]` — currently a hardcoded array in the component, both EN/CN are present. Will be split into `{ en, zh }` per-milestone.
- ClientsBlock `partnerTypes[]`, `regions[]` — hardcoded. Will be split same way.
- WeConnect screen content (NeedsScreen sample needs, AlertsScreen sample alerts, ProfileScreen company info) — all hardcoded. Will be split.

## Migration phases

**Phase 5 (this implementation):**
- Code-side: render Chinese from existing CMS Chinese fields where they exist
- Where missing: render English fallback under ZH locale (visible imperfection, documented to user)
- Hardcoded EN+CN in components: split into `{ en, zh }` and use `useLocale()`

**Post-launch (deferred):**
- Run a Payload migration that adds the missing `*_zh` fields to AboutBlock, ServicesBlock, PlatformTeaserBlock
- CMS admin populates the new fields
- Once filled, the fallback automatically resolves to the new Chinese version (no further code change needed)

## Schema changes (when ready to migrate)

In each Payload block file, alongside `body` add:
```ts
{
  name: 'body_zh',
  type: 'richText',
  label: 'Body (Chinese / 中文)',
  admin: { description: 'Translated content for Chinese mode. If empty, English will be shown as fallback.' },
}
```

Same pattern for sub-array items (e.g., `description_zh` on each service).

After the schema migration:
- Run `npx payload migrate:create`
- Push the migration; existing rows have empty `body_zh` → fallback to English (no breakage)
- CMS team fills in translations gradually

## Validation checklist post-migration

- [ ] CMS admin can edit `body_zh` field in Payload UI
- [ ] Empty `body_zh` → ZH locale shows English (current behavior continues)
- [ ] Filled `body_zh` → ZH locale shows Chinese content
- [ ] EN locale always shows `body` (English) regardless of `body_zh` state
- [ ] Saving and publishing a translation updates the live site
