import type { VercelRequest, VercelResponse } from '@vercel/node'
import { openrouter, EMBEDDING_MODEL } from '../../lib/openrouter'
import { supabase } from '../../lib/supabase'

export const config = { runtime: 'edge' }

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
 *
 * Request body:
 *   { query: string, filters?: { type?, district?, budget_max? } }
 *
 * Response:
 *   { results: SpaceRow[] }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as SearchRequest

  if (!body.query || typeof body.query !== 'string') {
    return res.status(400).json({ error: 'query is required' })
  }

  try {
    // 1. Embed the search query
    const embeddingResponse = await openrouter.embeddings.create({
      model: EMBEDDING_MODEL,
      input: body.query,
    })
    const queryEmbedding = embeddingResponse.data[0].embedding

    // 2. Call match_spaces RPC (filters pushed into post-processing for now;
    //    if performance becomes an issue, add filter params to the SQL function)
    const { data, error } = await supabase
      .schema('weconnect')
      .rpc('match_spaces', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 20,
      })

    if (error) {
      console.error('match_spaces RPC error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    // 3. Apply optional filters
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

    return res.status(200).json({ results: results.slice(0, 10) })
  } catch (err) {
    console.error('Search error:', err)
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return res.status(500).json({ error: msg })
  }
}
