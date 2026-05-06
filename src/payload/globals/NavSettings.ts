/**
 * Payload global: Nav Settings.
 * Single-locale labels for the marketing site nav (desktop + mobile hamburger).
 * All fields localized — switch to ZH locale in admin to edit Chinese values.
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const NavSettings: GlobalConfig = {
  slug: 'nav-settings',
  label: t('Nav Settings', '导航设置'),
  fields: [
    { name: 'linkPhilosophy', type: 'text', localized: true, label: t('Link: Philosophy', '链接：理念') },
    { name: 'linkAbout', type: 'text', localized: true, label: t('Link: About', '链接：关于我们') },
    { name: 'linkServices', type: 'text', localized: true, label: t('Link: Services', '链接：服务') },
    { name: 'linkPartners', type: 'text', localized: true, label: t('Link: Partners', '链接：合作伙伴') },
    { name: 'weconnectLabel', type: 'text', localized: true, label: t('WeConnect Label', 'WeConnect 标签') },
    { name: 'weconnectCta', type: 'text', localized: true, label: t('WeConnect CTA', 'WeConnect 按钮文字') },
    { name: 'languageToggleAria', type: 'text', localized: true, label: t('Language Toggle ARIA Label', '语言切换 ARIA 标签') },
  ],
}
