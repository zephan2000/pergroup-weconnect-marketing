'use client'

/**
 * LanguageToggle — EN | 中文 button pair for the nav.
 * Active language highlighted in amber.
 *
 * After setting the locale, calls `router.refresh()` so server components
 * re-fetch CMS data in the new locale without a full page reload. Without
 * this, server-rendered Payload globals stay in the previous locale until
 * the next navigation.
 *
 * Used in:
 *   - Nav.tsx desktop navigation (next to WeConnect ✦)
 *   - Nav.tsx mobile hamburger menu (top item)
 */

import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/strings'

interface LanguageToggleProps {
  className?: string
  /** ARIA label for the wrapper. Comes from NavSettings global (CMS-editable). */
  ariaLabel?: string
}

export default function LanguageToggle({ className = '', ariaLabel = 'Switch language' }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale()
  const router = useRouter()

  const baseBtn = 'text-sm font-semibold transition-colors cursor-pointer bg-transparent border-none font-sora'
  const activeBtn = 'text-amber'
  const inactiveBtn = 'text-muted hover:text-pg-text'

  const switchTo = (next: Locale) => {
    if (next === locale) return
    setLocale(next)
    // Re-runs server components on the same route so layout.tsx refetches
    // Payload globals in the new locale (the cookie is read by getServerLocale).
    router.refresh()
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label={ariaLabel}>
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`${baseBtn} ${locale === 'en' ? activeBtn : inactiveBtn}`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="text-line text-sm">|</span>
      <button
        type="button"
        onClick={() => switchTo('zh')}
        className={`${baseBtn} ${locale === 'zh' ? activeBtn : inactiveBtn}`}
        aria-pressed={locale === 'zh'}
      >
        中文
      </button>
    </div>
  )
}
