# i18n Architecture (locked 2026-05-03)

How the EN/CN toggle works end-to-end across UI, CMS, server, and client.

## TL;DR — two-layer system

| Layer | Source | Mechanism |
|---|---|---|
| **UI labels** (nav, buttons, form labels, section titles) | Code: `src/lib/i18n/strings.ts` | `useStrings()` hook returns dictionary slice for current locale |
| **CMS content** (page text edited by admins in Payload) | Payload, with `localized: true` field option | `payload.find({ locale })` returns the right value automatically |

**Not used:** next-intl, react-i18next, or any third-party i18n framework. Payload v3 has first-class localization; combining it with our own dictionary covers everything cleanly.

## Locale resolution

```
┌──────────────────────────────────────────────────────────────────┐
│                  CLIENT (I18nProvider)                           │
│                                                                  │
│  Resolution order on mount:                                      │
│   1. cookie['pergroup-lang']    (set by toggle, read by SSR)    │
│   2. localStorage['pergroup-lang']  (legacy, kept for parity)    │
│   3. navigator.language         (first-time visit detection)     │
│   4. default 'en'                                                │
│                                                                  │
│  setLocale(): writes to BOTH cookie + localStorage               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                  SERVER (marketing layout, API routes)           │
│                                                                  │
│  Read cookies().get('pergroup-lang') from next/headers           │
│  Pass to:                                                        │
│   - payload.find({ locale }) for CMS content                     │
│   - <html lang> attribute (a11y/SEO)                             │
│   - Pass to client provider via prop OR re-detect on hydration   │
└──────────────────────────────────────────────────────────────────┘
```

## Cookie/localStorage write convention

When `setLocale('zh')` runs:

```ts
// 1. Update React state
setLocaleState('zh')

// 2. Write to localStorage (immediate, no roundtrip)
localStorage.setItem('pergroup-lang', 'zh')

// 3. Write cookie so server-side renders are correct on next navigation
document.cookie = `pergroup-lang=zh; path=/; max-age=${60*60*24*365}; SameSite=Lax`
```

The cookie is read on subsequent requests (server components, API routes). LocalStorage is the same value; kept for client-only quick reads.

## Payload v3 localization config

In `payload.config.ts`:

```ts
export default buildConfig({
  // ...
  localization: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    fallback: true,        // if zh value is empty, return en
  },
  // ...
})
```

In each block schema, mark text fields as `localized: true`:

```ts
// src/payload/blocks/HeroBlock.ts
{
  name: 'headline',
  type: 'text',
  localized: true,  // ← added
}
```

**No new tables created** — Payload + Postgres adapter handles locale columns/JSON internally. Existing data sits in the `en` locale automatically (default locale).

## Migration path for existing CMS data

**The transitional approach (current implementation):**

- Add `localized: true` to base fields (`headline`, `label`, `title`, `description`, etc.)
- **Keep** companion `chinese*` fields (`chineseHeadline`, `chineseLabel`, `chineseTitle`) as legacy fallbacks
- Components use this resolution order:
  1. Localized field's value at current locale (e.g., `headline` queried with `locale: 'zh'`)
  2. If empty AND locale is `zh`, fall back to companion `chinese*` field (legacy data)
  3. If still empty, fall back to English value (Payload's `fallback: true`)

This means:
- Existing CMS data with `chineseHeadline` populated continues to work in ZH mode
- New translations added via the locale switcher in admin UI take precedence
- No data loss; no forced migration of admin work

**Future cleanup (deferred to a follow-up phase):**

Once the admin team has populated the `zh` locale for all base fields:
1. Run a one-time data migration: copy each `chinese*` value → base field's `zh` locale value (only where base zh is empty)
2. Remove the `chinese*` companion field definitions from block schemas
3. Remove the fallback in component code

This is documented in [`cms-i18n-migration.md`](./cms-i18n-migration.md).

## Strings dictionary structure

```ts
// src/lib/i18n/strings.ts
export const strings = {
  en: { nav: {...}, forms: {...}, footer: {...}, weconnect: {...} },
  zh: { nav: {...}, forms: {...}, footer: {...}, weconnect: {...} },
} as const

export type Locale = keyof typeof strings
```

The `useStrings()` hook returns `strings[locale]` for the current locale.

## CMS content rendering pattern (component code)

```tsx
'use client'
import { useLocale } from '@/lib/i18n/context'

export default function HeroBlock(props) {
  const { locale } = useLocale()

  // Pattern A: pure localized field (post-migration)
  // After admins populate ZH, just use props.headline — Payload returns the right value
  // because the parent server component queried with `locale`.
  const headline = props.headline

  // Pattern B: transitional fallback to legacy chinese* field
  // Use this for fields where the legacy companion has data but the new localized
  // value isn't filled yet.
  const subtitle = locale === 'zh'
    ? (props.subtitle || props.chineseSubtitle || '')   // try localized, then legacy
    : props.subtitle
}
```

## Decorative content rules

These are **NOT translated** regardless of locale:
- Single brand calligraphy characters: `心 家 社 世`, `易 医 爱 艺 义`, `和`, `爱`
- Brand names: `PER GROUP`, `E-Harbor`
- Email addresses, URLs, phone numbers

These are part of brand identity, not translatable text. Render as-is in both locales.

## Form payload `lang` field

When a form submits to `/api/contact`, `/api/requirement`, etc., the body now includes `lang`:

```ts
fetch('/api/contact', {
  body: JSON.stringify({ ...formData, lang: locale }),
})
```

The server reads it via `body.lang` to override `Accept-Language` for the user acknowledgement email (Phase 4). This ensures the user receives the ack in the language they were viewing the site in.

## Hydration and FOUC strategy

Server reads cookie → renders marketing layout with the correct `<html lang>` and Payload data already in correct locale. Client provider initializes from the SAME cookie → no flicker.

If the user has no cookie (first visit):
- Server defaults to `en`
- Client `useEffect` reads `navigator.language`, sets cookie, may briefly flash to `zh` if user's browser is Chinese — acceptable v1 trade-off
- Once cookie is set, all subsequent navigations are SSR-correct

## What's NOT in scope for v1

- Locale-segmented URLs (e.g., `/en/about`, `/zh/about`) — Next.js i18n routing not configured
- Search engine multi-locale sitemaps
- Per-route locale fallbacks (everything uses cookie)

These are tracked in TEAM_REVIEW for post-launch consideration.
