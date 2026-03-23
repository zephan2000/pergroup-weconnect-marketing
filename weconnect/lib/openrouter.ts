import OpenAI from 'openai'

/**
 * OpenAI-compatible client pointed at OpenRouter.
 * All LLM (claude-haiku-4-5) and embedding (text-embedding-3-small) calls go through this.
 */
export const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': 'https://www.pergroup.sg',
    'X-Title': 'WeConnect Ingest',
  },
})

/** Model constants */
export const EXTRACTION_MODEL = 'anthropic/claude-haiku-4-5'
export const EMBEDDING_MODEL = 'openai/text-embedding-3-small'
