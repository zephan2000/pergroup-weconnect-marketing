/**
 * Tiny EN/ZH dictionary. As of Phase 5b.3d, all rendered UI strings live in
 * Payload globals (NavSettings, FooterSettings, WeConnectSettings,
 * RequirementFormSettings, ContactFormSettings) and on individual blocks.
 *
 * The only thing that remains here is the language-toggle button label
 * itself — `EN` / `中文` are constants by design (each button shows the
 * other language's name regardless of current locale, so they're not
 * locale-dependent).
 *
 * Locale type is exported for typing server-side fetches and props
 * throughout the app.
 */

export const strings = {
  en: {
    languageToggle: {
      en: 'EN',
      zh: '中文',
      ariaLabel: 'Switch language',
    },
  },
  zh: {
    languageToggle: {
      en: 'EN',
      zh: '中文',
      ariaLabel: '切换语言',
    },
  },
} as const

export type Locale = keyof typeof strings
export type Strings = typeof strings.en
