'use client'

/**
 * WeConnectOverlay — full-screen slide-up panel embedded in the marketing layout.
 *
 * Architecture:
 *  - Open/close state lives in WeConnectContext (WeConnectProvider in marketing layout).
 *  - Static copy (headlines, placeholders) is passed as `settings` from the Payload
 *    PlatformSettings global, fetched server-side in (marketing)/layout.tsx.
 *  - Live listings are fetched via the fetchSpacesListings server action when the
 *    Spaces tab first becomes active.
 *  - The panel is always in the DOM; visibility is driven by CSS transform so the
 *    liquid-glass slide animation is smooth.
 */

import { useCallback, useEffect, useState } from 'react'
import { useWeConnect, type WeConnectTab } from '@/lib/weconnect/context'
import { fetchSpacesListings } from '@/app/actions/weconnect'
import type { Listing } from '@/lib/supabase/schema'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'

// Inline CSS variables so the overlay is independent of globals.css load order.
const WC_VARS: React.CSSProperties = {
  '--wc-amber': '#F5A623',
  '--wc-green': '#22C55E',
  '--wc-bg': '#0F1117',
  '--wc-surface': '#1A1D27',
  '--wc-border': 'rgba(255,255,255,0.08)',
  '--wc-text': '#E8EAF0',
  '--wc-muted': 'rgba(232,234,240,0.45)',
} as React.CSSProperties

