import { openrouter, EMBEDDING_MODEL } from '../../lib/openrouter'
import { upsertSpace, type SpaceRow } from '../../lib/supabase'
import type { ExtractedSpace } from './extract'

/**
 * Build the text input for embedding.
 * Joins key fields with ' · ' for rich semantic coverage across both languages.
 */
function buildEmbedInput(space: ExtractedSpace): string {
  const parts = [
    space.name,
    space.type,
    space.district,
    space.description_en,
    space.description_zh,
    space.amenities?.join(', '),
    space.suitable_industries?.join(', '),
    space.lease_type,
  ].filter(Boolean)

  return parts.join(' · ')
}

/**
 * Generate a 1536-dim embedding for the given text via OpenRouter.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openrouter.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  })
  return response.data[0].embedding
}

/**
 * Generate an embedding for the extracted space data and upsert into Supabase.
 * Deduplicates on source_url.
 */
export async function embedAndUpsert(
  space: ExtractedSpace,
  sourceUrl: string,
  sourceName: string
): Promise<void> {
  const embedInput = buildEmbedInput(space)
  const embedding = await generateEmbedding(embedInput)

  const row: SpaceRow = {
    name: space.name,
    operator: space.operator,
    type: space.type,
    address: space.address,
    district: space.district,
    area_sqft_min: space.area_sqft_min,
    area_sqft_max: space.area_sqft_max,
    price_sgd_min: space.price_sgd_min,
    price_sgd_max: space.price_sgd_max,
    lease_type: space.lease_type,
    amenities: space.amenities ?? [],
    suitable_industries: space.suitable_industries ?? [],
    description_en: space.description_en,
    description_zh: space.description_zh,
    source_url: sourceUrl,
    source_name: sourceName,
    embedding,
    last_scraped_at: new Date().toISOString(),
  }

  await upsertSpace(row)
}
