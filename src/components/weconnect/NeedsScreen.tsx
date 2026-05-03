'use client'

/**
 * NeedsScreen — "Post a Need" + "Share an Offering" cards
 * with preview content below. Localized via i18n strings dictionary.
 *
 * NOTE: SpacesContent (search engine) is kept as a component but not rendered
 * on this page for v1. To re-enable, see comments below.
 */

import { useState } from 'react'
import { Zap, Package, TrendingUp } from 'lucide-react'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import PostRequirementModal from '@/components/weconnect/PostRequirementModal'
import DotMotif from '@/components/DotMotif'
import { useStrings, useLocale } from '@/lib/i18n/context'

// Sample preview data — locale-aware
const recentNeedsByLocale = {
  en: [
    {
      icon: Package,
      title: 'Alternative logistics supplier — Southeast Asia',
      tags: ['Logistics', 'Procurement'],
      time: '2d ago',
    },
    {
      icon: TrendingUp,
      title: 'FX hedging advisory for SGD/CNY exposure',
      tags: ['Finance', 'Risk'],
      time: '4d ago',
    },
  ],
  zh: [
    {
      icon: Package,
      title: '寻找东南亚替代物流供应商',
      tags: ['物流', '采购'],
      time: '2天前',
    },
    {
      icon: TrendingUp,
      title: '人民币对新元汇率对冲咨询',
      tags: ['金融', '风险'],
      time: '4天前',
    },
  ],
}

const previewAlertByLocale = {
  en: {
    badge: 'URGENT',
    title: 'Supply Chain Risk — Gulf Region',
    body: 'Oil prices exceeding $111/bbl and Gulf tensions may affect your logistics and energy cost exposure.',
  },
  zh: {
    badge: '紧急',
    title: '供应链风险预警 — 海湾地区',
    body: '原油价格超过111美元/桶，海湾地区紧张局势可能影响您的物流和能源成本敞口。',
  },
}

interface NeedsScreenProps {
  settings: PlatformSettingsData
  isActive: boolean
}

export default function NeedsScreen({ settings }: NeedsScreenProps) {
  const [showRequirementModal, setShowRequirementModal] = useState(false)
  const [showOfferingModal, setShowOfferingModal] = useState(false)
  const t = useStrings()
  const { locale } = useLocale()

  const recentNeeds = recentNeedsByLocale[locale]
  const previewAlert = previewAlertByLocale[locale]

  return (
    <div className="space-y-4 pb-4">
      {/* Dual CTAs — premium gradient cards with DotMotif */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowRequirementModal(true)}
          className="relative w-full rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-amber/20 cursor-pointer overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, hsl(33 100% 95%), hsl(36 80% 92%), hsl(40 33% 97%))' }}
        >
          <div className="absolute -top-2 -right-2 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <DotMotif className="w-28 h-28" opacity={1} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, hsla(36,90%,47%,0.2), hsla(20,75%,48%,0.1))' }}
            >
              <Zap className="w-5 h-5 text-amber" />
            </div>
            <div className="font-sora font-extrabold text-sm text-pg-text">
              {t.weconnect.postNeed}
            </div>
            <div className="text-[11px] text-muted mt-1.5 leading-relaxed">{t.weconnect.postNeedDescription}</div>
          </div>
        </button>

        <button
          onClick={() => setShowOfferingModal(true)}
          className="relative w-full rounded-xl p-5 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-deep-orange/15 cursor-pointer overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, hsl(33 100% 95%), hsl(20 60% 93%), hsl(40 33% 97%))' }}
        >
          <div className="absolute -top-2 -right-2 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
            <DotMotif className="w-28 h-28" opacity={1} />
          </div>
          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, hsla(20,75%,48%,0.2), hsla(140,35%,44%,0.1))' }}
            >
              <Package className="w-5 h-5 text-deep-orange" />
            </div>
            <div className="font-sora font-extrabold text-sm text-pg-text">
              {t.weconnect.shareOffering}
            </div>
            <div className="text-[11px] text-muted mt-1.5 leading-relaxed">{t.weconnect.shareOfferingDescription}</div>
          </div>
        </button>
      </div>

      {/* Intelligence Alert Preview */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="bg-bg-2 text-muted text-[10px] font-semibold px-3 py-1 rounded-full -translate-y-1/2">
            {t.weconnect.previewLabel}
          </span>
        </div>
        <div className="opacity-60 pointer-events-none select-none">
          <div className="glass-card rounded-xl p-5 relative overflow-hidden border-l-4 border-l-amber mt-2">
            <div className="absolute top-0 right-0">
              <DotMotif className="w-28 h-28" opacity={0.08} />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-alert-red/15 text-alert-red px-2.5 py-1 rounded-full mb-3">
                <Zap size={12} /> {previewAlert.badge}
              </span>
              <h3 className={`font-extrabold text-pg-text text-lg ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>
                {previewAlert.title}
              </h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">{previewAlert.body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Needs Preview */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="bg-bg-2 text-muted text-[10px] font-semibold px-3 py-1 rounded-full -translate-y-1/2">
            {t.weconnect.comingSoonLabel}
          </span>
        </div>
        <div className="opacity-60 pointer-events-none select-none space-y-3 mt-2">
          <p className="text-xs text-muted mb-2">{t.weconnect.recentNeeds}</p>
          {recentNeeds.map((r) => (
            <div key={r.title} className="glass-card rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber/15 flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-5 h-5 text-pg-text/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm text-pg-text leading-snug ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>{r.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    {r.tags.map((tag) => (
                      <span key={tag} className="bg-amber/10 text-deep-orange text-[10px] font-semibold px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                    <span className="text-[10px] text-muted ml-auto">{r.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*
       * Spaces browser — DISABLED for v1. Component preserved at
       * src/components/weconnect/SpacesContent.tsx for future re-enablement.
       */}

      {/* Modals */}
      <PostRequirementModal
        isOpen={showRequirementModal || showOfferingModal}
        onClose={() => { setShowRequirementModal(false); setShowOfferingModal(false) }}
        settings={settings}
      />
    </div>
  )
}
