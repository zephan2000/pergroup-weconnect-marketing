'use client'

/**
 * ProfileScreen — stub user profile for v1 (no auth).
 * Shows placeholder profile, company info, and settings.
 */

import { Building2, Settings, Globe, Mail } from 'lucide-react'

export default function ProfileScreen() {
  return (
    <div>
      {/* Profile header */}
      <div
        style={{
          background: 'rgba(26, 29, 39, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--wc-border)',
          borderLeft: '3px solid #F5A623',
          borderRadius: 10,
          padding: 20,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F5A623, #D4880A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}
        >
          PG
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--wc-text)' }}>PER GROUP User</div>
          <div style={{ fontSize: 12, color: 'var(--wc-muted)' }}>
            <span className="font-noto-sans-sc">企业会员</span> · Enterprise Member
          </div>
          <div style={{ fontSize: 11, color: 'var(--wc-muted)', marginTop: 2 }}>
            Member since 2024
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} color="#F5A623" />
          Company Profile · 公司资料
        </h3>
        <div
          style={{
            background: 'rgba(26, 29, 39, 0.7)',
            border: '1px solid var(--wc-border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Industry', value: 'Technology / Innovation', icon: Globe },
            { label: 'Headquarters', value: 'Singapore', icon: Building2 },
            { label: 'Markets', value: 'Southeast Asia, Greater China', icon: Globe },
          ].map((field, i) => (
            <div
              key={field.label}
              style={{
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < 2 ? '1px solid var(--wc-border)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <field.icon size={14} color="var(--wc-muted)" />
                <span style={{ fontSize: 12, color: 'var(--wc-muted)' }}>{field.label}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--wc-text)' }}>{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={16} color="#F5A623" />
          Settings · 设置
        </h3>
        <div
          style={{
            background: 'rgba(26, 29, 39, 0.7)',
            border: '1px solid var(--wc-border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Language · 语言', value: 'English + 中文', action: false },
            { label: 'Notification Preferences', value: 'Coming Soon', action: false },
            { label: 'Contact PER GROUP', value: '', action: true },
            { label: 'About WeConnect', value: 'v1.0', action: false },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < 3 ? '1px solid var(--wc-border)' : 'none',
                cursor: item.action ? 'pointer' : 'default',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--wc-text)' }}>{item.label}</span>
              {item.action ? (
                <Mail size={14} color="#F5A623" />
              ) : (
                <span style={{ fontSize: 12, color: 'var(--wc-muted)' }}>{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
