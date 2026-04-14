'use client'

/**
 * AlertsScreen — Advisory alerts with severity levels.
 * v1: preview/coming-soon state with hardcoded sample alerts.
 */

import { Zap, Eye, Info } from 'lucide-react'

const sampleAlerts = [
  {
    severity: 'urgent' as const,
    category: 'Supply Chain',
    title: 'Gulf Oil Supply Disruption — Alternative Sourcing Recommended',
    description: 'Brent crude exceeds USD 111. Companies with energy or logistics exposure in the Gulf region should consider diversifying suppliers.',
    timestamp: '2 hours ago',
  },
  {
    severity: 'monitor' as const,
    category: 'Regulatory',
    title: 'MAS Updates AML Compliance Framework — Review Required',
    description: 'New anti-money laundering rules from MAS may affect cross-border payment flows for fintech companies operating in Singapore.',
    timestamp: '1 day ago',
  },
  {
    severity: 'info' as const,
    category: 'Market Access',
    title: 'EU Carbon Border Tax Phase 2 — Impact Assessment Available',
    description: 'The EU CBAM enters its second phase in Q3 2026. Manufacturing exporters to the EU should review carbon reporting obligations.',
    timestamp: '3 days ago',
  },
]

const severityConfig = {
  urgent: { icon: Zap, color: '#EF4444', bg: 'rgba(239,68,68,.12)', label: 'Urgent' },
  monitor: { icon: Eye, color: '#F5A623', bg: 'rgba(245,166,35,.12)', label: 'Monitor' },
  info: { icon: Info, color: '#6B7280', bg: 'rgba(107,114,128,.12)', label: 'Info' },
}

export default function AlertsScreen() {
  return (
    <div style={{ opacity: 0.7 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--wc-text)', marginBottom: 4 }}>
          Advisory Alerts
        </h2>
        <p style={{ fontSize: 11, color: 'var(--wc-muted)' }}>
          风险预警 · 智能推送
        </p>
      </div>

      {/* Coming soon banner */}
      <div
        style={{
          background: 'rgba(245,166,35,.08)',
          border: '1px solid rgba(245,166,35,.2)',
          borderRadius: 10,
          padding: '14px 18px',
          marginBottom: 20,
          fontSize: 13,
          color: '#F5A623',
        }}
      >
        Coming Soon — Personalised alerts based on your company profile and market exposure.
        <span style={{ display: 'block', fontSize: 11, color: 'var(--wc-muted)', marginTop: 4 }}>
          即将推出 — 基于您的公司概况和市场风险的个性化提醒
        </span>
      </div>

      {/* Sample alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sampleAlerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const IconComponent = config.icon

          return (
            <div
              key={alert.title}
              style={{
                background: 'rgba(26, 29, 39, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--wc-border)',
                borderLeft: `3px solid ${config.color}`,
                borderRadius: 10,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div
                  style={{
                    background: config.bg,
                    borderRadius: 6,
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <IconComponent size={12} color={config.color} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: config.color, textTransform: 'uppercase' }}>
                    {config.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,.06)',
                    color: 'var(--wc-muted)',
                  }}
                >
                  {alert.category}
                </span>
                <span style={{ fontSize: 10, color: 'var(--wc-muted)', marginLeft: 'auto' }}>
                  {alert.timestamp}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--wc-text)', marginBottom: 6 }}>
                {alert.title}
              </div>
              <p style={{ fontSize: 12, color: 'var(--wc-muted)', lineHeight: 1.6, margin: 0 }}>
                {alert.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
