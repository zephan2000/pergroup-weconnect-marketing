'use client'

/**
 * ProfileScreen — stub user profile for v1 (no auth).
 *
 * Headings/labels come from WeConnectSettings global. Sample post + company
 * data stays hardcoded (mock content). The "update profile → talk to PER
 * GROUP" CTA is locale-aware in code; flagged for 5b.4 if owner wants it
 * editable.
 */

import { Clock } from 'lucide-react'
import DotMotif from '@/components/DotMotif'
import type { WeConnectSettingsData } from '@/lib/cms/site-text'
import type { Locale } from '@/lib/i18n/strings'

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

const updateProfileCtaByLocale: Record<Locale, string> = {
  en: 'Update profile → talk to PER GROUP',
  zh: '更新档案 → 联系 PER GROUP',
}

interface ProfileScreenProps {
  weconnect: WeConnectSettingsData
  locale: Locale
}

export default function ProfileScreen({ weconnect, locale }: ProfileScreenProps) {
  const myPosts = myPostsByLocale[locale]
  const companyFields = companyByLocale[locale]
  const titleFont = locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'
  const cnFont = locale === 'zh' ? 'font-noto-sans-sc' : ''

  return (
    <div className="space-y-4 pb-4">
      <div className="glass-card rounded-xl p-5 relative overflow-hidden border-l-4 border-l-amber">
        <div className="absolute top-0 right-0">
          <DotMotif className="w-24 h-24" opacity={0.08} />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center font-sora font-extrabold text-pg-text text-lg">
            PG
          </div>
          <div>
            <h3 className={`font-bold text-pg-text text-lg ${cnFont}`}>{weconnect.enterpriseUser}</h3>
            <p className="text-muted text-sm">{weconnect.profileMember}</p>
            <p className="text-muted text-xs mt-1">{weconnect.profileMemberSince}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${titleFont}`}>{weconnect.myPosts}</h4>
        {myPosts.map((r) => (
          <div key={r.title} className="glass-card rounded-xl p-3 mb-2 flex items-center justify-between">
            <div>
              <div className={`text-sm font-semibold text-pg-text ${cnFont}`}>{r.title}</div>
            </div>
            <span className="text-[10px] text-muted">{r.time}</span>
          </div>
        ))}
      </div>

      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${titleFont}`}>{weconnect.companyProfile}</h4>
        <div className="glass-card rounded-xl p-4 space-y-3">
          {companyFields.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className={`text-xs text-muted ${cnFont}`}>{item.label}</span>
              <span className={`bg-amber/10 text-deep-orange text-xs font-semibold px-2 py-0.5 rounded-md ${cnFont}`}>
                {item.value}
              </span>
            </div>
          ))}
          <button className={`text-amber text-xs font-semibold hover:underline mt-2 bg-transparent border-none cursor-pointer ${cnFont}`}>
            {updateProfileCtaByLocale[locale]}
          </button>
        </div>
      </div>

      <div>
        <h4 className={`font-bold text-sm text-pg-text mb-2 ${titleFont}`}>{weconnect.settingsHeading}</h4>
        <div className="glass-card rounded-xl divide-y divide-line">
          {[
            { label: weconnect.settingLanguage, extra: 'EN | 中文' },
            { label: weconnect.settingNotifications, comingSoon: true },
            { label: weconnect.settingContactPg },
            { label: weconnect.settingAbout },
          ].map((s) => (
            <div key={s.label} className="p-3 flex items-center justify-between">
              <span className={`text-sm text-pg-text ${cnFont}`}>{s.label}</span>
              {s.comingSoon ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                  <Clock size={10} /> {weconnect.comingSoonLabel}
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
