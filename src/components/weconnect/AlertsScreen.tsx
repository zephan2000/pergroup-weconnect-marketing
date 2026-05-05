'use client'

/**
 * AlertsScreen — Advisory alerts with severity levels.
 * v1: preview/coming-soon state with sample alerts. Locale-aware content.
 */

import { Zap, Eye, Info, Clock } from 'lucide-react'
import { useLocale, useStrings } from '@/lib/i18n/context'

const alertsByLocale = {
  en: [
    {
      severity: 'urgent' as const,
      pillIcon: Zap,
      pillLabel: 'Urgent',
      tag: 'Supply Chain',
      time: '2h ago',
      title: 'Gulf Crisis: Oil at $111 — Review Your Logistics Exposure',
      body: 'Escalating Gulf tensions push Brent crude above $111. Companies with Southeast Asian supply chains face rising cost risk.',
    },
    {
      severity: 'monitor' as const,
      pillIcon: Eye,
      pillLabel: 'Monitor',
      tag: 'Regulatory',
      time: '1d ago',
      title: 'MAS Tightens AML Rules for Cross-Border Transactions',
      body: 'New AML reporting requirements effective Q3. Chinese companies with Singapore entities should review compliance posture.',
    },
    {
      severity: 'info' as const,
      pillIcon: Info,
      pillLabel: 'Info',
      tag: 'Market Access',
      time: '3d ago',
      title: 'EU Carbon Border Tax: Implications for Chinese Exporters',
      body: 'CBAM takes effect for key sectors. PER GROUP has vetted carbon advisory partners if you need readiness support.',
    },
  ],
  zh: [
    {
      severity: 'urgent' as const,
      pillIcon: Zap,
      pillLabel: '紧急',
      tag: '供应链',
      time: '2小时前',
      title: '海湾危机：油价破111美元 — 审查物流敞口',
      body: '海湾局势升级推动布伦特原油突破111美元。在东南亚有供应链的企业面临成本上升风险。',
    },
    {
      severity: 'monitor' as const,
      pillIcon: Eye,
      pillLabel: '关注',
      tag: '监管',
      time: '1天前',
      title: '新加坡金管局收紧跨境交易反洗钱规定',
      body: '新的反洗钱报告要求将于第三季度生效。在新加坡设有实体的中国企业应检查合规情况。',
    },
    {
      severity: 'info' as const,
      pillIcon: Info,
      pillLabel: '资讯',
      tag: '市场准入',
      time: '3天前',
      title: '欧盟碳边境税：对中国出口商的影响',
      body: '碳边境调节机制对关键行业生效。PER GROUP 有认证的碳咨询合作伙伴如您需要支持。',
    },
  ],
}

const severityClass = {
  urgent: { border: 'border-l-alert-red', bg: 'bg-alert-red/15 text-alert-red' },
  monitor: { border: 'border-l-amber', bg: 'bg-amber/15 text-amber' },
  info: { border: 'border-l-muted', bg: 'bg-faint text-muted' },
} as const

export default function AlertsScreen() {
  const t = useStrings()
  const { locale } = useLocale()
  const alerts = alertsByLocale[locale]

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h3 className={`font-bold text-pg-text ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>
          {t.weconnect.advisoryAlerts}
        </h3>
      </div>

      <div className="glass-card rounded-xl p-4 flex items-center gap-3 border-l-4 border-l-amber">
        <Clock className="w-5 h-5 text-amber flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-pg-text">{t.weconnect.comingSoonLabel}</p>
          <p className="text-xs text-muted">
            {locale === 'zh'
              ? '基于您的业务档案的个性化预警将在未来版本中推出。'
              : 'Personalised alerts based on your business profile will be available in a future update.'}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted">{t.weconnect.previewLabel}</p>

      {alerts.map((a) => {
        const cls = severityClass[a.severity]
        const Icon = a.pillIcon
        return (
          <div
            key={a.title}
            className={`glass-card rounded-xl overflow-hidden border-l-4 ${cls.border} opacity-60`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls.bg}`}>
                  <Icon size={10} /> {a.pillLabel}
                </span>
                <span className="bg-amber/10 text-deep-orange text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {a.tag}
                </span>
                <span className="text-[10px] text-muted ml-auto">{a.time}</span>
              </div>
              <h4 className={`font-semibold text-sm text-pg-text ${locale === 'zh' ? 'font-noto-sans-sc' : 'font-sora'}`}>{a.title}</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">{a.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
