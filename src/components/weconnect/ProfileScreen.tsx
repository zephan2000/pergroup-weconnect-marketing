'use client'

/**
 * ProfileScreen — stub user profile for v1 (no auth).
 * Uses warm light aesthetic matching reference.
 */

import { Clock } from 'lucide-react'
import DotMotif from '@/components/DotMotif'

export default function ProfileScreen() {
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
            <h3 className="font-noto-sans-sc font-bold text-pg-text text-lg">企业用户</h3>
            <p className="text-muted text-sm">PER GROUP Enterprise</p>
            <p className="text-muted text-xs mt-1">
              E-Harbor Member since 2024 / <span className="font-noto-sans-sc">E-Harbor会员 2024年起</span>
            </p>
          </div>
        </div>
      </div>

      {/* My Posts */}
      <div>
        <h4 className="font-sora font-bold text-sm text-pg-text mb-2">
          My Posts / <span className="font-noto-sans-sc">我的发布</span>
        </h4>
        {[
          { en: 'Alternative logistics supplier — SEA', cn: '东南亚替代物流供应商', time: '2d ago' },
          { en: 'FX hedging advisory', cn: '汇率对冲咨询', time: '4d ago' },
          { en: 'Legal counsel — SG entity', cn: '新加坡法律顾问', time: '1w ago' },
        ].map((r) => (
          <div key={r.en} className="glass-card rounded-xl p-3 mb-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-pg-text">{r.en}</div>
              <div className="font-noto-sans-sc text-xs text-muted">{r.cn}</div>
            </div>
            <span className="text-[10px] text-muted">{r.time}</span>
          </div>
        ))}
      </div>

      {/* Company Profile */}
      <div>
        <h4 className="font-sora font-bold text-sm text-pg-text mb-2">
          Company Profile / <span className="font-noto-sans-sc">公司档案</span>
        </h4>
        <div className="glass-card rounded-xl p-4 space-y-3">
          {[
            { label: 'Industry / 行业', value: 'Technology / 科技' },
            { label: 'HQ / 总部', value: 'Singapore / 新加坡' },
            { label: 'Markets / 市场', value: 'SEA, Greater China / 东南亚、大中华' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-muted font-noto-sans-sc">{item.label}</span>
              <span className="bg-amber/10 text-deep-orange text-xs font-semibold px-2 py-0.5 rounded-md font-noto-sans-sc">
                {item.value}
              </span>
            </div>
          ))}
          <button className="text-amber text-xs font-semibold hover:underline mt-2 bg-transparent border-none cursor-pointer">
            Update profile → talk to PER GROUP / <span className="font-noto-sans-sc">更新档案→联系PER GROUP</span>
          </button>
        </div>
      </div>

      {/* Settings */}
      <div>
        <h4 className="font-sora font-bold text-sm text-pg-text mb-2">
          Settings / <span className="font-noto-sans-sc">设置</span>
        </h4>
        <div className="glass-card rounded-xl divide-y divide-line">
          {[
            { en: 'Language', cn: '语言', extra: 'EN | 中文' },
            { en: 'Notification preferences', cn: '通知设置', comingSoon: true },
            { en: 'Contact PER GROUP', cn: '联系我们' },
            { en: 'About WeConnect', cn: '关于WeConnect' },
          ].map((s) => (
            <div key={s.en} className="p-3 flex items-center justify-between">
              <span className="text-sm text-pg-text">
                {s.en} / <span className="font-noto-sans-sc text-muted">{s.cn}</span>
              </span>
              {s.comingSoon ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                  <Clock size={10} /> Coming Soon
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
