'use client'

/**
 * LanguageToggle — compact header button that switches between English and Chinese.
 * Rendered via admin.components.actions in payload.config.ts (top-right header area).
 */

import { useState } from 'react'
import { useTranslation } from '@payloadcms/ui'

export default function LanguageToggle() {
  const { i18n, switchLanguage } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [switching, setSwitching] = useState(false)

  const handleClick = async () => {
    setSwitching(true)
    await switchLanguage?.(isZh ? 'en' : 'zh')
    setSwitching(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={switching}
      type="button"
      title={isZh ? 'Switch to English' : '切换到中文'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '6px 10px',
        background: 'none',
        border: 'none',
        borderRadius: 4,
        color: 'var(--theme-elevation-800, #ccc)',
        fontSize: 13,
        fontWeight: 600,
        cursor: switching ? 'wait' : 'pointer',
        fontFamily: 'inherit',
        letterSpacing: 0.5,
        opacity: switching ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <span style={{ fontSize: 15 }}>🌐</span>
      {switching
        ? (isZh ? 'Switching…' : '切换中…')
        : (isZh ? 'EN' : '中文')
      }
    </button>
  )
}
