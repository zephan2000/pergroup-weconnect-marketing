'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Space } from '@/lib/supabase/schema'

export type SearchMode = 'filter' | 'ai'

export interface SpaceWithSimilarity extends Space {
  similarity?: number
}

export interface Facets {
  typeCounts: Map<string, number>
  topDistricts: [string, number][]
  priceRanges: { under2k: number; range2k5k: number; over5k: number }
}

/** Words that suggest the user is writing a natural language query */
const AI_INTENT_WORDS = ['near', 'with', 'under', 'for', 'budget', 'looking', 'need', 'want', 'affordable', 'suitable']

function looksLikeNaturalLanguage(query: string): boolean {
  const words = query.trim().split(/\s+/)
  if (words.length > 5) return true
  const lower = query.toLowerCase()
  return AI_INTENT_WORDS.some((w) => lower.includes(w))
}

export function useSpacesSearch(spaces: Space[]) {
  const [searchMode, setSearchMode] = useState<SearchMode>('filter')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set())
  const [activeDistricts, setActiveDistricts] = useState<Set<string>>(new Set())
  const [activePriceRanges, setActivePriceRanges] = useState<Set<string>>(new Set())
  const [aiResults, setAiResults] = useState<SpaceWithSimilarity[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestionDismissed, setAiSuggestionDismissed] = useState(false)

  // Show AI suggestion banner when query looks like natural language
  const showAiSuggestion = searchMode === 'filter'
    && searchQuery.trim().length > 0
    && looksLikeNaturalLanguage(searchQuery)
    && !aiSuggestionDismissed

  // Facet counts computed from full dataset (not filtered)
  const facets = useMemo<Facets>(() => {
    const typeCounts = new Map<string, number>()
    const districtCounts = new Map<string, number>()
    let under2k = 0, range2k5k = 0, over5k = 0

    for (const s of spaces) {
      typeCounts.set(s.type, (typeCounts.get(s.type) ?? 0) + 1)

      if (s.district) {
        districtCounts.set(s.district, (districtCounts.get(s.district) ?? 0) + 1)
      }

      const price = s.price_sgd_max ?? s.price_sgd_min
      if (price != null) {
        if (price < 2000) under2k++
        else if (price <= 5000) range2k5k++
        else over5k++
      }
    }

    const topDistricts = [...districtCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return { typeCounts, topDistricts, priceRanges: { under2k, range2k5k, over5k } }
  }, [spaces])

  // Client-side filtering (filter mode) or return AI results
  const filteredSpaces = useMemo<SpaceWithSimilarity[]>(() => {
    if (searchMode === 'ai') return aiResults

    let result: SpaceWithSimilarity[] = spaces

    // Text search (case-insensitive substring on name, address, district, operator)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.address?.toLowerCase().includes(q)) ||
          (s.district?.toLowerCase().includes(q)) ||
          (s.operator?.toLowerCase().includes(q))
      )
    }

    // Type filter (OR within group)
    if (activeTypes.size > 0) {
      result = result.filter((s) => activeTypes.has(s.type))
    }

    // District filter (OR within group)
    if (activeDistricts.size > 0) {
      result = result.filter((s) => s.district != null && activeDistricts.has(s.district))
    }

    // Price range filter (OR within group)
    if (activePriceRanges.size > 0) {
      result = result.filter((s) => {
        const price = s.price_sgd_max ?? s.price_sgd_min
        if (price == null) return false
        if (activePriceRanges.has('under2k') && price < 2000) return true
        if (activePriceRanges.has('2k5k') && price >= 2000 && price <= 5000) return true
        if (activePriceRanges.has('5kplus') && price > 5000) return true
        return false
      })
    }

    return result
  }, [spaces, aiResults, searchMode, searchQuery, activeTypes, activeDistricts, activePriceRanges])

  // Chip toggle helpers
  const toggleType = useCallback((type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }, [])

  const toggleDistrict = useCallback((district: string) => {
    setActiveDistricts((prev) => {
      const next = new Set(prev)
      if (next.has(district)) next.delete(district)
      else next.add(district)
      return next
    })
  }, [])

  const togglePriceRange = useCallback((range: string) => {
    setActivePriceRanges((prev) => {
      const next = new Set(prev)
      if (next.has(range)) next.delete(range)
      else next.add(range)
      return next
    })
  }, [])

  // AI search handler
  const handleAiSearch = useCallback(async (query?: string) => {
    const q = (query ?? searchQuery).trim()
    if (!q) return
    if (query) setSearchQuery(q)
    setAiLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (data.results) {
        setAiResults(data.results)
      }
    } catch (err) {
      console.error('AI search failed:', err)
    } finally {
      setAiLoading(false)
    }
  }, [searchQuery])

  // Mode switching
  const switchToAi = useCallback(() => {
    setSearchMode('ai')
    setActiveTypes(new Set())
    setActiveDistricts(new Set())
    setActivePriceRanges(new Set())
    setAiSuggestionDismissed(false)
    if (searchQuery.trim()) {
      // Auto-trigger AI search with current query
      handleAiSearch()
    }
  }, [searchQuery, handleAiSearch])

  const switchToFilter = useCallback(() => {
    setSearchMode('filter')
    setAiResults([])
    setAiSuggestionDismissed(false)
  }, [])

  const toggleMode = useCallback(() => {
    if (searchMode === 'filter') switchToAi()
    else switchToFilter()
  }, [searchMode, switchToAi, switchToFilter])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setActiveTypes(new Set())
    setActiveDistricts(new Set())
    setActivePriceRanges(new Set())
    setAiResults([])
    setAiSuggestionDismissed(false)
    if (searchMode === 'ai') setSearchMode('filter')
  }, [searchMode])

  const dismissAiSuggestion = useCallback(() => {
    setAiSuggestionDismissed(true)
  }, [])

  const acceptAiSuggestion = useCallback(() => {
    switchToAi()
  }, [switchToAi])

  // Auto-switch back to filter mode when query is cleared (e.g. backspace to empty)
  const setSearchQueryWithAutoReset = useCallback((q: string) => {
    setSearchQuery(q)
    if (q.trim() === '' && searchMode === 'ai') {
      setSearchMode('filter')
      setAiResults([])
      setAiSuggestionDismissed(false)
    }
  }, [searchMode])

  return {
    searchMode,
    searchQuery,
    setSearchQuery: setSearchQueryWithAutoReset,
    activeTypes,
    activeDistricts,
    activePriceRanges,
    toggleType,
    toggleDistrict,
    togglePriceRange,
    filteredSpaces,
    facets,
    handleAiSearch,
    aiLoading,
    toggleMode,
    clearSearch,
    showAiSuggestion,
    dismissAiSuggestion,
    acceptAiSuggestion,
  }
}
