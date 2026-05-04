'use client'

/**
 * AlertsScreen — Advisory alerts with severity levels.
 * v1: preview/coming-soon state with sample alerts.
 * Uses warm light aesthetic matching reference.
 */

import { Zap, Eye, Info, Clock } from 'lucide-react'

const alerts = [
  {
    severity: 'urgent' as const,
    accentClass: 'border-l-alert-red',
    pillBgClass: 'bg-alert-red/15 text-alert-red',
    pillIcon: Zap,
    pillEn: 'Urgent',
    pillCn: '紧急',
    tagEn: 'Supply Chain',
    tagCn: '供应链',
    time: '2h ago',
    titleEn: 'Gulf Crisis: Oil at $111 — Review Your Logistics Exposure',
    titleCn: '海湾危机：油价破111美元——审查物流敞口',
    bodyEn: 'Escalating Gulf tensions push Brent crude above $111. Companies with Southeast Asian supply chains face rising cost risk.',
  },
  {
    severity: 'monitor' as const,
    accentClass: 'border-l-amber',
    pillBgClass: 'bg-amber/15 text-amber',
    pillIcon: Eye,
    pillEn: 'Monitor',
    pillCn: '关注',
    tagEn: 'Regulatory',
    tagCn: '监管',
    time: '1d ago',
    titleEn: 'MAS Tightens AML Rules for Cross-Border Transactions',
    titleCn: '新加坡金管局收紧跨境交易反洗钱规定',
    bodyEn: 'New AML reporting requirements effective Q3. Chinese companies with Singapore entities should review compliance posture.',
  },
  {
    severity: 'info' as const,
    accentClass: 'border-l-muted',
    pillBgClass: 'bg-faint text-muted',
    pillIcon: Info,
    pillEn: 'Info',
    pillCn: '资讯',
    tagEn: 'Market Access',
    tagCn: '市场准入',
    time: '3d ago',
    titleEn: 'EU Carbon Border Tax: Implications for Chinese Exporters',
    titleCn: '欧盟碳边境税：对中国出口商的影响',
    bodyEn: 'CBAM takes effect for key sectors. PER GROUP has vetted carbon advisory partners if you need readiness support.',
  },
]

export default function AlertsScreen() {
  return (
    <div className="space-y-4 pb-4">
      <div>
        <h3 className="font-sora font-bold text-pg-text">Advisory Alerts</h3>
        <p className="font-noto-sans-sc text-muted text-sm">顾问预警</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3 border-l-4 border-l-amber">
        <Clock className="w-5 h-5 text-amber flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-pg-text">
            Coming Soon / <span className="font-noto-sans-sc">即将推出</span>
          </p>
          <p className="text-xs text-muted">
            Personalised alerts based on your business profile will be available in a future update.
          </p>
          <p className="text-xs text-muted font-noto-sans-sc">
            基于您的业务档案的个性化预警将在未来版本中推出。
          </p>
        </div>
      </div>

      {/* Preview label */}
      <p className="text-xs text-muted">
        Preview / <span className="font-noto-sans-sc">示例预览</span>
      </p>

      {/* Sample alerts */}
      {alerts.map((a) => {
        const IconComponent = a.pillIcon
        return (
          <div
            key={a.titleEn}
            className={`glass-card rounded-xl overflow-hidden border-l-4 ${a.accentClass} opacity-60`}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.pillBgClass}`}>
                  <IconComponent size={10} /> {a.pillEn} / <span className="font-noto-sans-sc">{a.pillCn}</span>
                </span>
                <span className="bg-amber/10 text-deep-orange text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {a.tagEn} / <span className="font-noto-sans-sc">{a.tagCn}</span>
                </span>
                <span className="text-[10px] text-muted ml-auto">{a.time}</span>
              </div>
              <h4 className="font-sora font-semibold text-sm text-pg-text">{a.titleEn}</h4>
              <p className="font-noto-sans-sc text-xs text-muted mt-0.5">{a.titleCn}</p>
              <p className="text-xs text-muted mt-2 leading-relaxed">{a.bodyEn}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
