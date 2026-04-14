'use client'

/**
 * NeedsScreen — "Post a Need" + "Share an Offering" cards,
 * plus the embedded Spaces browser below.
 */

import { useCallback, useEffect, useState } from 'react'
import { Zap, Package } from 'lucide-react'
import { fetchSpacesListings } from '@/app/actions/weconnect'
import type { Space } from '@/lib/supabase/schema'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import { useSpacesSearch, type SpaceWithSimilarity } from '@/hooks/useSpacesSearch'
import SpacesContent from '@/components/weconnect/SpacesContent'
import SpaceDetailModal from '@/components/weconnect/SpaceDetailModal'
import PostRequirementModal from '@/components/weconnect/PostRequirementModal'

interface NeedsScreenProps {
  settings: PlatformSettingsData
  isActive: boolean
}

export default function NeedsScreen({ settings, isActive }: NeedsScreenProps) {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [spacesLoading, setSpacesLoading] = useState(false)
  const [spacesError, setSpacesError] = useState(false)
  const [spacesFetched, setSpacesFetched] = useState(false)

  const search = useSpacesSearch(spaces)

  const [selectedSpace, setSelectedSpace] = useState<SpaceWithSimilarity | null>(null)
  const [showRequirementModal, setShowRequirementModal] = useState(false)
  const [showOfferingModal, setShowOfferingModal] = useState(false)

  // Fetch listings when this screen first becomes active
  useEffect(() => {
    if (isActive && !spacesFetched) {
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
  }, [isActive, spacesFetched])

  const handlePostNeed = useCallback(() => setShowRequirementModal(true), [])
  const handleShareOffering = useCallback(() => setShowOfferingModal(true), [])

  return (
    <>
      {/* CTA cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <button
          onClick={handlePostNeed}
          style={{
            background: 'linear-gradient(135deg, rgba(245,166,35,.1), rgba(245,166,35,.05))',
            border: '1px solid rgba(245,166,35,.25)',
            borderRadius: 12,
            padding: '20px 18px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(245,166,35,.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={18} color="#F5A623" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)' }}>Post a Need</div>
              <div style={{ fontSize: 11, color: 'var(--wc-muted)' }}>发布需求</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--wc-muted)', lineHeight: 1.5, margin: 0 }}>
            Tell PER GROUP what you&apos;re looking for. We&apos;ll match you with vetted suppliers.
          </p>
        </button>

        <button
          onClick={handleShareOffering}
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,.1), rgba(34,197,94,.05))',
            border: '1px solid rgba(34,197,94,.25)',
            borderRadius: 12,
            padding: '20px 18px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(34,197,94,.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Package size={18} color="#22C55E" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--wc-text)' }}>Share What You Offer</div>
              <div style={{ fontSize: 11, color: 'var(--wc-muted)' }}>分享您的服务</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--wc-muted)', lineHeight: 1.5, margin: 0 }}>
            Join PER GROUP&apos;s vetted supplier network and get matched with qualified buyers.
          </p>
        </button>
      </div>

      {/* Spaces browser */}
      <SpacesContent
        listings={search.filteredSpaces}
        totalCount={spaces.length}
        loading={spacesLoading}
        error={spacesError}
        settings={settings}
        onSelectSpace={setSelectedSpace}
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
        showAiSuggestion={search.showAiSuggestion}
        dismissAiSuggestion={search.dismissAiSuggestion}
        acceptAiSuggestion={search.acceptAiSuggestion}
      />

      {/* Modals */}
      {selectedSpace && (
        <SpaceDetailModal
          space={selectedSpace}
          similarity={selectedSpace.similarity}
          isOpen={!!selectedSpace}
          onClose={() => setSelectedSpace(null)}
          settings={settings}
        />
      )}
      <PostRequirementModal
        isOpen={showRequirementModal || showOfferingModal}
        onClose={() => { setShowRequirementModal(false); setShowOfferingModal(false) }}
        settings={settings}
      />
    </>
  )
}
