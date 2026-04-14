'use client'

/**
 * NeedsScreen — "Post a Need" + "Share an Offering" cards,
 * plus the embedded Spaces browser below.
 * Uses warm light aesthetic matching the reference.
 */

import { useEffect, useState } from 'react'
import { Zap, Package, TrendingUp } from 'lucide-react'
import { fetchSpacesListings } from '@/app/actions/weconnect'
import type { Space } from '@/lib/supabase/schema'
import type { PlatformSettingsData } from '@/lib/weconnect/platform-settings'
import { useSpacesSearch, type SpaceWithSimilarity } from '@/hooks/useSpacesSearch'
import SpacesContent from '@/components/weconnect/SpacesContent'
import SpaceDetailModal from '@/components/weconnect/SpaceDetailModal'
import PostRequirementModal from '@/components/weconnect/PostRequirementModal'
import DotMotif from '@/components/DotMotif'

const recentNeeds = [
  {
    icon: Package,
    titleEn: 'Alternative logistics supplier — Southeast Asia',
    titleCn: '寻找东南亚替代物流供应商',
    tags: ['Logistics', 'Procurement'],
    time: '2d ago',
  },
  {
    icon: TrendingUp,
    titleEn: 'FX hedging advisory for SGD/CNY exposure',
    titleCn: '人民币对新元汇率对冲咨询',
    tags: ['Finance', 'Risk'],
    time: '4d ago',
  },
]

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

  return (
    <div className="space-y-4 pb-4">
      {/* Dual CTAs — keep original design, adapted to warm colours */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowRequirementModal(true)}
          className="w-full glass-card rounded-xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-amber" />
          </div>
          <div className="font-sora font-extrabold text-sm text-pg-text">
            Post a <span className="text-amber">Need</span>
          </div>
          <div className="font-noto-sans-sc text-xs text-amber mt-0.5">发布需求</div>
          <div className="text-[11px] text-muted mt-1">Tell us what you&apos;re looking for.</div>
        </button>

        <button
          onClick={() => setShowOfferingModal(true)}
          className="w-full glass-card rounded-xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-deep-orange/20 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-deep-orange" />
          </div>
          <div className="font-sora font-extrabold text-sm text-pg-text">
            Share What You <span className="text-amber">Offer</span>
          </div>
          <div className="font-noto-sans-sc text-xs text-amber mt-0.5">分享您的能力</div>
          <div className="text-[11px] text-muted mt-1">Let us know your capabilities.</div>
        </button>
      </div>

      {/* Intelligence Alert Preview */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="bg-bg-2 text-muted text-[10px] font-semibold px-3 py-1 rounded-full -translate-y-1/2">
            Preview / <span className="font-noto-sans-sc">示例预览</span>
          </span>
        </div>
        <div className="opacity-60 pointer-events-none select-none">
          <div className="glass-card rounded-xl p-5 relative overflow-hidden border-l-4 border-l-amber mt-2">
            <div className="absolute top-0 right-0">
              <DotMotif className="w-28 h-28" opacity={0.08} />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-alert-red/15 text-alert-red px-2.5 py-1 rounded-full mb-3">
                <Zap size={12} /> 紧急 URGENT
              </span>
              <h3 className="font-sora font-extrabold text-pg-text text-lg">Supply Chain Risk — Gulf Region</h3>
              <p className="font-noto-sans-sc text-muted text-sm mt-1">供应链风险预警 — 海湾地区</p>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                Oil prices exceeding $111/bbl and Gulf tensions may affect your logistics and energy cost exposure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Needs Preview */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="bg-bg-2 text-muted text-[10px] font-semibold px-3 py-1 rounded-full -translate-y-1/2">
            Coming Soon / <span className="font-noto-sans-sc">即将上线</span>
          </span>
        </div>
        <div className="opacity-60 pointer-events-none select-none space-y-3 mt-2">
          <p className="text-xs text-muted mb-2">Recent Needs / <span className="font-noto-sans-sc">最新需求</span></p>
          {recentNeeds.map((r) => (
            <div key={r.titleEn} className="glass-card rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber/15 flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-5 h-5 text-pg-text/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sora font-semibold text-sm text-pg-text leading-snug">{r.titleEn}</h4>
                  <p className="font-noto-sans-sc text-xs text-muted mt-0.5">{r.titleCn}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {r.tags.map((t) => (
                      <span key={t} className="bg-amber/10 text-deep-orange text-[10px] font-semibold px-2 py-0.5 rounded-md">{t}</span>
                    ))}
                    <span className="text-[10px] text-muted ml-auto">{r.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    </div>
  )
}
