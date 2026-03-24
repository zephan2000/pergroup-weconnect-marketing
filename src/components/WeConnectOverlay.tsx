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
 *  - Search has two modes:
 *    1. Filter mode (default): client-side text matching + chip-based facet filtering
 *    2. AI mode: semantic search via /api/search with pgvector cosine similarity
 *  - The panel is always in the DOM; visibility is driven by CSS transform so the
 *    liquid-glass slide animation is smooth.
 */

import { useCallback, useEffect, useState } from 'react'
import { useWeConnect, type WeConnectTab } from '@/lib/weconnect/context'
import { fetchSpacesListings } from '@/app/actions/weconnect'
import type { Space } from '@/lib/supabase/schema'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import { useSpacesSearch, type SpaceWithSimilarity, type SearchMode, type Facets } from '@/hooks/useSpacesSearch'
import { RichText } from '@payloadcms/richtext-lexical/react'

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
  const [spaces, setSpaces] = useState<Space[]>([])
  const [spacesLoading, setSpacesLoading] = useState(false)
  const [spacesError, setSpacesError] = useState(false)
  const [spacesFetched, setSpacesFetched] = useState(false)

  const search = useSpacesSearch(spaces)

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
    if (isOpen && activeTab === 'spaces' && !spacesFetched) {
      setSpacesLoading(true)
      setSpacesError(false)
      fetchSpacesListings()
        .then((data) => {
          setSpaces(data)
          setSpacesFetched(true)
        })
        .catch(() => setSpacesError(true))
        .finally(() => setSpacesLoading(false))
    }
  }, [isOpen, activeTab, spacesFetched])

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
                  listings={search.filteredSpaces}
                  totalCount={spaces.length}
                  loading={spacesLoading}
                  error={spacesError}
                  searchMode={search.searchMode}
                  searchQuery={search.searchQuery}
                  setSearchQuery={search.setSearchQuery}
                  activeTypes={search.activeTypes}
                  activeDistricts={search.activeDistricts}
                  activePriceRanges={search.activePriceRanges}
                  toggleType={search.toggleType}
                  toggleDistrict={search.toggleDistrict}
                  togglePriceRange={search.togglePriceRange}
                  facets={search.facets}
                  toggleMode={search.toggleMode}
                  handleAiSearch={search.handleAiSearch}
                  aiLoading={search.aiLoading}
                  clearSearch={search.clearSearch}
                  showAiSuggestion={search.showAiSuggestion}
                  dismissAiSuggestion={search.dismissAiSuggestion}
                  acceptAiSuggestion={search.acceptAiSuggestion}
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

// ── Chip styles ──────────────────────────────────────────────────────────────

const chipBase: React.CSSProperties = {
  padding: '5px 11px',
  borderRadius: 20,
  fontSize: 11,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}

const chipInactive: React.CSSProperties = {
  ...chipBase,
  border: '1px solid var(--wc-border)',
  color: 'var(--wc-muted)',
  background: 'none',
}

const chipActive: React.CSSProperties = {
  ...chipBase,
  border: '1px solid rgba(245,166,35,.3)',
  color: '#F5A623',
  background: 'rgba(245,166,35,.15)',
}

// ── AI suggestion chips for AI mode ──────────────────────────────────────────

const AI_SUGGESTIONS = [
  'Biotech lab near NUS with grant eligibility',
  'Affordable coworking in CBD for 5-person team',
  'Industrial space with clean room certification',
  'Serviced office near MRT under $3k/month',
]

// ── Spaces content ──────────────────────────────────────────────────────────

interface SpacesContentProps {
  listings: SpaceWithSimilarity[]
  totalCount: number
  loading: boolean
  error: boolean
  searchMode: SearchMode
  searchQuery: string
  setSearchQuery: (q: string) => void
  activeTypes: Set<string>
  activeDistricts: Set<string>
  activePriceRanges: Set<string>
  toggleType: (t: string) => void
  toggleDistrict: (d: string) => void
  togglePriceRange: (r: string) => void
  facets: Facets
  toggleMode: () => void
  handleAiSearch: (query?: string) => void
  aiLoading: boolean
  clearSearch: () => void
  showAiSuggestion: boolean
  dismissAiSuggestion: () => void
  acceptAiSuggestion: () => void
}

