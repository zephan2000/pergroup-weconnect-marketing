'use client'

/**
 * LanguageToggle — EN | 中文 button pair for the nav.
 * Active language highlighted in amber.
 *
 * Used in:
 *   - Nav.tsx desktop navigation (next to WeConnect ✦)
 *   - Nav.tsx mobile hamburger menu (top item)
 */

import { useLocale } from '@/lib/i18n/context'

interface LanguageToggleProps {
  className?: string
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale()

  const baseBtn = 'text-sm font-semibold transition-colors cursor-pointer bg-transparent border-none font-sora'
  const activeBtn = 'text-amber'
  const inactiveBtn = 'text-muted hover:text-pg-text'

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label="Switch language">
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`${baseBtn} ${locale === 'en' ? activeBtn : inactiveBtn}`}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="text-line text-sm">|</span>
      <button
        type="button"
        onClick={() => setLocale('zh')}
        className={`${baseBtn} ${locale === 'zh' ? activeBtn : inactiveBtn} font-noto-sans-sc`}
        aria-pressed={locale === 'zh'}
      >
        中文
      </button>
    </div>
  )
}
