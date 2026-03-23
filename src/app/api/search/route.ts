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
 * Semantic search over weconnect.spaces.
 * Embeds the query, calls match_spaces RPC, applies optional filters.
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
      .rpc('match_spaces', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 20,
      })

    if (error) {
      console.error('match_spaces RPC error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = data ?? []

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

    return NextResponse.json({ results: results.slice(0, 10) })
  } catch (err) {
    console.error('Search error:', err)
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