function SpacesContent({
  listings,
  totalCount,
  loading,
  error,
  searchMode,
  searchQuery,
  setSearchQuery,
  activeTypes,
  activeDistricts,
  activePriceRanges,
  toggleType,
  toggleDistrict,
  togglePriceRange,
  facets,
  toggleMode,
  handleAiSearch,
  aiLoading,
  clearSearch,
  showAiSuggestion,
  dismissAiSuggestion,
  acceptAiSuggestion,
}: SpacesContentProps) {
  const isAi = searchMode === 'ai'

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      toggleMode()
    } else if (e.key === 'Enter' && isAi) {
      e.preventDefault()
      handleAiSearch()
    }
  }

  const hasActiveFilters =
    activeTypes.size > 0 || activeDistricts.size > 0 || activePriceRanges.size > 0 || searchQuery.trim().length > 0

  // Price range chip config
  const priceChips: { key: string; label: string; count: number }[] = [
    { key: 'under2k', label: 'Under $2k', count: facets.priceRanges.under2k },
    { key: '2k5k', label: '$2k – $5k', count: facets.priceRanges.range2k5k },
    { key: '5kplus', label: '$5k+', count: facets.priceRanges.over5k },
  ]

  return (
    <>
      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,.08), rgba(139,92,246,.05))',
          border: '1px solid rgba(245,166,35,.2)',
          borderRadius: 14,
          padding: '18px 20px',
        }}
      >
        {/* Input row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAi
                  ? 'Describe your ideal space in natural language...'
                  : 'Search by name, address, district...'
              }
              style={{
                width: '100%',
                background: 'rgba(0,0,0,.3)',
                border: `1px solid ${isAi ? 'rgba(245,166,35,.3)' : 'var(--wc-border)'}`,
                borderRadius: 9,
                padding: '10px 14px',
                paddingRight: isAi ? 80 : 14,
                color: 'var(--wc-text)',
                fontFamily: 'inherit',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {/* Match button (AI mode only) */}
            {isAi && (
              <button
                onClick={() => handleAiSearch()}
                disabled={aiLoading || !searchQuery.trim()}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: aiLoading ? 'rgba(245,166,35,.5)' : '#F5A623',
                  color: 'white',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: aiLoading ? 'wait' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {aiLoading ? '...' : 'Match'}
              </button>
            )}
          </div>

          {/* AI toggle pill */}
          <button
            onClick={toggleMode}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              border: isAi ? '1px solid rgba(245,166,35,.4)' : '1px solid var(--wc-border)',
              background: isAi ? 'rgba(245,166,35,.2)' : 'none',
              color: isAi ? '#F5A623' : 'var(--wc-muted)',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ✦ AI Search
          </button>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              style={{
                padding: '8px 12px',
                borderRadius: 20,
                fontSize: 11,
                cursor: 'pointer',
                border: '1px solid var(--wc-border)',
                background: 'none',
                color: 'var(--wc-muted)',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Tab hint */}
        <div style={{ fontSize: 10, color: 'var(--wc-muted)', marginTop: 6, paddingLeft: 2 }}>
          {isAi
            ? 'Press Tab to switch to filter search · Press Enter to search'
            : 'Press Tab for AI Search'}
        </div>

        {/* AI suggestion banner (auto-detect) */}
        {showAiSuggestion && (
          <div
            style={{
              marginTop: 8,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(245,166,35,.08)',
              border: '1px solid rgba(245,166,35,.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
            }}
          >
            <span style={{ color: 'var(--wc-muted)' }}>
              This looks like a natural language query.
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={acceptAiSuggestion}
                style={{
                  background: 'rgba(245,166,35,.15)',
                  border: '1px solid rgba(245,166,35,.3)',
                  color: '#F5A623',
                  padding: '3px 10px',
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Try AI Search
              </button>
              <button
                onClick={dismissAiSuggestion}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--wc-muted)',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Chip bar */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, alignItems: 'center' }}>
          {isAi ? (
            // AI mode: suggestion chips
            AI_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAiSearch(suggestion)}
                style={chipInactive}
              >
                {suggestion}
              </button>
            ))
          ) : (
            // Filter mode: facet chips
            <>
              {/* Type chips */}
              {[...facets.typeCounts.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <button
                    key={`type-${type}`}
                    onClick={() => toggleType(type)}
                    style={activeTypes.has(type) ? chipActive : chipInactive}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                  </button>
                ))}

              {/* Divider */}
              <span style={{ color: 'rgba(255,255,255,.12)', fontSize: 14, padding: '0 2px' }}>|</span>

              {/* District chips */}
              {facets.topDistricts.map(([district, count]) => (
                <button
                  key={`dist-${district}`}
                  onClick={() => toggleDistrict(district)}
                  style={activeDistricts.has(district) ? chipActive : chipInactive}
                >
                  {district} ({count})
                </button>
              ))}

              {/* Divider */}
              <span style={{ color: 'rgba(255,255,255,.12)', fontSize: 14, padding: '0 2px' }}>|</span>

              {/* Price range chips */}
              {priceChips
                .filter((p) => p.count > 0)
                .map((p) => (
                  <button
                    key={`price-${p.key}`}
                    onClick={() => togglePriceRange(p.key)}
                    style={activePriceRanges.has(p.key) ? chipActive : chipInactive}
                  >
                    {p.label} ({p.count})
                  </button>
                ))}
            </>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────── */}
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
            {isAi ? 'AI Matches' : 'Available Spaces'}
          </h2>
          {!loading && !error && (
            <span style={{ fontSize: 12, color: 'var(--wc-muted)' }}>
              {isAi
                ? aiLoading
                  ? 'Searching...'
                  : `${listings.length} AI match${listings.length !== 1 ? 'es' : ''}`
                : `${listings.length} of ${totalCount} space${totalCount !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--wc-muted)', fontSize: 13 }}>
            Loading listings...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#EF4444', fontSize: 13 }}>
            Could not load listings. Please try again later.
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--wc-muted)', fontSize: 13 }}>
            {isAi
              ? searchQuery.trim()
                ? 'No AI matches found. Try rephrasing your query.'
                : 'Type a description and press Enter to search with AI.'
              : hasActiveFilters
                ? 'No spaces match your filters.'
                : 'No spaces available yet.'}
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
              <SpaceCard
                key={listing.id}
                listing={listing}
                similarity={isAi ? listing.similarity : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── Space card ──────────────────────────────────────────────────────────────

function SpaceCard({ listing, similarity }: { listing: SpaceWithSimilarity; similarity?: number }) {
  // Type-based colors for badges
  const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
    office:     { color: '#F5A623', bg: 'rgba(245,166,35,.12)' },
    lab:        { color: '#22C55E', bg: 'rgba(34,197,94,.12)' },
    coworking:  { color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
    industrial: { color: '#A78BFA', bg: 'rgba(167,139,250,.12)' },
    factory:    { color: '#F87171', bg: 'rgba(248,113,113,.12)' },
    retail:     { color: '#FBBF24', bg: 'rgba(251,191,36,.12)' },
    studio:     { color: '#34D399', bg: 'rgba(52,211,153,.12)' },
  }
  const { color: typeColor, bg: typeBg } = TYPE_COLORS[listing.type] ?? TYPE_COLORS.office

  // Match badge color based on similarity
  const matchPct = similarity != null ? Math.round(similarity * 100) : null
  const matchColor =
    matchPct != null && matchPct >= 80
      ? '#22C55E'
      : matchPct != null && matchPct >= 60
        ? '#F5A623'
        : '#9CA3AF'

  // Format price range
  const priceMin = listing.price_sgd_min != null ? `SGD ${Number(listing.price_sgd_min).toLocaleString()}` : null
  const priceMax = listing.price_sgd_max != null ? `SGD ${Number(listing.price_sgd_max).toLocaleString()}` : null
  const price = priceMin && priceMax && priceMin !== priceMax
    ? `${priceMin} – ${priceMax} /month`
    : priceMin
      ? `${priceMin} /month`
      : null

  // Location string from address + district
  const location = [listing.district, listing.address].filter(Boolean).join(' · ')

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
        position: 'relative',
      }}
    >
      {/* Match badge (AI mode only) */}
      {matchPct != null && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 10,
            background: `${matchColor}18`,
            color: matchColor,
            border: `1px solid ${matchColor}40`,
          }}
        >
          {matchPct}% match
        </div>
      )}

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
        {listing.operator && (
          <span style={{ fontSize: 10, color: 'var(--wc-muted)' }}>{listing.operator}</span>
        )}
      </div>

      <div
        style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, lineHeight: 1.3, color: 'var(--wc-text)' }}
      >
        {listing.name}
      </div>
      {location && (
        <div style={{ fontSize: 11, color: 'var(--wc-muted)', marginBottom: 10 }}>
          📍 {location}
        </div>
      )}

      {/* Tags (amenities) */}
      {listing.amenities && listing.amenities.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {listing.amenities.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 3,
                background: 'rgba(255,255,255,.06)',
                color: 'var(--wc-muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

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
  description: Record<string, unknown> | string | null
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
      <div style={{ fontSize: 14, color: 'var(--wc-muted)', maxWidth: 400, lineHeight: 1.8 }}>
        {typeof description === 'string' ? (
          <p>{description}</p>
        ) : description ? (
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          <RichText data={description as any} />
        ) : null}
      </div>
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
