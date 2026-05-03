'use client'

/**
 * ProfileScreen — stub user profile for v1 (no auth).
 * Locale-aware via i18n strings dictionary.
 */

import { Clock } from 'lucide-react'
import DotMotif from '@/components/DotMotif'
import { useStrings, useLocale } from '@/lib/i18n/context'

export default function ProfileScreen() {
  const t = useStrings()
  const { locale } = useLocale()

  const myPostsByLocale = {
    en: [
      { title: 'Alternative logistics supplier — SEA', time: '2d ago' },
      { title: 'FX hedging advisory', time: '4d ago' },
      { title: 'Legal counsel — SG entity', time: '1w ago' },
    ],
    zh: [
      { title: '寻找东南亚替代物流供应商', time: '2天前' },
      { title: '汇率对冲咨询', time: '4天前' },
      { title: '新加坡法律顾问', time: '1周前' },
    ],
  }

  const companyByLocale = {
    en: [
      { label: 'Industry', value: 'Technology' },
      { label: 'HQ', value: 'Singapore' },
      { label: 'Markets', value: 'SEA, Greater China' },
    ],
    zh: [
      { label: '行业', value: '科技' },
      { label: '总部', value: '新加坡' },
      { label: '市场', value: '东南亚、大中华' },
    ],
  }

  const myPosts = myPostsByLocale[locale]
  const companyFields = companyByLocale[locale]

  return (
    <div className="space-y-4 pb-4">
      {/* Profile Card */}
      <div className="glass-card rounded-xl p-5 relative overflow-hidden border-l-4 border-l-amber">
        <div className="absolute top-0 right-0">
          <DotMotif className="w-24 h-24" opacity={0.08} />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center font-sora font-extrabold text-pg-text text-lg">
            PG
          </div>
          <div>
            <h3 className={`font-bold text-pg-text text-lg ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>
              {t.weconnect.enterpriseUser}
            </h3>
            <p className="text-muted text-sm">{t.weconnect.profileMember}</p>
            <p className="text-muted text-xs mt-1">{t.weconnect.profileMemberSince}</p>
          </div>
        </div>
      </div>

      {/* My Posts */}
      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>
          {t.weconnect.myPosts}
        </h4>
        {myPosts.map((r) => (
          <div key={r.title} className="glass-card rounded-xl p-3 mb-2 flex items-center justify-between">
            <div>
              <div className={`text-sm font-semibold text-pg-text ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>
                {r.title}
              </div>
            </div>
            <span className="text-[10px] text-muted">{r.time}</span>
          </div>
        ))}
      </div>

      {/* Company Profile */}
      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>
          {t.weconnect.companyProfile}
        </h4>
        <div className="glass-card rounded-xl p-4 space-y-3">
          {companyFields.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className={`text-xs text-muted ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>{item.label}</span>
              <span className={`bg-amber/10 text-deep-orange text-xs font-semibold px-2 py-0.5 rounded-md ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>
                {item.value}
              </span>
            </div>
          ))}
          <button className="text-amber text-xs font-semibold hover:underline mt-2 bg-transparent border-none cursor-pointer">
            {locale === 'zh' ? '更新档案 → 联系 PER GROUP' : 'Update profile → talk to PER GROUP'}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>
          {t.weconnect.settingsHeading}
        </h4>
        <div className="glass-card rounded-xl divide-y divide-line">
          {[
            { label: t.weconnect.settingLanguage, extra: 'EN | 中文' },
            { label: t.weconnect.settingNotifications, comingSoon: true },
            { label: t.weconnect.settingContactPg },
            { label: t.weconnect.settingAbout },
          ].map((s) => (
            <div key={s.label} className="p-3 flex items-center justify-between">
              <span className={`text-sm text-pg-text ${locale === 'zh' ? 'font-noto-sans-sc' : ''}`}>{s.label}</span>
              {s.comingSoon ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                  <Clock size={10} /> {t.weconnect.comingSoonLabel}
                </span>
              ) : s.extra ? (
                <span className="text-xs font-semibold text-amber">{s.extra}</span>
              ) : (
                <span className="text-muted">›</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
