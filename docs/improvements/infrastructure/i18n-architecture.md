# i18n Architecture

How the EN/CN toggle works end-to-end.

## Mental model

```
┌──────────────────────────────────────────────┐
│ Browser                                      │
│                                              │
│  navigator.language ──┐                      │
│                        ▼                      │
│  localStorage['pergroup-lang'] ──┐            │
│                                   ▼            │
│              ┌────────────────────────┐       │
│              │  I18nProvider (client) │       │
│              │   locale: 'en' | 'zh'  │       │
│              └─────┬──────────────────┘       │
│                    │                          │
│      ┌─────────────┼─────────────┐            │
│      │             │             │            │
│      ▼             ▼             ▼            │
│  useLocale()  useStrings()  <LanguageToggle>  │
│  (raw enum)   (dictionary)   (UI button)      │
│                                              │
└──────────────────────────────────────────────┘

  Components consume locale and conditionally render:
   • UI strings → from strings dictionary by key
   • CMS data  → pick englishField vs chineseField
   • Decorative chars → unchanged regardless of locale

┌──────────────────────────────────────────────┐
│ Server (API routes)                          │
│                                              │
│  Request includes:                           │
│    • Accept-Language header (always)         │
│    • body.lang (when forms submit, post-Ph5) │
│                                              │
│  detectLocale(headers, override) → 'en'|'zh' │
│  used for ack emails & sheet logging         │
└──────────────────────────────────────────────┘
```

## Files

| File | Role |
|---|---|
| `src/lib/i18n/context.tsx` | `<I18nProvider>` + `useLocale()` + `useStrings()` hooks |
| `src/lib/i18n/strings.ts` | Dictionary: `{ en: {...}, zh: {...} }` |
| `src/components/LanguageToggle.tsx` | Toggle UI button |
| `src/lib/weconnect/email.ts` | `detectLocale()` helper for server-side |

## Locale resolution (client)

1. **First visit** (no localStorage entry):
   ```ts
   const initial = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
   localStorage.setItem('pergroup-lang', initial)
   ```
2. **Subsequent visits**: read `localStorage['pergroup-lang']`
3. **User toggles**: write the new value to localStorage; provider state updates; React re-renders

## Locale resolution (server)

```ts
detectLocale(
  request.headers.get('accept-language'),
  body.lang  // optional override from form payload (Phase 5+)
)
```

- If `body.lang` is `'en'` or `'zh'`, use it
- Else if `Accept-Language` header starts with `'zh'`, use `'zh'`
- Else default to `'en'`

## Hydration strategy (v1)

- Server-side renders with locale unset (defaults to `'en'`)
- On mount, `useEffect` reads localStorage and updates state
- Brief FOUC possible if user's preference is ZH on first paint (~50ms)

**Acceptable for v1**, but tracked in TEAM_REVIEW for follow-up to a middleware/cookie-based approach for SSR-correct rendering.

## Strings dictionary structure

```ts
// src/lib/i18n/strings.ts
export const strings = {
  en: {
    nav: {
      philosophy: 'Philosophy',
      about: 'About',
      services: 'Services',
      partners: 'Partners',
      weconnect: 'WeConnect',
      weconnectCta: 'WECONNECT PLATFORM →',
    },
    hero: {
      eyebrow: 'Global Tech Innovation Ecosystem',
      // ...
    },
    forms: {
      requirementHeading: 'Post a Requirement',
      requirementDescription: 'Tell the WeConnect network what you need',
      sectionBasic: 'Basic Information',
      sectionRequirement: 'Requirement Details',
      sectionCommercial: 'Commercial Parameters',
      sectionContact: 'Contact Information',
      labelSubject: 'Subject',
      labelInquiryType: 'Inquiry Type',
      // ...
      buttonSubmit: 'Submit Requirement',
      requiredHint: 'Required fields are marked with',
      // ...
    },
    footer: {
      tagline: 'A globalized tech innovation ecosystem.',
      // ...
    },
  },
  zh: {
    nav: {
      philosophy: '理念',
      about: '关于我们',
      services: '服务',
      partners: '合作伙伴',
      weconnect: 'WeConnect 平台',
      weconnectCta: 'WECONNECT 平台 →',
    },
    hero: {
      eyebrow: '全球科技创新生态平台',
      // ...
    },
    forms: {
      requirementHeading: '发布需求',
      // ...
    },
    // ...
  },
} as const

export type Locale = keyof typeof strings
```

The hook:
```ts
export function useStrings() {
  const { locale } = useLocale()
  return strings[locale]
}
```

## CMS content rendering pattern

When a CMS field has a Chinese companion (e.g., HeroBlock has `chineseSubtitle`):

```tsx
const { locale } = useLocale()
const subtitle = locale === 'zh' && hero.chineseSubtitle
  ? hero.chineseSubtitle
  : hero.subtitle  // English fallback if Chinese is missing
```

Fallback to English in ZH mode if the Chinese field is empty — this avoids breaking the layout when CMS hasn't been fully populated. Logged in `cms-i18n-migration.md`.

## What does NOT change with locale

- Decorative single Chinese characters: `心 家 社 世`, `易 医 爱 艺 义`, `和`, `爱` central glyphs in ValuesBlock visualizations
- Brand name: `PER GROUP` and `E-Harbor` — kept in original form
- The "by E-Harbor" tagline (`e创码头`) — kept in ZH mode, removed in EN mode (since it's only meaningful in Chinese branding context)
- Email addresses, phone numbers, URLs

## Open question (in TEAM_REVIEW)

For SEO and proper SSR, we should eventually move locale into a URL segment (`/en/...` and `/zh/...`) or use Next.js's built-in i18n routing. For v1, localStorage + client-side toggle is acceptable.
