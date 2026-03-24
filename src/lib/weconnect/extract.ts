import { openrouter, EXTRACTION_MODEL } from './openrouter'

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

/** Strip markdown fences that LLMs sometimes wrap around JSON */
function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
}

const SINGLE_PROMPT = `You are a data extractor for a Singapore commercial real estate database.
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

const MULTI_PROMPT = `You are a data extractor for a Singapore commercial real estate database.
The Markdown below is a SEARCH RESULTS PAGE containing MULTIPLE space listings.
Extract EVERY listing you can find and return a JSON object: { "spaces": [...] }
where each element has these fields:

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
- Extract every distinct listing on the page — there may be 5-20+
- district must be a Singapore district name e.g. "one-north", "CBD", "Jurong East"
- suitable_industries: infer from context e.g. ["biotech", "fintech", "logistics"]
- description_en: 30-50 word neutral summary in English
- description_zh: same summary in Simplified Chinese
- Never fabricate prices or addresses. Use null if not found.
- If a field is ambiguous for a listing, use null rather than guessing.`

/**
 * Extract a single space from a detail page.
 */
export async function extractSpace(
  markdown: string,
  sourceUrl: string
): Promise<ExtractedSpace | null> {
  try {
    const truncated = markdown.slice(0, 6000)

    const response = await openrouter.chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        { role: 'system', content: SINGLE_PROMPT },
        { role: 'user', content: `Source: ${sourceUrl}\n\n${truncated}` },
      ],
      temperature: 0,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    })

    let content = response.choices[0]?.message?.content
    if (!content) {
      console.warn(`extractSpace: empty response for ${sourceUrl}`)
      return null
    }

    content = stripFences(content)
    const parsed = JSON.parse(content) as ExtractedSpace
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

/**
 * Extract multiple spaces from a search results / index page.
 * Uses a larger context window and asks the LLM to return an array.
 */
export async function extractSpaces(
  markdown: string,
  sourceUrl: string
): Promise<ExtractedSpace[]> {
  try {
    // Allow more content for multi-listing pages
    const truncated = markdown.slice(0, 12000)

    const response = await openrouter.chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        { role: 'system', content: MULTI_PROMPT },
        { role: 'user', content: `Source: ${sourceUrl}\n\n${truncated}` },
      ],
      temperature: 0,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })

    let content = response.choices[0]?.message?.content
    if (!content) {
      console.warn(`extractSpaces: empty response for ${sourceUrl}`)
      return []
    }

    content = stripFences(content)
    const parsed = JSON.parse(content) as { spaces: ExtractedSpace[] }

    if (!parsed.spaces || !Array.isArray(parsed.spaces)) {
      console.warn(`extractSpaces: response missing spaces array for ${sourceUrl}`)
      return []
    }

    const valid = parsed.spaces.filter(
      (s) => s.name && typeof s.name === 'string'
    )
    console.log(`extractSpaces: got ${valid.length} spaces from ${sourceUrl}`)
    return valid
  } catch (err) {
    console.error(`extractSpaces failed for ${sourceUrl}:`, err)
    return []
  }
}
