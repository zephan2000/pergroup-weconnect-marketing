'use client'

/**
 * WeConnectOverlay — full-screen slide-up panel embedded in the marketing layout.
 *
 * Restructured as a thin shell composing:
 *  - Sidebar with Needs / Alerts / Profile tabs (desktop)
 *  - Bottom nav (mobile)
 *  - NeedsScreen (Spaces browser + Post Need/Offering)
 *  - AlertsScreen (advisory alerts preview)
 *  - ProfileScreen (stub)
 */

import { useCallback, useEffect, useState } from 'react'
import { useWeConnect, type WeConnectTab } from '@/lib/weconnect/context'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import { Zap, AlertTriangle, User, X, Bell } from 'lucide-react'
import NeedsScreen from '@/components/weconnect/NeedsScreen'
import AlertsScreen from '@/components/weconnect/AlertsScreen'
import ProfileScreen from '@/components/weconnect/ProfileScreen'

const WC_VARS: React.CSSProperties = {
  '--wc-amber': '#F5A623',
  '--wc-green': '#22C55E',
  '--wc-bg': '#0F1117',
  '--wc-surface': '#1A1D27',
  '--wc-border': 'rgba(255,255,255,0.08)',
  '--wc-text': '#E8EAF0',
  '--wc-muted': 'rgba(232,234,240,0.45)',
} as React.CSSProperties

const TABS: { tab: WeConnectTab; icon: typeof Zap; label: string; cn: string }[] = [
  { tab: 'needs', icon: Zap, label: 'Needs', cn: '需求' },
  { tab: 'alerts', icon: AlertTriangle, label: 'Alerts', cn: '预警' },
  { tab: 'profile', icon: User, label: 'Profile', cn: '我的' },
]

const tabTitle: Record<WeConnectTab, { en: string; cn: string }> = {
  needs: { en: 'Needs & Spaces', cn: '需求 · 空间' },
  alerts: { en: 'Advisory Alerts', cn: '风险预警 · 智能推送' },
  profile: { en: 'Profile & Settings', cn: '个人中心 · 设置' },
}

export default function WeConnectOverlay({ settings }: { settings: PlatformSettingsData }) {
  const { isOpen, activeTab, close, setActiveTab } = useWeConnect()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setVisible(false)
    }
  }, [isOpen])

  const handleClose = useCallback(() => close(), [close])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose])

  return (
    <div style={WC_VARS}>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(15, 17, 23, 0.82)',
          backdropFilter: 'blur(32px) saturate(180%) brightness(0.88)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%) brightness(0.88)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-inter, Inter, sans-serif)',
          color: 'var(--wc-text)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* ── Topbar ── */}
        <div
          style={{
            background: 'rgba(26, 29, 39, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--wc-border)',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 20px',
              borderRight: '1px solid var(--wc-border)',
              minWidth: 200,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'linear-gradient(135deg, #F5A623, #D4880A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
                color: 'white',
                flexShrink: 0,
              }}
            >
              W
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)' }}>WeConnect</div>
              <div style={{ fontSize: 10, color: 'var(--wc-muted)' }}>by PER GROUP</div>
            </div>
          </div>

          {/* Page title */}
          <div style={{ padding: '14px 24px', flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--wc-text)' }}>
              {tabTitle[activeTab].en}
            </div>
            <div className="font-noto-sans-sc" style={{ fontSize: 11, color: 'var(--wc-muted)', marginTop: 1 }}>
              {tabTitle[activeTab].cn}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
            <button
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: 'rgba(255,255,255,.06)',
                color: 'var(--wc-text)',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              <Bell size={14} />
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 8,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#EF4444',
                }}
              />
            </button>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 20px',
              height: '100%',
              minHeight: 56,
              background: 'none',
              border: 'none',
              borderLeft: '1px solid var(--wc-border)',
              color: 'var(--wc-muted)',
              fontSize: 12,
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: 1,
            } as React.CSSProperties}
          >
            <X size={14} /> Close
          </button>
        </div>

        {/* ── Body: sidebar + main ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Desktop sidebar */}
          <aside
            className="hidden md:flex"
            style={{
              width: 200,
              background: 'rgba(26, 29, 39, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRight: '1px solid var(--wc-border)',
              flexDirection: 'column',
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--wc-muted)', padding: '16px 20px 8px', textTransform: 'uppercase' }}>
              Platform · 平台
            </div>

            {TABS.map(({ tab, icon: Icon, label, cn }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: activeTab === tab ? '#F5A623' : 'var(--wc-muted)',
                  background: activeTab === tab ? 'rgba(245,166,35,.12)' : 'none',
                  border: 'none',
                  borderLeft: activeTab === tab ? '3px solid #F5A623' : '3px solid transparent',
                  borderRadius: '0 7px 7px 0',
                  margin: '1px 8px 1px 0',
                  width: 'calc(100% - 8px)',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <Icon size={16} />
                <span>{label} · {cn}</span>
              </button>
            ))}

            {/* User card */}
            <div style={{ padding: 12, borderTop: '1px solid var(--wc-border)', marginTop: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 10,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,.03)',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F5A623, #D4880A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  PG
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--wc-text)' }}>PER GROUP User</div>
                  <div style={{ fontSize: 10, color: 'var(--wc-muted)' }}>Enterprise Member</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {activeTab === 'needs' && <NeedsScreen settings={settings} isActive={isOpen && activeTab === 'needs'} />}
              {activeTab === 'alerts' && <AlertsScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
            </div>

            {/* Mobile bottom nav */}
            <div
              className="md:hidden"
              style={{
                display: 'flex',
                borderTop: '1px solid var(--wc-border)',
                background: 'rgba(26, 29, 39, 0.95)',
                flexShrink: 0,
              }}
            >
              {TABS.map(({ tab, icon: Icon, label }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '10px 0',
                    border: 'none',
                    background: 'none',
                    color: activeTab === tab ? '#F5A623' : 'var(--wc-muted)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 10,
                    fontWeight: activeTab === tab ? 600 : 400,
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
