'use client'

/**
 * I18n provider — site-wide locale state for EN/CN toggle.
 *
 * Resolution:
 *   1. First visit (no localStorage entry): detect from navigator.language.
 *      If it starts with 'zh', use 'zh'; else 'en'. Persist to localStorage.
 *   2. Subsequent visits: read localStorage['pergroup-lang'].
 *   3. User toggle: setLocale() updates state + localStorage.
 *
 * Hydration note: server renders with default 'en'. Client effect runs once
 * on mount to read localStorage and update state. Brief FOUC possible if user
 * preference is 'zh'. See docs/improvements/infrastructure/i18n-architecture.md.
 *
 * Usage:
 *   const { locale, setLocale } = useLocale()
 *   const t = useStrings()  // returns the dictionary slice for current locale
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { strings, type Locale } from './strings'

const STORAGE_KEY = 'pergroup-lang'
const DEFAULT_LOCALE: Locale = 'en'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // First-mount: resolve initial locale from localStorage or navigator.language
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'en' || stored === 'zh') {
        setLocaleState(stored)
        return
      }
      // Detect from browser language on first visit
      const detected: Locale = window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
      setLocaleState(detected)
      window.localStorage.setItem(STORAGE_KEY, detected)
    } catch {
      // localStorage unavailable (private mode, etc.) — stay with default
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, newLocale)
      }
    } catch {
      // ignore localStorage failures
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
    // Defensive default — allows components to render without provider in tests
    return { locale: DEFAULT_LOCALE, setLocale: () => {} }
  }
  return ctx
}

/** Returns the dictionary slice for the current locale. */
export function useStrings() {
  const { locale } = useLocale()
  return strings[locale]
}
