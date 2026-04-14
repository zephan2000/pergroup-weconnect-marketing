'use client'

/**
 * WeConnectOverlay — full-screen slide-up panel in the warm light aesthetic.
 *
 * Matches per-group-connect-main reference: light bg, glass-card sidebar,
 * glass-light topbar. Uses the marketing site's CSS variables (not --wc-* dark tokens).
 */

import { useCallback, useEffect, useState } from 'react'
import { useWeConnect, type WeConnectTab } from '@/lib/weconnect/context'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import { Zap, AlertTriangle, User, X, Bell, ChevronDown } from 'lucide-react'
import NeedsScreen from '@/components/weconnect/NeedsScreen'
import AlertsScreen from '@/components/weconnect/AlertsScreen'
import ProfileScreen from '@/components/weconnect/ProfileScreen'

const TABS: { tab: WeConnectTab; icon: typeof Zap; label: string; cn: string; badge?: number }[] = [
  { tab: 'needs', icon: Zap, label: 'Needs', cn: '需求' },
  { tab: 'alerts', icon: AlertTriangle, label: 'Alerts', cn: '资讯', badge: 2 },
  { tab: 'profile', icon: User, label: 'Profile', cn: '我的' },
]

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
    <div
      className="fixed inset-0 z-[2000] bg-bg flex flex-col font-inter"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* ── Top Bar ── */}
      <div className="glass-light flex items-center justify-between px-4 h-14 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Brand mark */}
          <div
            className="w-6 h-6 bg-amber flex items-center justify-center font-bold text-[10px] text-pg-text rounded flex-shrink-0"
            style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
          >
            P
          </div>
          <div className="hidden md:flex flex-col mr-4">
            <span className="font-sora font-extrabold text-pg-text text-sm">WeConnect</span>
            <span className="text-muted text-[9px]">by E-Harbor</span>
          </div>

          {/* Org selector stub */}
          <button className="flex items-center gap-1 text-pg-text text-sm font-noto-sans-sc bg-transparent border-none cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-amber" />
            企业用户
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative text-pg-text bg-transparent border-none cursor-pointer">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-amber text-pg-text text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center font-sora font-bold text-pg-text text-xs">
            PG
          </div>
          <button onClick={handleClose} className="text-muted hover:text-pg-text ml-1 bg-transparent border-none cursor-pointer">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex w-48 glass-card flex-col pt-4 flex-shrink-0 border-r border-line rounded-none">
          {TABS.map(({ tab, icon: Icon, label, cn, badge }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-4 py-3 text-left transition-colors bg-transparent border-none cursor-pointer font-inter ${
                activeTab === tab
                  ? 'text-amber border-l-2 border-l-amber bg-amber/5'
                  : 'text-muted hover:text-pg-text hover:bg-pg-text/5 border-l-2 border-l-transparent'
              }`}
            >
              <Icon size={18} />
              <div>
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-[10px] font-noto-sans-sc opacity-70">{cn}</div>
              </div>
              {badge && (
                <span className="ml-auto bg-amber text-pg-text text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-4">
            {activeTab === 'needs' && <NeedsScreen settings={settings} isActive={isOpen && activeTab === 'needs'} />}
            {activeTab === 'alerts' && <AlertsScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden glass-light flex items-center justify-around h-16 flex-shrink-0 border-t border-line">
        {TABS.map(({ tab, icon: Icon, label, badge }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center gap-0.5 relative bg-transparent border-none cursor-pointer font-inter ${
              activeTab === tab ? 'text-amber' : 'text-muted'
            }`}
          >
            {activeTab === tab && (
              <span className="absolute -top-0 w-8 h-0.5 bg-amber rounded-full" />
            )}
            <span className="relative">
              <Icon size={20} />
              {badge && (
                <span className="absolute -top-1 -right-2 bg-amber text-pg-text text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