export default function WeConnectOverlay({ settings }: { settings: PlatformSettingsData }) {
  const { isOpen, activeTab, close, setActiveTab } = useWeConnect()
  const [visible, setVisible] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [listingsError, setListingsError] = useState(false)
  const [listingsFetched, setListingsFetched] = useState(false)

  // Slide animation: defer setVisible(true) by one frame so the browser paints
  // the initial translateY(100%) state before the transition fires.
  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setVisible(false)
    }
  }, [isOpen])

  // Fetch listings when overlay opens on the Spaces tab (fetch once per session).
  useEffect(() => {
    if (isOpen && activeTab === 'spaces' && !listingsFetched) {
      setListingsLoading(true)
      setListingsError(false)
      fetchSpacesListings()
        .then((data) => {
          setListings(data)
          setListingsFetched(true)
        })
        .catch(() => setListingsError(true))
        .finally(() => setListingsLoading(false))
    }
  }, [isOpen, activeTab, listingsFetched])

  const handleClose = useCallback(() => close(), [close])

  // Escape key closes the overlay.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, handleClose])

  const tabTitle: Record<WeConnectTab, { en: string; cn: string }> = {
    spaces: { en: 'Find Spaces Globally', cn: '全球办公室 · 实验室 · 厂房土地' },
    funding: { en: 'Funding & Investment', cn: '融资对接 · VC · 政府补贴' },
    markets: { en: 'Market Entry', cn: '市场准入 · 全球加速' },
  }

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
        {/* ── Topbar ─────────────────────────────────────────────────────── */}
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
              minWidth: 240,
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
            <div
              style={{
                fontFamily: 'var(--font-noto-serif-sc, serif)',
                fontSize: 11,
                color: 'var(--wc-muted)',
                marginTop: 1,
              }}
            >
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
              }}
            >
              🔔
            </button>
            <button
              style={{
                padding: '7px 14px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: '#F5A623',
                color: 'white',
                fontFamily: 'inherit',
              }}
            >
              + Post Requirement
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
            ✕ &nbsp;Close
          </button>
        </div>

        {/* ── Body: sidebar + main ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <aside
            style={{
              width: 240,
              background: 'rgba(26, 29, 39, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRight: '1px solid var(--wc-border)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: 1.5,
                color: 'var(--wc-muted)',
                padding: '16px 20px 8px',
                textTransform: 'uppercase',
              }}
            >
              Discover · 发现
            </div>

            {(
              [
                { tab: 'spaces' as WeConnectTab, icon: '🏢', label: 'Spaces · 空间' },
                { tab: 'funding' as WeConnectTab, icon: '💰', label: 'Funding · 融资' },
                { tab: 'markets' as WeConnectTab, icon: '🌏', label: 'Markets · 市场' },
              ] as const
            ).map(({ tab, icon, label }) => (
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
                  borderRadius: 7,
                  margin: '1px 8px',
                  width: 'calc(100% - 16px)',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{icon}</span>
                {label}
              </button>
            ))}

            <div
              style={{
                fontSize: 10,
                letterSpacing: 1.5,
                color: 'var(--wc-muted)',
                padding: '16px 20px 8px',
                marginTop: 16,
                textTransform: 'uppercase',
              }}
            >
              My Activity · 我的
            </div>

            {[
              { icon: '📌', label: 'Saved · 收藏' },
              { icon: '💬', label: 'Messages · 消息' },
              { icon: '📊', label: 'My Projects · 项目' },
            ].map(({ icon, label }) => (
              <button
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--wc-muted)',
                  background: 'none',
                  border: 'none',
                  borderRadius: 7,
                  margin: '1px 8px',
                  width: 'calc(100% - 16px)',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{icon}</span>
                {label}
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
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
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
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--wc-text)' }}>
                    PER GROUP User
                  </div>
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
              {activeTab === 'spaces' && (
                <SpacesContent
                  listings={listings}
                  loading={listingsLoading}
                  error={listingsError}
                  settings={settings}
                />
              )}
              {activeTab === 'funding' && (
                <PlaceholderContent
                  section="Funding · 融资"
                  icon="💰"
                  title={settings.fundingPlaceholderTitle}
                  description={settings.fundingPlaceholderBody}
                />
              )}
              {activeTab === 'markets' && (
                <PlaceholderContent
                  section="Markets · 市场"
                  icon="🌏"
                  title={settings.marketsPlaceholderTitle}
                  description={settings.marketsPlaceholderBody}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

// ── Spaces content ──────────────────────────────────────────────────────────

function SpacesContent({
  listings,
  loading,
  error,
  settings,
}: {
  listings: Listing[]
  loading: boolean
  error: boolean
  settings: PlatformSettingsData
}) {
  return (
    <>
      {/* AI matching card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,.08), rgba(139,92,246,.05))',
          border: '1px solid rgba(245,166,35,.2)',
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div
            style={{
              background: 'rgba(245,166,35,.15)',
              border: '1px solid rgba(245,166,35,.3)',
              color: '#F5A623',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            ✦ AI Matching · 智能匹配
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--wc-text)' }}>
            {settings.aiMatchingHeadline}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--wc-muted)', marginBottom: 14 }}>
          {settings.aiMatchingDescription}
        </p>
        <div style={{ position: 'relative' }}>
          <textarea
            placeholder={settings.aiMatchingPlaceholder}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,.3)',
              border: '1px solid var(--wc-border)',
              borderRadius: 9,
              padding: '12px 120px 12px 14px',
              color: 'var(--wc-text)',
              fontFamily: 'inherit',
              fontSize: 13,
              resize: 'none',
              minHeight: 68,
              lineHeight: 1.6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              background: '#F5A623',
              color: 'white',
              border: 'none',
              padding: '7px 14px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✦ Match
          </button>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
          {['🔬 Lab near NUS', '🏢 CBD Office', '🏭 Factory SEA', '💰 AI Health Fund', '🌍 EU MedTech'].map(
            (chip) => (
              <button
                key={chip}
                style={{
                  padding: '5px 11px',
                  borderRadius: 20,
                  border: '1px solid var(--wc-border)',
                  fontSize: 11,
                  color: 'var(--wc-muted)',
                  cursor: 'pointer',
                  background: 'none',
                  fontFamily: 'inherit',
                }}
              >
                {chip}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Listings */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--wc-text)' }}>
            Available Spaces
          </h2>
          {!loading && !error && (
            <span style={{ fontSize: 12, color: 'var(--wc-muted)' }}>
              {listings.length} listing{listings.length !== 1 ? 's' : ''} · sorted by match score
            </span>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--wc-muted)', fontSize: 13 }}>
            Loading listings…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#EF4444', fontSize: 13 }}>
            Could not load listings. Please try again later.
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--wc-muted)', fontSize: 13 }}>
            No spaces available yet.
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 14,
            }}
          >
            {listings.map((listing) => (
              <SpaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Space card ──────────────────────────────────────────────────────────────

function SpaceCard({ listing }: { listing: Listing }) {
  const matchScore = listing.match_score ?? 0
  const matchColor = matchScore >= 90 ? '#22C55E' : matchScore >= 75 ? '#F5A623' : '#EF4444'
  const typeColor =
    listing.type === 'space' ? '#F5A623' : listing.type === 'funding' ? '#22C55E' : '#60A5FA'
  const typeBg =
    listing.type === 'space'
      ? 'rgba(245,166,35,.12)'
      : listing.type === 'funding'
        ? 'rgba(34,197,94,.12)'
        : 'rgba(96,165,250,.12)'
  const price = [listing.price, listing.price_unit].filter(Boolean).join(' ')

  return (
    <div
      style={{
        background: 'rgba(26, 29, 39, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--wc-border)',
        borderRadius: 10,
        padding: 18,
        cursor: 'pointer',
        overflow: 'hidden',
        borderTop: `2px solid ${typeColor}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: 4,
            background: typeBg,
            color: typeColor,
          }}
        >
          {listing.type}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--wc-text)',
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: matchColor }} />
          {matchScore}% match
        </div>
      </div>

      <div
        style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, lineHeight: 1.3, color: 'var(--wc-text)' }}
      >
        {listing.title}
      </div>
      {listing.location && (
        <div style={{ fontSize: 11, color: 'var(--wc-muted)', marginBottom: 10 }}>
          📍 {listing.location}
        </div>
      )}

      {/* Match score bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: 'var(--wc-muted)',
            marginBottom: 3,
          }}
        >
          <span>AI Match Score</span>
          <span>{matchScore}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(90deg, ${matchColor}, ${matchColor}aa)`,
              width: `${matchScore}%`,
            }}
          />
        </div>
      </div>

      {price && (
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)', marginBottom: 12 }}>
          {price}
        </div>
      )}

      <div style={{ display: 'flex', gap: 7 }}>
        <button
          style={{
            flex: 1,
            padding: 7,
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid var(--wc-border)',
            background: 'none',
            color: 'var(--wc-muted)',
            fontFamily: 'inherit',
          }}
        >
          Save
        </button>
        <button
          style={{
            flex: 1,
            padding: 7,
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            border: '1px solid rgba(245,166,35,.3)',
            background: 'rgba(245,166,35,.1)',
            color: '#F5A623',
            fontFamily: 'inherit',
          }}
        >
          Connect →
        </button>
      </div>
    </div>
  )
}

// ── Placeholder (Funding / Markets) ────────────────────────────────────────

function PlaceholderContent({
  section,
  icon,
  title,
  description,
}: {
  section: string
  icon: string
  title: string
  description: string
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '80px 40px',
        gap: 20,
      }}
    >
      <div style={{ fontSize: 48 }}>{icon}</div>
      <div
        style={{
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: 11,
          letterSpacing: 3,
          color: '#F5A623',
          textTransform: 'uppercase',
        }}
      >
        {section}
      </div>
      <h2
        style={{ fontSize: 24, fontWeight: 700, color: 'var(--wc-text)', maxWidth: 400, lineHeight: 1.3 }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, color: 'var(--wc-muted)', maxWidth: 400, lineHeight: 1.8 }}>
        {description}
      </p>
      <div
        style={{
          border: '1px solid rgba(245,166,35,.25)',
          padding: '10px 22px',
          fontSize: 12,
          color: '#F5A623',
          letterSpacing: 2,
        }}
      >
        NOTIFY ME WHEN LIVE
      </div>
    </div>
  )
}
