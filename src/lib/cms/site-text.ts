/**
 * Types + default fallbacks for the site-wide CMS globals consumed by Nav,
 * Footer, and (eventually) WeConnect overlay + form modals.
 *
 * Pattern mirrors src/lib/weconnect/platform-settings.ts:
 *   - Type defines the localized fields the component reads.
 *   - DEFAULT_* provides last-resort fallback values if Payload is unreachable.
 *   - The marketing layout fetches the global with `payload.findGlobal({ slug, locale })`
 *     and passes a typed object down as props.
 */

export interface NavSettingsData {
  linkPhilosophy: string
  linkAbout: string
  linkServices: string
  linkPartners: string
  weconnectLabel: string
  weconnectCta: string
  languageToggleAria: string
}

export const DEFAULT_NAV_SETTINGS: NavSettingsData = {
  linkPhilosophy: 'Philosophy',
  linkAbout: 'About',
  linkServices: 'Services',
  linkPartners: 'Partners',
  weconnectLabel: 'WeConnect ✦',
  weconnectCta: 'WECONNECT PLATFORM →',
  languageToggleAria: 'Switch language',
}

export interface FooterSettingsData {
  tagline: string
  mission: string
  pillarLine: string
  eHarborTag: string
  copyright: string
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsData = {
  tagline: 'A globalized tech innovation ecosystem.',
  mission: 'Making innovation open to anyone, anywhere.',
  pillarLine: 'Tech Innovation · Business Empowerment · Human Care',
  eHarborTag: 'by E-Harbor',
  copyright: '© 2026 E-Harbor / PER GROUP · Singapore',
}
