import { openrouter, EXTRACTION_MODEL } from '../../lib/openrouter'

/** Shape returned by the LLM extraction */
export interface ExtractedSpace {
  name: string
  operator: string | null
  type: 'office' | 'lab' | 'coworking' | 'industrial' | 'factory' | 'retail' | 'studio'
  address: string | null
  district: string | null
  area_sqft_min: number | null
  area_sqft_max: number | null
  price_sgd_min: number | null
  price_sgd_max: number | null
  lease_type: 'hot_desk' | 'dedicated_desk' | 'private_office' | 'whole_floor' | 'building' | 'flexible' | null
  amenities: string[]
  suitable_industries: string[]
  description_en: string | null
  description_zh: string | null
}

const SYSTEM_PROMPT = `You are a data extractor for a Singapore commercial real estate database.
Given raw Markdown scraped from a Singapore space listing page, return ONLY
a valid JSON object. No prose, no markdown fences, just raw JSON.

Extract these fields:
{
  "name": string,
  "operator": string,
  "type": "office"|"lab"|"coworking"|"industrial"|"factory"|"retail"|"studio",
  "address": string,
  "district": string,
  "area_sqft_min": number|null,
  "area_sqft_max": number|null,
  "price_sgd_min": number|null,
  "price_sgd_max": number|null,
  "lease_type": "hot_desk"|"dedicated_desk"|"private_office"|"whole_floor"|"building"|"flexible",
  "amenities": string[],
  "suitable_industries": string[],
  "description_en": string,
  "description_zh": string
}

Rules:
- district must be a Singapore district name e.g. "one-north", "CBD", "Jurong East"
- suitable_industries: infer from the description e.g. ["biotech", "fintech", "logistics"]
- description_en: 60-80 word neutral summary in English
- description_zh: same summary in Simplified Chinese
- Never fabricate prices or addresses. Use null if not found.`

/**
 * Extract structured space data from scraped markdown using Claude Haiku via OpenRouter.
 * Returns null if extraction or JSON parsing fails.
 */
export async function extractSpace(
  markdown: string,
  sourceUrl: string
): Promise<ExtractedSpace | null> {
  try {
    // Truncate to 6000 chars to stay within Haiku's sweet spot
    const truncated = markdown.slice(0, 6000)

    const response = await openrouter.chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Source: ${sourceUrl}\n\n${truncated}` },
      ],
      temperature: 0,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      console.warn(`extractSpace: empty response for ${sourceUrl}`)
      return null
    }

    const parsed = JSON.parse(content) as ExtractedSpace
    // Basic validation — must have a name at minimum
    if (!parsed.name || typeof parsed.name !== 'string') {
      console.warn(`extractSpace: invalid extraction (no name) for ${sourceUrl}`)
      return null
    }

    return parsed
  } catch (err) {
    console.error(`extractSpace failed for ${sourceUrl}:`, err)
    return null
  }
}
