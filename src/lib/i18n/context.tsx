'use client'

/**
 * I18n provider — site-wide locale state for EN/CN toggle.
 *
 * Resolution order on mount (each falls through if previous unset):
 *   1. cookie['pergroup-lang']     (set by toggle, also read by server-side)
 *   2. localStorage['pergroup-lang']  (parity with older sessions)
 *   3. navigator.language          (first-time visit auto-detection)
 *   4. default 'en'
 *
 * setLocale() writes BOTH a cookie (so SSR renders correctly on next nav) AND
 * localStorage (immediate client cache). The cookie is the source of truth for
 * server components.
 *
 * The provider accepts an optional `initialLocale` prop — passed by the server
 * marketing layout after reading the cookie, so client renders match server
 * renders without flicker.
 *
 * See docs/improvements/infrastructure/i18n-architecture.md for the full design.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { strings, type Locale } from './strings'

const COOKIE_KEY = 'pergroup-lang'
const STORAGE_KEY = 'pergroup-lang'
const DEFAULT_LOCALE: Locale = 'en'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 // 1 year

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: React.ReactNode
  /** Server-resolved locale (from cookie). Lets initial render match what server rendered. */
  initialLocale?: Locale
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE)

  // First-mount: if we don't have an explicit initialLocale from the server,
  // try cookie / localStorage / navigator detection.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initialLocale) return // server already resolved it; trust that

    const fromCookie = readCookie(COOKIE_KEY)
    if (fromCookie === 'en' || fromCookie === 'zh') {
      setLocaleState(fromCookie)
      return
    }

    try {
      const fromStorage = window.localStorage.getItem(STORAGE_KEY)
      if (fromStorage === 'en' || fromStorage === 'zh') {
        setLocaleState(fromStorage)
        // Backfill cookie so server-side picks up the choice on next request
        writeCookie(COOKIE_KEY, fromStorage)
        return
      }
    } catch {
      // localStorage may be unavailable in private mode — ignore
    }

    const detected: Locale = window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
    setLocaleState(detected)
    writeCookie(COOKIE_KEY, detected)
    try {
      window.localStorage.setItem(STORAGE_KEY, detected)
    } catch {
      /* ignore */
    }
  }, [initialLocale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    writeCookie(COOKIE_KEY, newLocale)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, newLocale)
      }
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useLocale(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return { locale: DEFAULT_LOCALE, setLocale: () => {} }
  }
  return ctx
}

/** Returns the dictionary slice for the current locale. */
export function useStrings() {
  const { locale } = useLocale()
  return strings[locale]
}

// ── Cookie helpers (client-only) ─────────────────────────────────────────────

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.substring(name.length + 1)) : null
}

function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}
