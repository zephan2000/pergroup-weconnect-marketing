'use client'

/**
 * SpacesContent — the full Spaces browser extracted from WeConnectOverlay.
 * Contains search bar (filter + AI modes), facet chips, space card grid.
 * All data flow preserved from the original implementation.
 */

import { useEffect, useState } from 'react'
import type { SpaceWithSimilarity, SearchMode, Facets } from '@/hooks/useSpacesSearch'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'

// ── Chip styles ──
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

const AI_SUGGESTIONS = [
  'Biotech lab near NUS with grant eligibility',
  'Affordable coworking in CBD for 5-person team',
  'Industrial space with clean room certification',
  'Serviced office near MRT under $3k/month',
]

const AI_STATUS_PHASES = [
  'Analyzing your query · 分析查询中',
  'Matching spaces · 匹配空间中',
  'Ranking results · 排列结果中',
]

// ── Types ──
export interface SpacesContentProps {
  listings: SpaceWithSimilarity[]
  totalCount: number
  loading: boolean
  error: boolean
  settings: PlatformSettingsData
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
  showAiSuggestion: boolean
  dismissAiSuggestion: () => void
  acceptAiSuggestion: () => void
  onSelectSpace: (space: SpaceWithSimilarity) => void
}

export default function SpacesContent({
  listings,
  totalCount,
  loading,
  error,
  settings,
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
  showAiSuggestion,
  dismissAiSuggestion,
  acceptAiSuggestion,
  onSelectSpace,
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

  const priceChips: { key: string; label: string; count: number }[] = [
    { key: 'under2k', label: 'Under $2k', count: facets.priceRanges.under2k },
    { key: '2k5k', label: '$2k – $5k', count: facets.priceRanges.range2k5k },
    { key: '5kplus', label: '$5k+', count: facets.priceRanges.over5k },
  ]

  return (
    <>
      {/* ── Search bar ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,.08), rgba(139,92,246,.05))',
          border: '1px solid rgba(245,166,35,.2)',
          borderRadius: 14,
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
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
            {isAi ? '✦ AI Matching · 智能匹配' : '🔍 Search · 搜索'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--wc-text)' }}>
            {settings.aiMatchingHeadline}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--wc-muted)', marginBottom: 14, marginTop: 0 }}>
          {isAi
            ? settings.aiMatchingDescription
            : 'Filter by type, district, or price — or switch to AI for natural language search'}
        </p>

        {/* Input row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAi ? settings.aiMatchingPlaceholder : 'Search by name, address, district...'}
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
                {aiLoading ? '✦ Searching…' : '✦ Match'}
              </button>
            )}
          </div>

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
        </div>

        <div style={{ fontSize: 10, color: 'var(--wc-muted)', marginTop: 6, paddingLeft: 2 }}>
          {isAi ? 'Press Tab to switch to filter search · Press Enter to search' : 'Press Tab for AI Search'}
        </div>

        {/* AI suggestion banner */}
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
              This looks like a natural language query · 检测到自然语言查询
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
            AI_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} onClick={() => handleAiSearch(suggestion)} style={chipInactive}>
                {suggestion}
              </button>
            ))
          ) : (
            <>
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
              <span style={{ color: 'rgba(255,255,255,.12)', fontSize: 14, padding: '0 2px' }}>|</span>
              {facets.topDistricts.map(([district, count]) => (
                <button
                  key={`dist-${district}`}
                  onClick={() => toggleDistrict(district)}
                  style={activeDistricts.has(district) ? chipActive : chipInactive}
                >
                  {district} ({count})
                </button>
              ))}
              <span style={{ color: 'rgba(255,255,255,.12)', fontSize: 14, padding: '0 2px' }}>|</span>
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

      {/* ── Results ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--wc-text)' }}>
            {isAi ? 'AI Matches' : 'Available Spaces'}
          </h2>
          {!loading && !error && !aiLoading && (
            <span style={{ fontSize: 12, color: 'var(--wc-muted)' }}>
              {isAi
                ? `${listings.length} AI match${listings.length !== 1 ? 'es' : ''}`
                : `${listings.length} of ${totalCount} space${totalCount !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--wc-muted)', fontSize: 13 }}>
            Loading listings…
          </div>
        )}

        {aiLoading && <AiThinkingIndicator />}

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
                onSelect={() => onSelectSpace(listing)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

// ── AI thinking animation ──

function AiThinkingIndicator() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % AI_STATUS_PHASES.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 0', gap: 16 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#F5A623',
              opacity: phase % 3 === i ? 1 : 0.3,
              transition: 'opacity 0.4s ease',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#F5A623' }}>✦ Searching with AI · AI搜索中</div>
      <div style={{ fontSize: 12, color: 'var(--wc-muted)', transition: 'opacity 0.3s ease' }}>
        {AI_STATUS_PHASES[phase]}
      </div>
    </div>
  )
}

// ── Space card ──

function SpaceCard({ listing, similarity, onSelect }: { listing: SpaceWithSimilarity; similarity?: number; onSelect?: () => void }) {
  const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
    office: { color: '#F5A623', bg: 'rgba(245,166,35,.12)' },
    lab: { color: '#22C55E', bg: 'rgba(34,197,94,.12)' },
    coworking: { color: '#60A5FA', bg: 'rgba(96,165,250,.12)' },
    industrial: { color: '#A78BFA', bg: 'rgba(167,139,250,.12)' },
    factory: { color: '#F87171', bg: 'rgba(248,113,113,.12)' },
    retail: { color: '#FBBF24', bg: 'rgba(251,191,36,.12)' },
    studio: { color: '#34D399', bg: 'rgba(52,211,153,.12)' },
  }
  const { color: typeColor, bg: typeBg } = TYPE_COLORS[listing.type] ?? TYPE_COLORS.office

  const matchPct = similarity != null ? Math.round(similarity * 100) : null
  const matchColor = matchPct != null && matchPct >= 80 ? '#22C55E' : matchPct != null && matchPct >= 60 ? '#F5A623' : '#9CA3AF'

  const priceMin = listing.price_sgd_min != null ? `SGD ${Number(listing.price_sgd_min).toLocaleString()}` : null
  const priceMax = listing.price_sgd_max != null ? `SGD ${Number(listing.price_sgd_max).toLocaleString()}` : null
  const price = priceMin && priceMax && priceMin !== priceMax ? `${priceMin} – ${priceMax} /month` : priceMin ? `${priceMin} /month` : null

  const location = [listing.district, listing.address].filter(Boolean).join(' · ')

  return (
    <div
      onClick={onSelect}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
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
        {listing.operator && <span style={{ fontSize: 10, color: 'var(--wc-muted)' }}>{listing.operator}</span>}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, lineHeight: 1.3, color: 'var(--wc-text)' }}>
        {listing.name}
      </div>
      {location && <div style={{ fontSize: 11, color: 'var(--wc-muted)', marginBottom: 10 }}>📍 {location}</div>}

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
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)', marginBottom: 12 }}>{price}</div>
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
          onClick={(e) => { e.stopPropagation(); onSelect?.() }}
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
          View & Connect →
        </button>
      </div>
    </div>
  )
}
