import { NextRequest, NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/weconnect/embed'
import { createServerClient } from '@/lib/supabase/server'

interface SearchRequest {
  query: string
  filters?: {
    type?: string
    district?: string
    budget_max?: number
  }
}

/**
 * POST /api/search
 *
 * Hybrid search over weconnect.spaces.
 * Combines vector cosine similarity with BM25-style full-text search,
 * fused via Reciprocal Rank Fusion (RRF) in the hybrid_search_spaces RPC.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as SearchRequest

  if (!body.query || typeof body.query !== 'string') {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  try {
    const queryEmbedding = await generateEmbedding(body.query)

    const supabase = createServerClient()
    const { data, error } = await supabase
      .schema('weconnect')
      .rpc('hybrid_search_spaces', {
        query_text: body.query,
        query_embedding: queryEmbedding,
        match_count: 20,
        rrf_k: 60,
      })

    if (error) {
      console.error('hybrid_search_spaces RPC error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = (data ?? []) as {
      type: string; district: string; price_sgd_max: number | null
      similarity: number; text_rank: number; combined_score: number
    }[]

    // Quality filter: if ANY result has a positive text_rank (keyword match),
    // only keep results that also have a keyword match. This prevents vector-only
    // noise from diluting precise keyword queries like "gym" or "2 toilets".
    // If NO result has a keyword match, fall back to vector similarity >= 0.3.
    // If any result has a strong keyword match (text_rank >= 0.15), only keep
    // results that also have keyword signal. For weak/no text matches, fall back
    // to vector similarity. This prevents vector noise from diluting precise
    // keyword queries like "gym" or "2 toilets" while keeping broad semantic
    // queries like "near expo" working.
    const bestTextRank = Math.max(...results.map((r) => r.text_rank), 0)
    if (bestTextRank >= 0.15) {
      // Strong keyword signal exists — keep results with meaningful text match
      // (at least half the best match's score) OR high vector similarity
      const textThreshold = bestTextRank * 0.5
      results = results.filter((r) => r.text_rank >= textThreshold || r.similarity >= 0.45)
    } else {
      results = results.filter((r) => r.similarity >= 0.3)
    }

    // Post-filter if structured filters are provided
    if (body.filters?.type) {
      results = results.filter(
        (r: { type: string }) => r.type === body.filters!.type
      )
    }

    if (body.filters?.district) {
      results = results.filter(
        (r: { district: string }) =>
          r.district?.toLowerCase().includes(body.filters!.district!.toLowerCase())
      )
    }

    if (body.filters?.budget_max) {
      results = results.filter(
        (r: { price_sgd_max: number | null }) =>
          r.price_sgd_max === null || r.price_sgd_max <= body.filters!.budget_max!
      )
    }

    return NextResponse.json({ results: results.slice(0, 20) })
  } catch (err) {
    console.error('Search error:', err)
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
