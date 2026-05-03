/**
 * Server-side i18n helpers — for layout/page server components.
 *
 * Use getServerLocale() inside any async server component / route handler
 * to read the user's locale preference from the cookie set by the client
 * I18nProvider. Pass the result into Payload queries to get locale-aware
 * CMS content.
 *
 * Server-only. Never import from client components.
 */

import { cookies } from 'next/headers'
import type { Locale } from './strings'

const COOKIE_KEY = 'pergroup-lang'
const DEFAULT_LOCALE: Locale = 'en'

/**
 * Resolve the user's locale on the server. Reads `pergroup-lang` cookie,
 * falls back to `'en'` if absent or invalid. Note: this does not look at
 * Accept-Language — that's a separate concern handled in API routes for
 * email language detection.
 */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(COOKIE_KEY)?.value
  if (value === 'en' || value === 'zh') return value
  return DEFAULT_LOCALE
}
