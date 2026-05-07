/**
 * Payload global: Footer Settings.
 * Single-locale rendering — pillarLine and mission both translatable.
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  label: t('Footer Settings', '页脚设置'),
  // Drafts on: editors get Save Draft + Publish; production renders the
  // published version, Live Preview iframe renders the draft.
  versions: { drafts: true },
  fields: [
    { name: 'tagline', type: 'text', localized: true, label: t('Tagline', '标语') },
    { name: 'mission', type: 'text', localized: true, label: t('Mission Statement', '使命宣言') },
    { name: 'pillarLine', type: 'text', localized: true, label: t('Brand Pillar Line', '品牌支柱标语'),
      admin: { description: t('Three pillars separated by dots. EN: "Tech Innovation · Business Empowerment · Human Care"', '三大支柱用·分隔。例：科技创新 · 商业赋能 · 人文关怀') } },
    { name: 'eHarborTag', type: 'text', localized: true, label: t('E-Harbor Tag', 'E-Harbor 标签') },
    { name: 'copyright', type: 'text', localized: true, label: t('Copyright Line', '版权信息') },
  ],
}
